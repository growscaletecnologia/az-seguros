import { Injectable } from '@nestjs/common'
import { CreateSecurityIntegrationDto } from '../dto/create-security-integration.dto'
import { UpdateSecurityIntegrationDto } from '../dto/update-security-integration.dto'
import prisma from 'src/prisma/client'

@Injectable()
export class SecurityIntegrationRepository {
  async create(data: CreateSecurityIntegrationDto) {
    return prisma.securityIntegration.create({
      data,
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
    return prisma.securityIntegration.update({
      where: { id },
      data,
    })
  }

  async remove(id: string) {
    return prisma.securityIntegration.delete({
      where: { id },
    })
  }
}
