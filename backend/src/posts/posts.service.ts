import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { PostStatus, User } from '@prisma/client'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import prisma from 'src/prisma/client'
// Adicionando tipagem para Express.Multer.File
import 'multer'

@Injectable()
export class PostsService {
  async create(createPostDto: CreatePostDto, user: User) {
    try {
      // Validação dos campos obrigatórios
      if (!createPostDto.title) {
        throw new HttpException('O título do post é obrigatório', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      if (!createPostDto.slug) {
        throw new HttpException('O slug do post é obrigatório', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      // Verificar se já existe um post com o mesmo slug
      const existentPost = await prisma.post.findUnique({
        where: {
          slug: createPostDto.slug,
        },
      })

      if (existentPost) {
        throw new HttpException('Esse slug já está sendo usado, crie outro.', HttpStatus.CONFLICT)
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

      // Criar o post com as relações
      const post = await prisma.post.create({
        data: {
          // Usar userId diretamente já que o objeto user pode não ter todos os campos
          userId: user?.id || user?.id, // Tenta usar userId do JWT ou id se disponível
          title: createPostDto.title,
          slug: createPostDto.slug,
          content: content,
          resume: createPostDto.resume || '',
          description: createPostDto.resume || '', // Usando resume como description já que não existe no DTO
          metadata: metadata as any,
          status: createPostDto.status,
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

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const total = await prisma.post.count()

    if (total < limit) limit = total

    const posts = await prisma.post.findMany({
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

    return { posts, total, nextPage }
  }

  async findAllByStatus(status: PostStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const total = await prisma.post.count({
      where: { status },
    })

    if (total < limit) limit = total

    const posts = await prisma.post.findMany({
      where: {
        status,
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

    return { posts, nextPage, total }
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

    return post
  }

  async findBySlug(slug: string) {
    const post = await prisma.post.findUnique({
      where: { slug },
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

    return post
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

      // Atualizar o post
      const updated = await prisma.post.update({
        where: { id },
        data: {
          title: updatePostDto.title,
          slug: updatePostDto.slug,
          content: updatePostDto.content,
          resume: updatePostDto.resume,
          description: updatePostDto.resume, // Usando resume como description já que não existe no DTO
          metadata: updatePostDto.metadata as any,
          status: updatePostDto.status,
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
