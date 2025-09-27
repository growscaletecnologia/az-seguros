import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger'
import { AvaliationsService } from './avaliations.service'
import { CreateAvaliationDto } from './dto/create-avaliation.dto'
import { UpdateAvaliationDto } from './dto/update-avaliation.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('avaliations')
@Controller('avaliations')
export class AvaliationsController {
  constructor(private readonly avaliationsService: AvaliationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createAvaliationDto: CreateAvaliationDto) {
    return this.avaliationsService.create(createAvaliationDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as avaliações' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de avaliações retornada com sucesso' })
  findAll(@Query('activeOnly') activeOnly?: boolean) {
    return this.avaliationsService.findAll(activeOnly === true)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma avaliação pelo ID' })
  @ApiResponse({ status: 200, description: 'Avaliação encontrada' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  findOne(@Param('id') id: string) {
    return this.avaliationsService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  update(@Param('id') id: string, @Body() updateAvaliationDto: UpdateAvaliationDto) {
    return this.avaliationsService.update(id, updateAvaliationDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  remove(@Param('id') id: string) {
    return this.avaliationsService.remove(id)
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar status de ativação da avaliação' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  toggleActive(@Param('id') id: string) {
    return this.avaliationsService.toggleActive(id)
  }
}
