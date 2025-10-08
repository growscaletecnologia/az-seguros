import { Injectable } from '@nestjs/common'
import { CreateSecurityIntegrationDto } from '../dto/create-security-integration.dto'
import { UpdateSecurityIntegrationDto } from '../dto/update-security-integration.dto'
import prisma from 'src/prisma/client'

@Injectable()
export class SecurityIntegrationRepository {
  async create(data: CreateSecurityIntegrationDto) {
    console.log('dados no repo', data)
    const createData = {
      clientId: data.clientId ?? 0, // Garante que nunca será undefined
      insurerName: data.insurerName,
      grantType: data.grantType,
      clientSecret: data.clientSecret,
      username: data.username,
      password: data.password,
      scope: data.scope ?? '',
      ativa: data.ativa ?? true,
      markUp: data.markUp ?? 0,
    }
    console.log('dados apos ajuste', createData)
    try {
      const result = await prisma.securityIntegration.create({
        data: createData,
      })
      return result
    } catch (error) {
      console.error('Erro ao criar integração de segurança:', error)
      throw error // Re-throw para que o serviço possa lidar com isso se necessário0
    }
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
      //@ts-ignore
      data: updateData,
    })
  }

  async remove(id: string) {
    return prisma.securityIntegration.delete({
      where: { id },
    })
  }
}
