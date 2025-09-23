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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Put,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger'
import { PostStatus } from '@prisma/client'
import type { User } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostsService } from './posts.service'
import { LoggedUser } from 'src/decorators/user.decorator'

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Cria um novo post
   */
  @ApiOperation({ summary: 'Criar um novo post' })
  @ApiResponse({ status: 201, description: 'Post criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Slug já existe' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  create(@Body() createPostDto: CreatePostDto, @LoggedUser() user: User) {
    return this.postsService.create(createPostDto, user)
  }

  /**
   * Upload da imagem principal do post
   */
  @ApiOperation({ summary: 'Upload da imagem principal do post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  @UseGuards(JwtAuthGuard)
  @Post('upload/main-image/:postId')
  @UseInterceptors(FileInterceptor('file'))
  uploadMainImage(@UploadedFile() file: Express.Multer.File, @Param('postId') postId: string) {
    try {
      return this.postsService.uploadMainImage(file, postId)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao enviar imagem')
    }
  }

  /**
   * Upload de múltiplas imagens para o post
   */
  @ApiOperation({ summary: 'Upload de múltiplas imagens para o post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagens enviadas com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivos inválidos' })
  @UseGuards(JwtAuthGuard)
  @Post('upload/gallery/:postId')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadGallery(@UploadedFiles() files: Express.Multer.File[], @Param('postId') postId: string) {
    try {
      return this.postsService.uploadGallery(files, postId)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao enviar imagens')
    }
  }

  /**
   * Lista todos os posts com paginação
   */
  @ApiOperation({ summary: 'Listar todos os posts' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de posts retornada com sucesso' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      const pageNumber = parseInt(page, 10)
      const limitNumber = parseInt(limit, 10)
      return this.postsService.findAll(pageNumber, limitNumber)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao buscar posts')
    }
  }

  /**
   * Lista posts por status com paginação
   */
  @ApiOperation({ summary: 'Listar posts por status' })
  @ApiParam({ name: 'status', enum: PostStatus, description: 'Status do post' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite de itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de posts retornada com sucesso' })
  @Get('status/:status')
  findByStatus(
    @Param('status') status: PostStatus,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const pageNumber = parseInt(page, 10)
      const limitNumber = parseInt(limit, 10)
      return this.postsService.findAllByStatus(status, pageNumber, limitNumber)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao buscar posts')
    }
  }

  /**
   * Busca um post pelo ID
   */
  @ApiOperation({ summary: 'Buscar post por ID' })
  @ApiParam({ name: 'id', description: 'ID do post' })
  @ApiResponse({ status: 200, description: 'Post encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.postsService.findOne(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao encontrar publicação')
    }
  }

  /**
   * Busca um post pelo slug (acesso público)
   */
  @ApiOperation({ summary: 'Buscar post por slug (acesso público)' })
  @ApiParam({ name: 'slug', description: 'Slug do post' })
  @ApiResponse({ status: 200, description: 'Post encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    try {
      return this.postsService.findBySlug(slug)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao encontrar publicação')
    }
  }

  /**
   * Atualiza um post existente
   */
  @ApiOperation({ summary: 'Atualizar um post' })
  @ApiParam({ name: 'id', description: 'ID do post' })
  @ApiResponse({ status: 200, description: 'Post atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @LoggedUser() user: User) {
    try {
      return this.postsService.update(id, updatePostDto, user.id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao atualizar publicação')
    }
  }

  /**
   * Remove um post
   */
  @ApiOperation({ summary: 'Remover um post' })
  @ApiParam({ name: 'id', description: 'ID do post' })
  @ApiResponse({ status: 204, description: 'Post removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    try {
      return this.postsService.remove(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao remover post')
    }
  }

  /**
   * Remove uma mídia do post
   */
  @ApiOperation({ summary: 'Remover uma mídia do post' })
  @ApiParam({ name: 'id', description: 'ID da mídia' })
  @ApiResponse({ status: 204, description: 'Mídia removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Mídia não encontrada' })
  @UseGuards(JwtAuthGuard)
  @Delete('media/:id')
  @HttpCode(204)
  removeMedia(@Param('id') id: string) {
    try {
      return this.postsService.removeMedia(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Erro ao remover mídia')
    }
  }
}
