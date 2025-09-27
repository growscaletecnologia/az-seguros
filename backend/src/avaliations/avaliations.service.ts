import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateAvaliationDto } from './dto/create-avaliation.dto'
import { UpdateAvaliationDto } from './dto/update-avaliation.dto'
import prisma from 'src/prisma/client'

@Injectable()
export class AvaliationsService {
  /**
   * Cria uma nova avaliação
   * @param createAvaliationDto Dados da avaliação a ser criada
   * @returns A avaliação criada
   */
  async create(createAvaliationDto: CreateAvaliationDto) {
    return prisma.avaliation.create({
      data: createAvaliationDto,
    })
  }

  /**
   * Retorna todas as avaliações
   * @param activeOnly Se true, retorna apenas avaliações ativas
   * @returns Lista de avaliações
   */
  async findAll(activeOnly = false) {
    const where = activeOnly ? { active: true } : {}

    return prisma.avaliation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Retorna uma avaliação específica pelo ID
   * @param id ID da avaliação
   * @returns A avaliação encontrada
   */
  async findOne(id: string) {
    const avaliation = await prisma.avaliation.findUnique({
      where: { id },
    })

    if (!avaliation) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`)
    }

    return avaliation
  }

  /**
   * Atualiza uma avaliação existente
   * @param id ID da avaliação
   * @param updateAvaliationDto Dados para atualização
   * @returns A avaliação atualizada
   */
  async update(id: string, updateAvaliationDto: UpdateAvaliationDto) {
    try {
      return await prisma.avaliation.update({
        where: { id },
        data: updateAvaliationDto,
      })
    } catch (error) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`)
    }
  }

  /**
   * Remove uma avaliação
   * @param id ID da avaliação
   * @returns A avaliação removida
   */
  async remove(id: string) {
    try {
      return await prisma.avaliation.delete({
        where: { id },
      })
    } catch (error) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`)
    }
  }

  /**
   * Alterna o status de ativação de uma avaliação
   * @param id ID da avaliação
   * @returns A avaliação com status atualizado
   */
  async toggleActive(id: string) {
    const avaliation = await this.findOne(id)
    return this.update(id, { active: !avaliation.active })
  }
}
