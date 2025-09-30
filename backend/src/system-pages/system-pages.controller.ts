import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Query,
  Put,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { SystemPageStatus } from '@prisma/client'
import type { User } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateSystemPageDto } from './dto/create-system-page.dto'
import { UpdateSystemPageDto } from './dto/update-system-page.dto'
import { SystemPagesService } from './system-pages.service'
import { LoggedUser } from 'src/decorators/user.decorator'

@ApiTags('system-pages')
@Controller('system-pages')
export class SystemPagesController {
  constructor(private readonly systemPagesService: SystemPagesService) {}

  /**
   * Cria uma nova página do sistema
   */
  @ApiOperation({ summary: 'Criar uma nova página do sistema' })
  @ApiResponse({ status: 201, description: 'Página criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Slug já existe' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  create(@Body() createSystemPageDto: CreateSystemPageDto, @LoggedUser() user: User) {
    return this.systemPagesService.create(createSystemPageDto, user.id)
  }

  /**
   * Lista todas as páginas do sistema com paginação
   */
  @ApiOperation({ summary: 'Listar todas as páginas do sistema' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de páginas retornada com sucesso' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      const pageNumber = parseInt(page, 10)
      const limitNumber = parseInt(limit, 10)
      return this.systemPagesService.findAll(pageNumber, limitNumber)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao buscar páginas')
    }
  }

  /**
   * Lista todas as páginas do sistema por status com paginação
   */
  @ApiOperation({ summary: 'Listar páginas do sistema por status' })
  @ApiParam({ name: 'status', enum: SystemPageStatus, description: 'Status da página' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de páginas retornada com sucesso' })
  @UseGuards(JwtAuthGuard)
  @Get('status/:status')
  findByStatus(
    @Param('status') status: SystemPageStatus,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const pageNumber = parseInt(page, 10)
      const limitNumber = parseInt(limit, 10)
      return this.systemPagesService.findAllByStatus(status, pageNumber, limitNumber)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao buscar páginas')
    }
  }

  /**
   * Busca uma página do sistema pelo ID
   */
  @ApiOperation({ summary: 'Buscar página por ID' })
  @ApiParam({ name: 'id', description: 'ID da página' })
  @ApiResponse({ status: 200, description: 'Página encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Página não encontrada' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.systemPagesService.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao encontrar página')
    }
  }

  /**
   * Busca uma página do sistema pelo slug (acesso público)
   */
  @ApiOperation({ summary: 'Buscar página por slug (acesso público)' })
  @ApiParam({ name: 'slug', description: 'Slug da página' })
  @ApiResponse({ status: 200, description: 'Página encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Página não encontrada' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    try {
      return this.systemPagesService.findBySlug(slug)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao encontrar página')
    }
  }

  /**
   * Busca uma página do sistema pelo tipo (acesso público)
   */
  @ApiOperation({ summary: 'Buscar página por tipo (acesso público)' })
  @ApiParam({ name: 'type', description: 'Tipo da página' })
  @ApiResponse({ status: 200, description: 'Página encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Página não encontrada' })
  @Get('type/:type')
  findByType(@Param('type') type: string) {
    try {
      return this.systemPagesService.findByType(type)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao encontrar página')
    }
  }

  /**
   * Atualiza uma página do sistema existente
   */
  @ApiOperation({ summary: 'Atualizar uma página do sistema' })
  @ApiParam({ name: 'id', description: 'ID da página' })
  @ApiResponse({ status: 200, description: 'Página atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Página não encontrada' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSystemPageDto: UpdateSystemPageDto,
    @LoggedUser() user: User,
  ) {
    try {
      return this.systemPagesService.update(id, updateSystemPageDto, user.id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao atualizar página')
    }
  }

  /**
   * Remove uma página do sistema
   */
  @ApiOperation({ summary: 'Remover uma página do sistema' })
  @ApiParam({ name: 'id', description: 'ID da página' })
  @ApiResponse({ status: 204, description: 'Página removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Página não encontrada' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    try {
      return this.systemPagesService.remove(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao remover página')
    }
  }
}