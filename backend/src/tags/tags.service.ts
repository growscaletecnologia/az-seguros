import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import type { User } from '@prisma/client'
import prisma from 'src/prisma/client'

@Injectable()
export class TagsService {
  create(createTagDto: CreateTagDto) {
    return prisma.tag.create({
      data: {
        ...createTagDto,
      },
    })
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const total = await prisma.tag.count()
    console.log('Logando Total', total)

    const tags = await prisma.tag.findMany({
      skip,
      take: limit,
    })

    return { tags, total }
  }

  async findAllnoLimit(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const total = await prisma.tag.count()
    console.log('Logando Total', total)

    const tags = await prisma.tag.findMany({
      skip,
      take: limit,
    })

    return { tags, total }
  }

  findOne(id: string) {
    return prisma.tag.findUnique({
      where: {
        id: id,
      },
    })
  }

  async update(id: string, updateTagDto: UpdateTagDto, user: User) {
    const verifiedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!verifiedUser) throw new NotFoundException('Usuário inexistente')

    const data = prisma.tag.update({
      where: {
        id: id,
      },
      data: {
        ...updateTagDto,
        updatedAt: new Date(),
      },
    })

    return data
  }

  async remove(id: string) {
    const tagExists = await prisma.tag.findUnique({
      where: { id },
    })

    if (!tagExists) {
      throw new Error(`Tag with ID ${id} does not exist.`)
    }

    return prisma.tag.delete({
      where: { id },
    })
  }
}
