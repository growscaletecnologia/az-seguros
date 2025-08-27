import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InsurersService } from './insurers.service';
import { CreateInsurerDto } from './dto/create-insurer.dto';
import { UpdateInsurerDto } from './dto/update-insurer.dto';

@Controller('insurers')
export class InsurersController {
  constructor(private readonly insurersService: InsurersService) {}

  @Post()
  create(@Body() createInsurerDto: CreateInsurerDto) {
    return this.insurersService.create(createInsurerDto);
  }

  @Get()
  findAll() {
    return this.insurersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insurersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInsurerDto: UpdateInsurerDto) {
    return this.insurersService.update(+id, updateInsurerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insurersService.remove(+id);
  }
}
