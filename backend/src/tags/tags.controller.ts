import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import type { User } from '@prisma/client'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagsService } from './tags.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { LoggedUser } from 'src/decorators/user.decorator'

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('all')
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '5') {
    try {
      const pageNumber = parseInt(page, 10)
      const limitNumber = parseInt(limit, 10)
      return this.tagsService.findAll(pageNumber, limitNumber)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao buscar tags')
    }
  }

  @Get('all-no-limit')
  findAllnoLimit() {
    try {
      return this.tagsService.findAllnoLimit()
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao buscar tags')
    }
  }

  @Post('create')
  create(@Body() createTagDto: CreateTagDto) {
    try {
      return this.tagsService.create(createTagDto)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao criar tag')
    }
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    try {
      if (id) {
        return this.tagsService.findOne(id)
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao buscar tag')
    }

    return HttpException
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @LoggedUser() user: User,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    try {
      return this.tagsService.update(id, updateTagDto, user)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao editar tag')
    }
  }

  @Delete('remove/:id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    try {
      if (id) {
        return this.tagsService.remove(id)
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao remover tag')
    }
  }
}
