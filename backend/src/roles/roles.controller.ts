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
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { AssignPermissionsDto } from './dto/assign-permissions.dto'
import { UpdateGranularPermissionsDto } from './dto/granular-permissions.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  findAll() {
    return this.rolesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id)
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, assignPermissionsDto)
  }

  @Delete(':id/permissions')
  @ApiOperation({ summary: 'Remove permissions from a role' })
  removePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { permissionIds: number[] },
  ) {
    return this.rolesService.removePermissions(id, body.permissionIds)
  }

  @Post(':id/granular-permissions')
  @ApiOperation({ summary: 'Update granular permissions for a role based on sidebar pages' })
  updateGranularPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGranularPermissionsDto: UpdateGranularPermissionsDto,
  ) {
    return this.rolesService.updateGranularPermissions(id, updateGranularPermissionsDto)
  }
}
