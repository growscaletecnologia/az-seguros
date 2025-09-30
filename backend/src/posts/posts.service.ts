import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { PostStatus, Prisma, User } from '@prisma/client'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import prisma from 'src/prisma/client'
// Adicionando tipagem para Express.Multer.File
import 'multer'

@Injectable()
export class PostsService {
  /**
   * Aplica imagem padrão aos posts que não possuem coverImage
   * @param posts Array de posts ou post único
   * @returns Posts com coverImage garantida
   */
  private applyDefaultCoverImage<T extends { coverImage?: string | null }>(posts: T[]): T[]
  private applyDefaultCoverImage<T extends { coverImage?: string | null }>(post: T): T
  private applyDefaultCoverImage<T extends { coverImage?: string | null }>(
    postsOrPost: T[] | T,
  ): T[] | T {
    if (Array.isArray(postsOrPost)) {
      return postsOrPost.map((post) => ({
        ...post,
        coverImage: this.getDefaultCoverImage(post.coverImage),
      }))
    } else {
      return {
        ...postsOrPost,
        coverImage: this.getDefaultCoverImage(postsOrPost.coverImage),
      }
    }
  }

  /**
   * Define uma imagem padrão de capa se nenhuma for especificada
   * @param coverImage URL da imagem de capa atual
   * @returns URL da imagem de capa (original ou padrão)
   */
  private getDefaultCoverImage(coverImage?: string | null): string {
    return coverImage || '/images/blog-placeholder.svg'
  }

  async create(createPostDto: CreatePostDto, user: User) {
    try {
      // Validação dos campos obrigatórios apenas para posts publicados
      if (createPostDto.status === PostStatus.PUBLISHED) {
        if (!createPostDto.title) {
          throw new HttpException(
            'O título do post é obrigatório para publicação',
            HttpStatus.UNPROCESSABLE_ENTITY,
          )
        }

        if (!createPostDto.slug) {
          throw new HttpException(
            'O slug do post é obrigatório para publicação',
            HttpStatus.UNPROCESSABLE_ENTITY,
          )
        }

        if (!createPostDto.content) {
          throw new HttpException(
            'O conteúdo do post é obrigatório para publicação',
            HttpStatus.UNPROCESSABLE_ENTITY,
          )
        }
      } else {
        // Para rascunhos, apenas título é obrigatório
        if (!createPostDto.title) {
          throw new HttpException('O título do post é obrigatório', HttpStatus.UNPROCESSABLE_ENTITY)
        }
      }

      // Gerar slug automático se não fornecido (para rascunhos)
      let slug = createPostDto.slug
      if (!slug && createPostDto.title) {
        slug = createPostDto.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
          .replace(/\s+/g, '-') // Substitui espaços por hífens
          .replace(/-+/g, '-') // Remove hífens duplicados
          .trim()
      }

      // Verificar se já existe um post com o mesmo slug (apenas se slug foi fornecido)
      if (slug) {
        const existentPost = await prisma.post.findUnique({
          where: {
            slug: slug,
          },
        })

        if (existentPost) {
          throw new HttpException('Esse slug já está sendo usado, crie outro.', HttpStatus.CONFLICT)
        }
      }

      // Garantir que categoryIds e tagIds sejam arrays válidos
      const categoryIds = Array.isArray(createPostDto.categoryIds) ? createPostDto.categoryIds : []
      const tagIds = Array.isArray(createPostDto.tagIds) ? createPostDto.tagIds : []

      // Validar e sanitizar o conteúdo HTML
      let content = createPostDto.content || ''
      try {
        // Remover possíveis escapes duplos no conteúdo HTML
        content = content.replace(/\\"/g, '"').replace(/\\'/g, "'")
      } catch (e) {
        console.warn('Erro ao sanitizar conteúdo HTML:', e)
        // Continua com o conteúdo original se houver erro
      }

      // Garantir que metadata seja um objeto válido
      let metadata = {}
      try {
        if (typeof createPostDto.metadata === 'string') {
          metadata = JSON.parse(createPostDto.metadata)
        } else if (createPostDto.metadata && typeof createPostDto.metadata === 'object') {
          metadata = createPostDto.metadata
        } else {
          metadata = {
            title: createPostDto.title || '',
            description: createPostDto.resume || '',
            keywords: '',
          }
        }
      } catch (e) {
        console.warn('Erro ao processar metadata:', e)
        metadata = {
          title: createPostDto.title || '',
          description: createPostDto.resume || '',
          keywords: '',
        }
      }

      // Buscar a primeira categoria para gerar a URL completa
      let fullUrl: string | null = null
      if (slug) {
        if (createPostDto.fullUrl) {
          fullUrl = createPostDto.fullUrl
        } else if (categoryIds.length > 0) {
          // Buscar o slug da primeira categoria
          const firstCategory = await prisma.category.findUnique({
            where: { id: categoryIds[0] },
            select: { slug: true },
          })

          if (firstCategory) {
            // Normalizar o slug da categoria (remover acentos e espaços)
            const categorySlug = firstCategory.slug
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^\w\s]/g, '')
              .replace(/\s+/g, '-')

            fullUrl = `/blog/${categorySlug}/${slug}`
          } else {
            fullUrl = `/blog/${slug}`
          }
        } else {
          fullUrl = `/blog/${slug}`
        }
      }

