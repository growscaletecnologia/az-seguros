import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { AssignPermissionsDto } from './dto/assign-permissions.dto'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new role
   * @param createRoleDto - Data for creating a role
   * @returns The created role
   */
  async create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: createRoleDto,
    })
  }

  /**
   * Get all roles
   * @returns List of all roles
   */
  async findAll() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })
  }

  /**
   * Get a role by ID
   * @param id - Role ID
   * @returns The role if found
   */
  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`)
    }

    return role
  }

  /**
   * Update a role
   * @param id - Role ID
   * @param updateRoleDto - Data for updating the role
   * @returns The updated role
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id)

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be modified')
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    })
  }

  /**
   * Delete a role
   * @param id - Role ID
   * @returns The deleted role
   */
  async remove(id: number) {
    const role = await this.findOne(id)

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be deleted')
    }

    return this.prisma.role.delete({
      where: { id },
    })
  }

  /**
   * Assign permissions to a role
   * @param id - Role ID
   * @param assignPermissionsDto - Data for assigning permissions
   * @returns The updated role with permissions
   */
  async assignPermissions(id: number, assignPermissionsDto: AssignPermissionsDto) {
    const role = await this.findOne(id)

    if (role.isSystem) {
      throw new ForbiddenException('System roles permissions cannot be modified directly')
    }

    const { permissionIds, allow = true } = assignPermissionsDto

    // Verify all permissions exist
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    })

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found')
    }

    // Remove existing permissions for this role
    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId: id,
        permissionId: {
          in: permissionIds,
        },
      },
    })

    // Create new role permissions
    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId: id,
      permissionId,
      allow,
    }))

    await this.prisma.rolePermission.createMany({
      data: rolePermissions,
    })

    return this.findOne(id)
  }

  /**
   * Remove permissions from a role
   * @param roleId - Role ID
   * @param permissionIds - Array of permission IDs to remove
   * @returns The updated role
   */
  async removePermissions(roleId: number, permissionIds: number[]) {
    const role = await this.findOne(roleId)

    if (role.isSystem) {
      throw new ForbiddenException('System roles permissions cannot be modified directly')
    }

    await this.prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: {
          in: permissionIds,
        },
      },
    })

    return this.findOne(roleId)
  }

  /**
   * Atualiza as permissões granulares de uma role baseadas nas páginas da sidebar
   * @param roleId - ID da role
   * @param updateGranularPermissionsDto - DTO com as permissões granulares
   * @returns A role atualizada com as novas permissões
   */
  async updateGranularPermissions(roleId: number, updateGranularPermissionsDto: any) {
    const role = await this.findOne(roleId)

    if (role.isSystem) {
      throw new ForbiddenException(
        'As permissões de roles do sistema não podem ser modificadas diretamente',
      )
    }

    const { permissions } = updateGranularPermissionsDto

    // Para cada recurso, processa as permissões granulares
    for (const perm of permissions) {
      const { resource, canRead, canCreate, canUpdate, canDelete } = perm

      // Mapeia as ações para os valores booleanos
      const actionMap = {
        READ: canRead,
        CREATE: canCreate,
        UPDATE: canUpdate,
        DELETE: canDelete,
      }

      // Para cada ação, busca ou cria a permissão correspondente
      for (const [action, allowed] of Object.entries(actionMap)) {
        // Busca a permissão no banco de dados
        let permission = await this.prisma.permission.findFirst({
          where: {
            resource,
            action: action as any,
          },
        })

        // Se não existir, cria a permissão
        if (!permission) {
          permission = await this.prisma.permission.create({
            data: {
              resource,
              action: action as any,
              description: `Permissão para ${action.toLowerCase()} ${resource}`,
            },
          })
        }

        // Remove a permissão existente para esta role e este recurso/ação
        await this.prisma.rolePermission.deleteMany({
          where: {
            roleId,
            permission: {
              resource,
              action: action as any,
            },
          },
        })

        // Se a permissão for concedida, cria o registro
        if (allowed) {
          await this.prisma.rolePermission.create({
            data: {
              roleId,
              permissionId: permission.id,
              allow: true,
            },
          })
        }
      }
    }

    return this.findOne(roleId)
  }
}
