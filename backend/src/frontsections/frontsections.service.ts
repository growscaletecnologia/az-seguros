import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateFrontsectionDto } from './dto/create-frontsection.dto'
import { UpdateFrontsectionDto } from './dto/update-frontsection.dto'
import prisma from 'src/prisma/client'
import { FrontSectionStatus } from '@prisma/client'

@Injectable()
export class FrontsectionsService {
  /**
   * Cria uma nova seção frontal
   * @param createFrontsectionDto Dados da seção a ser criada
   * @returns A seção criada
   */
  async create(createFrontsectionDto: CreateFrontsectionDto) {
    return prisma.frontSection.create({
      data: createFrontsectionDto,
    })
  }

  /**
   * Retorna todas as seções frontais
   * @param activeOnly Se true, retorna apenas seções ativas
   * @returns Lista de seções ordenadas por ordem de exibição
   */
  async findAll(activeOnly = false) {
    const where = activeOnly ? { status: FrontSectionStatus.ACTIVE } : {}

    return prisma.frontSection.findMany({
      where,
      orderBy: { order: 'asc' },
    })
  }

  /**
   * Retorna seções ativas para exibição pública
   * @returns Lista de seções ativas ordenadas por ordem
   */
  async findPublic() {
    return this.findAll(true)
  }

  /**
   * Retorna uma seção específica pelo ID
   * @param id ID da seção
   * @returns A seção encontrada
   */
  async findOne(id: string) {
    const frontSection = await prisma.frontSection.findUnique({
      where: { id },
    })

    if (!frontSection) {
      throw new NotFoundException(`Seção frontal com ID ${id} não encontrada`)
    }

    return frontSection
  }

  /**
   * Atualiza uma seção frontal
   * @param id ID da seção a ser atualizada
   * @param updateFrontsectionDto Dados para atualização
   * @returns A seção atualizada
   */
  async update(id: string, updateFrontsectionDto: UpdateFrontsectionDto) {
    // Verifica se a seção existe
    await this.findOne(id)

    return prisma.frontSection.update({
      where: { id },
      data: updateFrontsectionDto,
    })
  }

  /**
   * Remove uma seção frontal
   * @param id ID da seção a ser removida
   * @returns A seção removida
   */
  async remove(id: string) {
    // Verifica se a seção existe
    await this.findOne(id)

    return prisma.frontSection.delete({
      where: { id },
    })
  }

  /**
   * Alterna o status de uma seção frontal
   * @param id ID da seção
   * @returns A seção com status atualizado
   */
  async toggleStatus(id: string) {
    const frontSection = await this.findOne(id)

    const newStatus =
      frontSection.status === FrontSectionStatus.ACTIVE
        ? FrontSectionStatus.INACTIVE
        : FrontSectionStatus.ACTIVE

    return prisma.frontSection.update({
      where: { id },
      data: { status: newStatus },
    })
  }
}
