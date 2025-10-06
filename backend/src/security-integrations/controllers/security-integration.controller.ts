import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { CreateSecurityIntegrationDto } from '../dto/create-security-integration.dto'
import { UpdateSecurityIntegrationDto } from '../dto/update-security-integration.dto'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { SecurityIntegrationsService } from '../services/security-integration.service'

@ApiTags('security-integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('security-integrations')
export class SecurityIntegrationController {
  constructor(private readonly securityIntegrationService: SecurityIntegrationsService) {}

  /**
   * Cria uma nova integração de segurança
   */
  @Post()
  @ApiOperation({ summary: 'Criar uma nova integração de segurança' })
  @ApiResponse({ status: 201, description: 'Integração criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createSecurityIntegrationDto: CreateSecurityIntegrationDto) {
    return this.securityIntegrationService.create(createSecurityIntegrationDto)
  }

  /**
   * Lista todas as integrações de segurança
   */
  @Get()
  @ApiOperation({ summary: 'Listar todas as integrações de segurança' })
  @ApiResponse({ status: 200, description: 'Lista de integrações retornada com sucesso' })
  findAll() {
    console.log("entrou aqui")
    return this.securityIntegrationService.findAll()
  }

  /**
   * Busca uma integração de segurança pelo ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma integração de segurança pelo ID' })
  @ApiResponse({ status: 200, description: 'Integração encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  findOne(@Param('id') id: string) {
    return this.securityIntegrationService.findOne(id)
  }

  /**
   * Atualiza uma integração de segurança
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma integração de segurança' })
  @ApiResponse({ status: 200, description: 'Integração atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateSecurityIntegrationDto: UpdateSecurityIntegrationDto,
  ) {
    return this.securityIntegrationService.update(id, updateSecurityIntegrationDto)
  }

  /**
   * Remove uma integração de segurança
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma integração de segurança' })
  @ApiResponse({ status: 200, description: 'Integração removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  remove(@Param('id') id: string) {
    return this.securityIntegrationService.remove(id)
  }
}
