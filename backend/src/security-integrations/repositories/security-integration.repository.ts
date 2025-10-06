import { Injectable } from '@nestjs/common'
import { CreateSecurityIntegrationDto } from '../dto/create-security-integration.dto'
import { UpdateSecurityIntegrationDto } from '../dto/update-security-integration.dto'
import prisma from 'src/prisma/client'

@Injectable()
export class SecurityIntegrationRepository {
  async create(data: CreateSecurityIntegrationDto) {
    const createData = {
      clientId: data.clientId !== undefined ? String(data.clientId) : '', // Garante que nunca será undefined
      securityName: 'example',
      grantType: 'example',
      clientSecret: 'example',
      username: 'example',
      password: 'example',
      scope: 'example',
      ativa: true,
      markUp: 10,
    };
    return prisma.securityIntegration.create({
      data: createData,
    })
  }

  async findAll() {
    return prisma.securityIntegration.findMany()
  }

  async findOne(id: string) {
    return prisma.securityIntegration.findUnique({
      where: { id },
    })
  }

  async update(id: string, data: UpdateSecurityIntegrationDto) {
    const updateData = {
      ...data,
      clientId: data.clientId !== undefined ? String(data.clientId) : undefined,
    }
    return prisma.securityIntegration.update({
      where: { id },
      data: updateData,
    })
  }

  async remove(id: string) {
    return prisma.securityIntegration.delete({
      where: { id },
    })
  }
}