import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CmdService } from './cmd.service'
import { CreateCmdDto } from './dto/create-cmd.dto'
import { UpdateCmdDto } from './dto/update-cmd.dto'

@Controller('cmd')
export class CmdController {
  constructor(private readonly cmdService: CmdService) {}

  @Post()
  create(@Body() createCmdDto: CreateCmdDto) {
    return this.cmdService.create(createCmdDto)
  }

  @Get()
  findAll() {
    return this.cmdService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cmdService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCmdDto: UpdateCmdDto) {
    return this.cmdService.update(+id, updateCmdDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cmdService.remove(+id)
  }
}
