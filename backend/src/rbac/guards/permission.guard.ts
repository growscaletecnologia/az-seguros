import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY, RequiredPermission } from '../decorators/require-permission.decorator'
import { EffectivePermissionsService } from '../services/effective-permissions.service'

/**
 * Guard that checks if the user has the required permissions to access a route
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name)

  constructor(
    private reflector: Reflector,
    private effectivePermissionsService: EffectivePermissionsService,
  ) {}

  /**
   * Check if the user has permission to access the route
   * @param context - Execution context
   * @returns Boolean indicating if access is allowed
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredPermission = this.reflector.get<RequiredPermission>(
        PERMISSIONS_KEY,
        context.getHandler(),
      )

      // If no permission is required, allow access
      if (!requiredPermission) {
        return true
      }

      const { resource, action } = requiredPermission
      const request = context.switchToHttp().getRequest()
      const user = request.user

      // If no user is authenticated, deny access
      if (!user) {
        throw new ForbiddenException('Usuário não autenticado')
      }

      // Check if the user has the required permission
      const hasPermission = await this.effectivePermissionsService.hasPermission(
        user.id,
        resource,
        action,
      )

      if (!hasPermission) {
        throw new ForbiddenException(
          `Você não tem permissão para ${this.getActionName(action)} ${this.getResourceName(resource)}`,
        )
      }

      return true
    } catch (error) {
      // Garantir que sempre retorne ForbiddenException (403) em vez de erro 500
      if (error instanceof ForbiddenException) {
        throw error
      }

      this.logger.error(`Erro ao verificar permissão: ${error.message}`, error.stack)
      throw new ForbiddenException('Erro ao verificar permissões de acesso')
    }
  }

  /**
   * Traduz a ação para um formato mais legível
   */
  private getActionName(action: string): string {
    const actionMap = {
      CREATE: 'criar',
      READ: 'visualizar',
      UPDATE: 'editar',
      DELETE: 'excluir',
      ASSIGN: 'atribuir',
    }

    return actionMap[action] || action.toLowerCase()
  }

  /**
   * Traduz o recurso para um formato mais legível
   */
  private getResourceName(resource: string): string {
    const resourceMap = {
      dashboard: 'Dashboard',
      usuarios: 'Usuários',
      rbac: 'Permissões de Acesso',
      blog: 'Blog',
      cupons: 'Cupons de Desconto',
      pedidos: 'Pedidos',
      integracoes: 'Integrações',
      paginas: 'Páginas',
    }

    return resourceMap[resource] || resource
  }
}
