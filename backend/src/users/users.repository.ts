import prisma from 'src/prisma/client'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

export class UserRepository {
  async create(data: CreateUserDto) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        cpfCnpj: data.cpfCnpj,
        birthDate: data.birthDate,
        password: data.password,
        role: data.role,
        status: data.status,
        createdAt: data.createdAt || new Date(),
        emailVerifiedAt: null,
        addresses: data.addresses
          ? {
              create: data.addresses,
            }
          : undefined,
      },
      include: { addresses: true },
    })
  }
  async verifyEmail(id: string) {
    return prisma.user.update({
      where: { id: id },
      data: { emailVerifiedAt: new Date() },
    })
  }
  async update(id: string, data: UpdateUserDto) {
    return prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        cpfCnpj: data.cpfCnpj,
        birthDate: data.birthDate,
        password: data.password,
        oldPassword: data.oldPassword,
        role: data.role,
        status: data.status,
        addresses: data.addresses
          ? {
              updateMany: data.addresses.map((addr) => ({
                where: { id: addr.id },
                data: addr,
              })),
            }
          : undefined,
      },
      include: { addresses: true },
    })
  }

  async listAll() {
    return prisma.user.findMany({ include: { addresses: true } })
  }

  async listById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    })
  }

  async listByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { addresses: true },
    })
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deleted: true, deletedAt: new Date() },
    })
  }
}
