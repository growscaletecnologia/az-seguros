import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateSecurityIntegrationDto } from '../dto/create-security-integration.dto'
import { UpdateSecurityIntegrationDto } from '../dto/update-security-integration.dto'
import { SecurityIntegrationRepository } from '../repositories/security-integration.repository'

@Injectable()
export class SecurityIntegrationsService {
  constructor(private repository: SecurityIntegrationRepository) {}

  async create(createDto: CreateSecurityIntegrationDto) {
    return this.repository.create(createDto)
  }

  async findAll() {
    console.log("entrou no service")
    const data = await this.repository.findAll()
    console.log(data)
    return data
  }

  async findOne(id: string) {
    const securityIntegration = await this.repository.findOne(id)
    if (!securityIntegration) {
      throw new NotFoundException(`Security integration with ID ${id} not found`)
    }
    return securityIntegration
  }

  async update(id: string, updateDto: UpdateSecurityIntegrationDto) {
    await this.findOne(id) // Verifica se existe
    return this.repository.update(id, updateDto)
  }

  async remove(id: string) {
    await this.findOne(id) // Verifica se existe
    return this.repository.remove(id)
  }
}