      // Definir imagem de capa padrão se não fornecida
      const coverImage = this.getDefaultCoverImage(createPostDto.coverImage)

      // Criar o post com as relações
      const post = await prisma.post.create({
        data: {
          // Usar userId diretamente já que o objeto user pode não ter todos os campos
          userId: user?.id || user?.id, // Tenta usar userId do JWT ou id se disponível
          title: createPostDto.title,
          slug: slug!, // Usar o slug gerado ou fornecido
          content: content,
          resume: createPostDto.resume || '',
          description: createPostDto.resume || '', // Usando resume como description já que não existe no DTO
          metadata: metadata as any,
          status: createPostDto.status,
          fullUrl: fullUrl,
          coverImage: coverImage, // Usar imagem padrão se não fornecida
          updatedBy: user?.id,

          // Conectar categorias (apenas se houver IDs válidos)
          categories:
            categoryIds.length > 0
              ? {
                  create: categoryIds.map((categoryId) => ({
                    category: {
                      connect: { id: categoryId },
                    },
                  })),
                }
              : undefined,

          // Conectar tags (apenas se houver IDs válidos)
          tags:
            tagIds.length > 0
              ? {
                  create: tagIds.map((tagId) => ({
                    tag: {
                      connect: { id: tagId },
                    },
                  })),
                }
              : undefined,
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          media: true,
        },
      })

