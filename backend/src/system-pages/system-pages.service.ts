import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { SystemPageStatus } from '@prisma/client'
import prisma from 'src/prisma/client'
import { CreateSystemPageDto } from './dto/create-system-page.dto'
import { UpdateSystemPageDto } from './dto/update-system-page.dto'

@Injectable()
export class SystemPagesService {
  /**
   * Cria uma nova página do sistema
   */
  async create(createSystemPageDto: CreateSystemPageDto, userId: string) {
    try {
      // Validação dos campos obrigatórios
      if (!createSystemPageDto.title) {
        throw new HttpException('O título da página é obrigatório', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      if (!createSystemPageDto.slug) {
        throw new HttpException('O slug da página é obrigatório', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      // Verificar se já existe uma página com o mesmo slug
      const existentPage = await prisma.systemPage.findUnique({
        where: {
          slug: createSystemPageDto.slug,
        },
      })

      if (existentPage) {
        throw new HttpException('Esse slug já está sendo usado, crie outro.', HttpStatus.CONFLICT)
      }

      // Criar a página do sistema
      const systemPage = await prisma.systemPage.create({
        data: {
          title: createSystemPageDto.title,
          slug: createSystemPageDto.slug,
          content: createSystemPageDto.content,
          type: createSystemPageDto.type,
          status: createSystemPageDto.status || SystemPageStatus.DRAFT,
          updatedBy: userId,
        },
      })

      return systemPage
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException('Erro ao criar página do sistema', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Lista todas as páginas do sistema com paginação
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const total = await prisma.systemPage.count()

    if (total < limit) limit = total

    const systemPages = await prisma.systemPage.findMany({
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    })

    const nextPage = page < Math.ceil(total / limit) ? page + 1 : null

    return { systemPages, nextPage, total }
  }

  /**
   * Lista todas as páginas do sistema por status com paginação
   */
  async findAllByStatus(status: SystemPageStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const total = await prisma.systemPage.count({
      where: { status },
    })

    if (total < limit) limit = total

    const systemPages = await prisma.systemPage.findMany({
      where: {
        status,
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    })

    const nextPage = page < Math.ceil(total / limit) ? page + 1 : null

    return { systemPages, nextPage, total }
  }

  /**
   * Busca uma página do sistema pelo ID
   */
  async findOne(id: string) {
    const systemPage = await prisma.systemPage.findUnique({
      where: { id },
    })

    if (!systemPage) {
      throw new NotFoundException('Página não encontrada')
    }

    return systemPage
  }

  /**
   * Busca uma página do sistema pelo slug (acesso público)
   */
  async findBySlug(slug: string) {
    const systemPage = await prisma.systemPage.findUnique({
      where: { slug },
    })

    if (!systemPage) {
      throw new NotFoundException('Página não encontrada')
    }

    return systemPage
  }

  /**
   * Busca uma página do sistema pelo tipo (acesso público)
   */
  async findByType(type: string) {
    const systemPage = await prisma.systemPage.findFirst({
      where: {
        type: type as any,
        status: SystemPageStatus.PUBLISHED,
      },
    })

    if (!systemPage) {
      throw new NotFoundException('Página não encontrada')
    }

    return systemPage
  }

  /**
   * Atualiza uma página do sistema existente
   * Se a página for publicada e já existir uma página publicada do mesmo tipo,
   * a página existente será arquivada antes de publicar a nova versão
   */
  async update(id: string, updateSystemPageDto: UpdateSystemPageDto, userId: string) {
    const systemPage = await prisma.systemPage.findUnique({
      where: { id },
    })

    if (!systemPage) {
      throw new NotFoundException('Página não encontrada')
    }

    // Verificar se o slug já está sendo usado por outra página
    if (updateSystemPageDto.slug && updateSystemPageDto.slug !== systemPage.slug) {
      const existentPage = await prisma.systemPage.findUnique({
        where: {
          slug: updateSystemPageDto.slug,
        },
      })

      if (existentPage && existentPage.id !== id) {
        throw new HttpException('Esse slug já está sendo usado, crie outro.', HttpStatus.CONFLICT)
      }
    }

    // Se estamos publicando uma página e ela não estava publicada antes
    if (updateSystemPageDto.status === SystemPageStatus.PUBLISHED && 
        systemPage.status !== SystemPageStatus.PUBLISHED) {
      
      // Verificar se já existe uma página publicada do mesmo tipo
      const publishedPage = await prisma.systemPage.findFirst({
        where: {
          type: updateSystemPageDto.type || systemPage.type,
          status: SystemPageStatus.PUBLISHED,
          id: { not: id } // Excluir a página atual
        },
      })

      // Se existir, arquivar a página publicada anterior
      if (publishedPage) {
        await prisma.systemPage.update({
          where: { id: publishedPage.id },
          data: {
            status: SystemPageStatus.ARCHIVED,
            updatedBy: userId,
            updatedAt: new Date(),
          },
        })
      }
    }

    // Atualizar a página
    const updated = await prisma.systemPage.update({
      where: { id },
      data: {
        title: updateSystemPageDto.title,
        slug: updateSystemPageDto.slug,
        content: updateSystemPageDto.content,
        type: updateSystemPageDto.type,
        status: updateSystemPageDto.status,
        updatedBy: userId,
        updatedAt: new Date(),
        publishedAt:
          updateSystemPageDto.status === SystemPageStatus.PUBLISHED
            ? systemPage.publishedAt || new Date()
            : systemPage.publishedAt,
      },
    })

    return updated
  }

  /**
   * Remove uma página do sistema
   */
  async remove(id: string) {
    const systemPage = await prisma.systemPage.findUnique({
      where: { id },
    })

    if (!systemPage) {
      throw new NotFoundException('Página não encontrada')
    }

    await prisma.systemPage.delete({
      where: { id },
    })

    return { success: true }
  }
}
