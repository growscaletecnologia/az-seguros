import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiResponse } from '@nestjs/swagger'

import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import type { User } from '@prisma/client'
import { LoggedUser } from 'src/decorators/user.decorator'

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @Post('create')
  @HttpCode(201)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoriesService.create(createCategoryDto)
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao criar categoria')
    }
  }

  @Get('all')
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '5') {
    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)
    return this.categoriesService.findAll(pageNumber, limitNumber)
  }

  @Get()
  async findAllnoLimit() {
    return this.categoriesService.findAll()
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id)
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @LoggedUser() user: User,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, user)
  }

  @Delete('remove/:id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    try {
      if (id) {
        return this.categoriesService.remove(id)
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erro ao remover tag')
    }
  }
}
