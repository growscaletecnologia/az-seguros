import { Injectable } from '@nestjs/common'
import { PrismaClient, Action } from '@prisma/client'

/**
 * Service responsible for calculating effective permissions for users
 * based on their roles and direct permission assignments
 */
@Injectable()
export class EffectivePermissionsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Check if a user has permission to perform an action on a resource
   * @param userId - User ID
   * @param resource - Resource name
   * @param action - Action to perform
   * @returns Boolean indicating if the user has permission
   */
  async hasPermission(userId: string, resource: string, action: Action): Promise<boolean> {
    // Get user with roles and direct permissions
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!user) {
      return false
    }

    // Verificar primeiro as permissões baseadas em roles
    for (const userRole of user.roles) {
      const role = userRole.role

      // Find a matching permission in this role
      const rolePermission = role.rolePermissions.find(
        (rp) => rp.permission.resource === resource && rp.permission.action === action,
      )

      // If we find an allowing permission, the user has access
      if (rolePermission && rolePermission.allow) {
        return true
      }
    }

    // Verificar permissões diretas do usuário apenas se existirem e não tiver permissão por role
    if (user.userPermissions && user.userPermissions.length > 0) {
      const directPermission = user.userPermissions.find(
        (up) => up.permission.resource === resource && up.permission.action === action,
      )

      // Se encontrou uma permissão direta, retorna seu valor
      if (directPermission !== undefined) {
        return directPermission.allow
      }
    }

    // No permissions found or all were denying
    return false
  }

  /**
   * Get all effective permissions for a user
   * @param userId - User ID
   * @returns Map of resources to actions with boolean values indicating permission
   */
  async getEffectivePermissions(userId: string): Promise<Record<string, Record<Action, boolean>>> {
    // Get user with roles and direct permissions
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!user) {
      return {}
    }

    const effectivePermissions: Record<string, Record<Action, boolean>> = {}

    // Process role permissions first
    for (const userRole of user.roles) {
      const role = userRole.role

      for (const rolePermission of role.rolePermissions) {
        const { resource, action } = rolePermission.permission

        // Initialize resource if needed
        if (!effectivePermissions[resource]) {
          effectivePermissions[resource] = {} as Record<Action, boolean>
        }

        // Only set if not already set or if allowing (allow overrides deny from roles)
        if (effectivePermissions[resource][action] === undefined || rolePermission.allow) {
          effectivePermissions[resource][action] = rolePermission.allow
        }
      }
    }

    // Process direct user permissions (overrides)
    for (const userPermission of user.userPermissions) {
      const { resource, action } = userPermission.permission

      // Initialize resource if needed
      if (!effectivePermissions[resource]) {
        effectivePermissions[resource] = {} as Record<Action, boolean>
      }

      // Direct permissions always override role permissions
      effectivePermissions[resource][action] = userPermission.allow
    }

    return effectivePermissions
  }
}
