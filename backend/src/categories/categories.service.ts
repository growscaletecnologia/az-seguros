import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

import type { User } from '@prisma/client'
import prisma from 'src/prisma/client'

@Injectable()
export class CategoriesService {
  create(createCategoryDto: CreateCategoryDto) {
    return prisma.category.create({
      data: createCategoryDto,
    })
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const total = await prisma.category.count()
    console.log('Logando Total', total)

    const categories = await prisma.category.findMany({
      skip,
      take: limit,
    })

    return { categories, total }
  }
  async findAllnoLimit() {
    return await prisma.category.findMany()
  }

  findOne(id: string) {
    return prisma.category.findUnique({
      where: { id },
    })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: User) {
    const verifiedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!verifiedUser) throw new NotFoundException('Usuário inexistente')

    const data = prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...updateCategoryDto,
        updatedAt: new Date(),
      },
    })

    console.log('updated', data)

    return data
  }

  // async update(
  //   id: string,
  //   userDTO: { role: string; email: string; name: string },
  //   user: User,
  // ): Promise<void> {
  //   const verifiedUser = await prisma.user.findUnique({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (!verifiedUser) throw new NotFoundException('Usuário inexistente');

  //   const verifiedUserRole = await this.getRole(verifiedUser.role_id);

  //   const userRole = await this.getRole(user.role_id);

  //   if (
  //     userRole.viewing_permission_level >
  //     verifiedUserRole.viewing_permission_level
  //   )
  //     throw new ForbiddenException(
  //       'O usuário não pode atualizar outro usuário, que tenha um maior nível de permissão',
  //     );

  //   await prisma.user.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       name: userDTO.name,
  //       updated_by: string(user.id),
  //       role_id: string(userDTO.role),
  //     },
  //   });
  // }

  async remove(id: string) {
    const tagExists = await prisma.category.findUnique({
      where: { id },
    })

    if (!tagExists) {
      throw new Error(`Tag with ID ${id} does not exist.`)
    }

    return prisma.category.delete({
      where: { id },
    })
  }
}