      return { post }
    } catch (error) {
      console.error('Erro ao criar post:', error)

      // Se já for uma HttpException, apenas repassa
      if (error instanceof HttpException) {
        throw error
      }

      // Erros de validação do Prisma (geralmente relacionados a campos obrigatórios ou tipos incorretos)
      if (error.code === 'P2002') {
        throw new HttpException(
          `Campo único já existe: ${error.meta?.target || 'desconhecido'}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }

      if (error.code === 'P2003') {
        throw new HttpException(
          `Referência inválida: ${error.meta?.field_name || 'campo desconhecido'}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }

      // Erro de formato de dados
      if (error.name === 'SyntaxError' || error.name === 'TypeError') {
        throw new HttpException(
          `Erro de formato nos dados: ${error.message}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }

      // Outros erros são tratados como 422 para evitar 500
      throw new HttpException(
        `Erro ao processar dados do post: ${error.message || 'Erro desconhecido'}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
  }

  /**
   * Busca todos os posts com paginação e filtro de busca por texto
   * @param page Número da página
   * @param limit Limite de itens por página
   * @param search Texto para busca no título, descrição ou conteúdo
   * @returns Lista de posts com paginação
   */
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit

    // Construir filtro de busca
    const whereClause = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
            { content: { contains: search, mode: 'insensitive' as const } },
            { resume: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const total = await prisma.post.count({ where: whereClause })

    if (total < limit) limit = total

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        media: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    })

    const nextPage = page < Math.ceil(total / limit) ? page + 1 : null

    // Aplicar imagem padrão aos posts
    const postsWithDefaultImages = this.applyDefaultCoverImage(posts)

    return { posts: postsWithDefaultImages, total, nextPage }
  }

  async findAllByStatus(status: PostStatus, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit

    // Construir filtro de busca combinado com status
    const whereClause = {
      status,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
              { content: { contains: search, mode: 'insensitive' as const } },
              { resume: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const total = await prisma.post.count({
      where: whereClause,
    })

    if (total < limit) limit = total

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        media: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    })

    const nextPage = page < Math.ceil(total / limit) ? page + 1 : null

    // Aplicar imagem padrão aos posts
    const postsWithDefaultImages = this.applyDefaultCoverImage(posts)

    return { posts: postsWithDefaultImages, nextPage, total }
  }

  async findOne(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        media: true,
        tags: {
          include: {
            tag: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    // Aplicar imagem padrão ao post
    const postWithDefaultImage = this.applyDefaultCoverImage(post)

    return postWithDefaultImage
  }

  async findBySlug(slug: string) {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        status: PostStatus.PUBLISHED, // Apenas posts publicados podem ser acessados publicamente
      },
      include: {
        media: true,
        tags: {
          include: {
            tag: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    // Aplicar imagem padrão ao post
    const postWithDefaultImage = this.applyDefaultCoverImage(post)

    return postWithDefaultImage
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
      },
    })

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    // Validação dos campos obrigatórios apenas para posts sendo publicados
    if (updatePostDto.status === PostStatus.PUBLISHED) {
      if (!updatePostDto.title && !post.title) {
        throw new HttpException(
          'O título do post é obrigatório para publicação',
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }

      if (!updatePostDto.slug && !post.slug) {
        throw new HttpException(
          'O slug do post é obrigatório para publicação',
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }

      if (!updatePostDto.content && !post.content) {
        throw new HttpException(
          'O conteúdo do post é obrigatório para publicação',
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }
    }

    // Gerar slug automático se não fornecido e título foi atualizado
    let slug = updatePostDto.slug
    if (!slug && updatePostDto.title && !post.slug) {
      slug = updatePostDto.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .trim()
    }

    // Verificar se o slug já existe em outro post (se o slug foi alterado)
    const finalSlug = slug || updatePostDto.slug || post.slug
    if (finalSlug && finalSlug !== post.slug) {
      const existentPost = await prisma.post.findUnique({
        where: {
          slug: finalSlug,
        },
      })

      if (existentPost && existentPost.id !== id) {
        throw new HttpException('Esse slug já está sendo usado, crie outro.', HttpStatus.CONFLICT)
      }
    }

    // Atualizar o post com transação para garantir consistência
    return prisma.$transaction(async (prisma) => {
      // Remover relações existentes se necessário
      if (updatePostDto.categoryIds) {
        await prisma.postCategory.deleteMany({
          where: { postId: id },
        })
      }

      if (updatePostDto.tagIds) {
        await prisma.postTag.deleteMany({
          where: { postId: id },
        })
      }

      // Gerar fullUrl baseada na categoria se houver
      let fullUrl: string | null = post.fullUrl
      if (finalSlug) {
        if (updatePostDto.fullUrl) {
          fullUrl = updatePostDto.fullUrl
        } else if (updatePostDto.categoryIds && updatePostDto.categoryIds.length > 0) {
          // Buscar o slug da primeira categoria
          const firstCategory = await prisma.category.findUnique({
            where: { id: updatePostDto.categoryIds[0] },
            select: { slug: true },
          })

          if (firstCategory) {
            // Normalizar o slug da categoria (remover acentos e espaços)
            const categorySlug = firstCategory.slug
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^\w\s]/g, '')
              .replace(/\s+/g, '-')

            fullUrl = `/blog/${categorySlug}/${finalSlug}`
          } else {
            fullUrl = `/blog/${finalSlug}`
          }
        } else if (!updatePostDto.fullUrl) {
          // Se não há categorias sendo atualizadas, manter a estrutura existente ou usar padrão
          fullUrl = `/blog/${finalSlug}`
        }
      }

      // Definir imagem de capa padrão se não fornecida
      const coverImage = updatePostDto.coverImage || post.coverImage || this.getDefaultCoverImage()

      // Atualizar o post
      const updated = await prisma.post.update({
        where: { id },
        data: {
          title: updatePostDto.title || post.title,
          slug: finalSlug,
          content: updatePostDto.content || post.content,
          resume: updatePostDto.resume || post.resume,
          description: updatePostDto.resume || post.resume, // Usando resume como description já que não existe no DTO
          metadata: updatePostDto.metadata
            ? (updatePostDto.metadata as any)
            : post.metadata
              ? (post.metadata as any)
              : Prisma.DbNull,
          status: updatePostDto.status || post.status,
          fullUrl: fullUrl,
          coverImage: coverImage, // Usar imagem padrão se não fornecida
          updatedBy: userId,
          updatedAt: new Date(),
          publishedAt:
            updatePostDto.status === PostStatus.PUBLISHED
              ? post.publishedAt || new Date()
              : post.publishedAt,

          // Reconectar categorias se fornecidas
          categories: updatePostDto.categoryIds
            ? {
                create: updatePostDto.categoryIds.map((categoryId) => ({
                  category: {
                    connect: { id: categoryId },
                  },
                })),
              }
            : undefined,

          // Reconectar tags se fornecidas
          tags: updatePostDto.tagIds
            ? {
                create: updatePostDto.tagIds.map((tagId) => ({
                  tag: {
                    connect: { id: tagId },
                  },
                })),
              }
            : undefined,
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          media: true,
        },
      })

      return updated
    })
  }

  async remove(id: string): Promise<void> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        media: true,
      },
    })

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    // Remover todas as mídias associadas ao post
    if (post.media && post.media.length > 0) {
      for (const media of post.media) {
        // Remover arquivo físico
        try {
          const uploadDirectory = join(process.cwd(), 'dist', 'public')
          const prodDirectory = join(process.cwd(), 'public')

          const filePath = join(uploadDirectory, media.url)
          const filePathProd = join(prodDirectory, media.url)

          await Promise.all([
            unlink(filePath).catch((error) =>
              console.error(`Erro ao deletar o arquivo: ${filePath}`, error),
            ),
            unlink(filePathProd).catch((error) =>
              console.error(`Erro ao deletar o arquivo: ${filePathProd}`, error),
            ),
          ])
        } catch (error) {
          console.error(`Erro ao remover arquivo: ${error.message}`)
        }
      }
    }

    // Excluir o post e seus relacionamentos em uma transação
    await prisma.$transaction(async (prisma) => {
      // Excluir relacionamentos primeiro (as relações têm onDelete: Cascade, mas é bom ser explícito)
      await prisma.postTag.deleteMany({
        where: { postId: id },
      })

      await prisma.postCategory.deleteMany({
        where: { postId: id },
      })

      await prisma.postMedia.deleteMany({
        where: { postId: id },
      })

      // Finalmente excluir o post
      await prisma.post.delete({
        where: { id },
      })
    })
  }

  // Método de upload de imagem principal removido temporariamente para simplificação

  /**
   * Upload da imagem de capa do post
   * @param file Arquivo de imagem
   * @param postId ID do post
   * @returns URL da imagem de capa
   */
  async uploadCoverImage(file: Express.Multer.File, postId: string) {
    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    const fileUrl = `/uploads/posts/${file.filename}`

    // Atualizar o post com a URL da imagem de capa
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        coverImage: fileUrl,
      },
    })

    // Também criar um registro na tabela PostMedia para manter consistência
    await prisma.postMedia.create({
      data: {
        url: fileUrl,
        type: file.mimetype,
        alt: `Imagem de capa - ${post.title}`,
        isMain: false, // A imagem de capa não é considerada imagem principal
        post: {
          connect: { id: postId },
        },
      },
    })

    return {
      message: 'Imagem de capa enviada com sucesso',
      coverImage: fileUrl,
      post: updatedPost,
    }
  }

  /**
   * Upload da imagem principal do post
   * @param file Arquivo de imagem
   * @param postId ID do post
   * @returns Informações da mídia salva
   */
  async uploadMainImage(file: Express.Multer.File, postId: string) {
    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    // Verificar se já existe uma imagem principal e removê-la como principal
    const existingMainImage = await prisma.postMedia.findFirst({
      where: {
        postId,
        isMain: true,
      },
    })

    if (existingMainImage) {
      await prisma.postMedia.update({
        where: { id: existingMainImage.id },
        data: { isMain: false },
      })
    }

    const fileUrl = `/uploads/posts/${file.filename}`

    // Criar nova mídia como principal
    const media = await prisma.postMedia.create({
      data: {
        url: fileUrl,
        type: file.mimetype,
        alt: file.originalname,
        // Removendo o campo size que não existe no schema
        isMain: true,
        post: {
          connect: { id: postId },
        },
      },
    })

    // Atualizar o post com a URL da imagem principal
    // O campo mainImageUrl não existe no schema, então não podemos usá-lo diretamente
    await prisma.post.update({
      where: { id: postId },
      data: {
        // Usando metadata para armazenar a URL da imagem principal
        metadata: {
          mainImageUrl: fileUrl,
        },
      },
    })

    return media
  }
  async uploadGallery(files: Array<Express.Multer.File>, postId: string) {
    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    const mediaItems: any[] = []

    // Salvar cada arquivo no banco de dados
    for (const file of files) {
      const fileUrl = `/uploads/posts/${file.filename}`

      const media = await prisma.postMedia.create({
        data: {
          url: fileUrl,
          type: file.mimetype,
          alt: file.originalname,
          // Removendo o campo size que não existe no schema
          isMain: false,
          post: {
            connect: { id: postId },
          },
        },
      })

      mediaItems.push(media)
    }

    return mediaItems
  }

  /**
   * Remove uma mídia do post
   * @param id ID da mídia
   */
  async removeMedia(id: string): Promise<void> {
    const media = await prisma.postMedia.findUnique({
      where: { id },
    })

    if (!media) {
      throw new NotFoundException('Mídia não encontrada')
    }

    // Remover arquivo físico
    try {
      const uploadDirectory = join(process.cwd(), 'dist', 'public')
      const prodDirectory = join(process.cwd(), 'public')

      const filePath = join(uploadDirectory, media.url)
      const filePathProd = join(prodDirectory, media.url)

      await Promise.all([
        unlink(filePath).catch((error) =>
          console.error(`Erro ao deletar o arquivo: ${filePath}`, error),
        ),
        unlink(filePathProd).catch((error) =>
          console.error(`Erro ao deletar o arquivo: ${filePathProd}`, error),
        ),
      ])
    } catch (error) {
      console.error(`Erro ao remover arquivo: ${error.message}`)
    }

    // Se for a imagem principal, atualizar o post
    if (media.isMain) {
      await prisma.post.update({
        where: { id: media.postId },
        data: {
          // Usando metadata para armazenar a URL da imagem principal
          metadata: {
            mainImageUrl: null,
          },
        },
      })
    }

    // Remover registro do banco de dados
    await prisma.postMedia.delete({
      where: { id },
    })
  }
}
