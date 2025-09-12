import prisma from '../../prisma/client'
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
        oldPassword: data.oldPassword,
        addresses: data.addresses
          ? {
              create: data.addresses,
            }
          : undefined,
      },
      include: { addresses: true },
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
        addresses: data.addresses
          ? {
              updateMany: data.addresses.map((addr) => ({
                where: { id: addr.id }, // precisa do id do endereço
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
