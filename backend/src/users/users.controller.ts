import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  //@RequirePermission({ resource: 'users', action: 'READ' })
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string) {
    console.log('chegou aqui', id)
    return this.usersService.remove(id)
  }

  //   @UseGuards(JwtAuthGuard, PermissionGuard)
  //   @RequirePermission({ resource: 'roles', action: 'READ' })
  //   @Post(':id/roles')
  //   @ApiOperation({ summary: 'Assign roles to a user' })
  //   assignRoles(@Param('id') id: string, @Body() assignRolesDto: AssignRolesDto) {
  //     return this.usersService.(id, assignRolesDto)
  //   }

  //   @UseGuards(JwtAuthGuard, PermissionGuard)
  //   @RequirePermission({ resource: 'roles', action: 'DELETE' })
  //   @Delete(':id/roles')
  //   @ApiOperation({ summary: 'Remove roles from a user' })
  //   removeRoles(@Param('id') id: string, @Body() roleIds: number[]) {
  //     return this.usersService.removeRoles(id, roleIds)
  //   }

  //   @UseGuards(JwtAuthGuard, PermissionGuard)
  //   @RequirePermission({ resource: 'permissions', action: 'READ' })
  //   @Post(':id/permissions')
  //   @ApiOperation({ summary: 'Assign direct permissions to a user' })
  //   assignPermissions(
  //     @Param('id') id: string,
  //     @Body() assignPermissionsDto: AssignUserPermissionsDto,
  //   ) {
  //     return this.usersService.assignPermissions(id, assignPermissionsDto)
  //   }

  //   @UseGuards(JwtAuthGuard, PermissionGuard)
  //   @RequirePermission({ resource: 'permissions', action: 'DELETE' })
  //   @Delete(':id/permissions')
  //   @ApiOperation({ summary: 'Remove direct permissions from a user' })
  //   removePermissions(@Param('id') id: string, @Body() permissionIds: number[]) {
  //     return this.usersService.removePermissions(id, permissionIds)
  //   }
  // }
}
