import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  findAll() {
    return this.permissionsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a permission' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(id)
  }

  @Get('resource/:resource')
  @ApiOperation({ summary: 'Get permissions by resource' })
  findByResource(@Param('resource') resource: string) {
    return this.permissionsService.findByResource(resource)
  }
}
