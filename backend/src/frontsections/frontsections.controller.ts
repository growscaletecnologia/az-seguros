import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { FrontsectionsService } from './frontsections.service'
import { CreateFrontsectionDto } from './dto/create-frontsection.dto'
import { UpdateFrontsectionDto } from './dto/update-frontsection.dto'
import { FrontsectionEntity } from './entities/frontsection.entity'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@ApiTags('Front Sections')
@Controller('frontsections')
export class FrontsectionsController {
  constructor(private readonly frontsectionsService: FrontsectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova seção frontal' })
  @ApiResponse({
    status: 201,
    description: 'Seção criada com sucesso',
    type: FrontsectionEntity,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createFrontsectionDto: CreateFrontsectionDto) {
    return this.frontsectionsService.create(createFrontsectionDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as seções frontais (Admin)' })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Filtrar apenas seções ativas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de seções',
    type: [FrontsectionEntity],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(@Query('activeOnly') activeOnly?: string) {
    const isActiveOnly = activeOnly === 'true'
    return this.frontsectionsService.findAll(isActiveOnly)
  }

  @Get('public')
  @ApiOperation({ summary: 'Listar seções ativas para exibição pública' })
  @ApiResponse({
    status: 200,
    description: 'Lista de seções ativas',
    type: [FrontsectionEntity],
  })
  findPublic() {
    return this.frontsectionsService.findPublic()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar seção por ID' })
  @ApiParam({ name: 'id', description: 'ID da seção' })
  @ApiResponse({
    status: 200,
    description: 'Seção encontrada',
    type: FrontsectionEntity,
  })
  @ApiResponse({ status: 404, description: 'Seção não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findOne(@Param('id') id: string) {
    return this.frontsectionsService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar seção frontal' })
  @ApiParam({ name: 'id', description: 'ID da seção' })
  @ApiResponse({
    status: 200,
    description: 'Seção atualizada com sucesso',
    type: FrontsectionEntity,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Seção não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  update(@Param('id') id: string, @Body() updateFrontsectionDto: UpdateFrontsectionDto) {
    return this.frontsectionsService.update(id, updateFrontsectionDto)
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status da seção (ativo/inativo)' })
  @ApiParam({ name: 'id', description: 'ID da seção' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
    type: FrontsectionEntity,
  })
  @ApiResponse({ status: 404, description: 'Seção não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  toggleStatus(@Param('id') id: string) {
    return this.frontsectionsService.toggleStatus(id)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover seção frontal' })
  @ApiParam({ name: 'id', description: 'ID da seção' })
  @ApiResponse({
    status: 200,
    description: 'Seção removida com sucesso',
    type: FrontsectionEntity,
  })
  @ApiResponse({ status: 404, description: 'Seção não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  remove(@Param('id') id: string) {
    return this.frontsectionsService.remove(id)
  }
}
