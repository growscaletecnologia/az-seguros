import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { EffectivePermissionsService } from '../services/effective-permissions.service'
import { Action } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { SessionService } from '../../auth/session.service'

/**
 * Middleware que verifica automaticamente as permissões do usuário com base na rota acessada
 * Elimina a necessidade de decorators @RequirePermission em cada rota
 */
@Injectable()
export class AutoPermissionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AutoPermissionMiddleware.name)

  constructor(
    private readonly effectivePermissionsService: EffectivePermissionsService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  // Mapeamento de rotas para recursos e ações
  private readonly routePermissionMap: Record<string, { resource: string; action: Action }> = {
    // Usuários
    'GET /users': { resource: 'users', action: Action.READ },
    'GET /users/:id': { resource: 'users', action: Action.READ },
    'POST /users': { resource: 'users', action: Action.CREATE },
    'PATCH /users/:id': { resource: 'users', action: Action.UPDATE },
    'DELETE /users/:id': { resource: 'users', action: Action.DELETE },

    // Roles
    'GET /roles': { resource: 'roles', action: Action.READ },
    'GET /roles/:id': { resource: 'roles', action: Action.READ },
    'POST /roles': { resource: 'roles', action: Action.CREATE },
    'PATCH /roles/:id': { resource: 'roles', action: Action.UPDATE },
    'DELETE /roles/:id': { resource: 'roles', action: Action.DELETE },
    'POST /roles/:id/permissions': { resource: 'roles', action: Action.UPDATE },
    'DELETE /roles/:id/permissions': { resource: 'roles', action: Action.UPDATE },
    'POST /roles/:id/granular-permissions': { resource: 'roles', action: Action.UPDATE },

    // Permissões
    'GET /permissions': { resource: 'permissions', action: Action.READ },
    'GET /permissions/:id': { resource: 'permissions', action: Action.READ },
    'POST /permissions': { resource: 'permissions', action: Action.CREATE },
    'PATCH /permissions/:id': { resource: 'permissions', action: Action.UPDATE },
    'DELETE /permissions/:id': { resource: 'permissions', action: Action.DELETE },

    // Convites
    'POST /invitations': { resource: 'users', action: Action.CREATE },
    'POST /invitations/resend/:userId': { resource: 'users', action: Action.UPDATE },

    // Planos
    'GET /plans': { resource: 'plans', action: Action.READ },
    'GET /plans/:id': { resource: 'plans', action: Action.READ },
    'POST /plans': { resource: 'plans', action: Action.CREATE },
    'PATCH /plans/:id': { resource: 'plans', action: Action.UPDATE },
    'DELETE /plans/:id': { resource: 'plans', action: Action.DELETE },

    // Pedidos
    'GET /orders': { resource: 'orders', action: Action.READ },
    'GET /orders/:id': { resource: 'orders', action: Action.READ },
    'POST /orders': { resource: 'orders', action: Action.CREATE },
    'PATCH /orders/:id': { resource: 'orders', action: Action.UPDATE },
    'DELETE /orders/:id': { resource: 'orders', action: Action.DELETE },

    // Cupons
    'GET /coupons': { resource: 'coupons', action: Action.READ },
    'GET /coupons/:id': { resource: 'coupons', action: Action.READ },
    'POST /coupons': { resource: 'coupons', action: Action.CREATE },
    'PATCH /coupons/:id': { resource: 'coupons', action: Action.UPDATE },
    'DELETE /coupons/:id': { resource: 'coupons', action: Action.DELETE },
    // Avaliações
    'GET /avaliations': { resource: 'avaliations', action: Action.READ },
    'GET /avaliations/:id': { resource: 'avaliations', action: Action.READ },
    'POST /avaliations': { resource: 'avaliations', action: Action.CREATE },
    'PATCH /avaliations/:id': { resource: 'avaliations', action: Action.UPDATE },
    'DELETE /avaliations/:id': { resource: 'avaliations', action: Action.DELETE },
  }

  // Rotas públicas que não precisam de verificação de permissão
  private readonly publicRoutes: string[] = [
    // TEMPORARIAMENTE DESABILITADO - Todas as rotas são públicas
    '.*', // Este padrão curinga permite todas as rotas

    // Rotas originais (comentadas temporariamente)
    /*
    'POST /auth/login',
    'POST /auth/register',
    'POST /auth/forgot-password',
    'POST /auth/reset-password',
    'POST /invitations/accept/:token',
    'GET /plans/public',
    'GET /avaliations',
    'GET /avaliations/:id',
    'POST /avaliations',
    'PATCH /avaliations/:id',
    'DELETE /avaliations/:id',
    */
  ]
  public userId: string | null = null
  /**
   * Implementação do middleware
   */
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extrair método e caminho da requisição
      const method = req.method
      const path = this.normalizePath(req.path)
      const routeKey = `${method} ${path}`

      console.log('[AutoPermissionMiddleware] Verificando rota:', routeKey)

      // Verificar se é uma rota pública
      if (this.isPublicRoute(routeKey)) {
        console.log('[AutoPermissionMiddleware] Rota pública, permitindo acesso')
        return next()
      }

      // Extrair token do cabeçalho Authorization
      const authHeader = req.headers.authorization
      console.log(
        '[AutoPermissionMiddleware] Authorization header:',
        authHeader ? 'Presente' : 'Ausente',
      )

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[AutoPermissionMiddleware] Token não fornecido ou formato inválido')
        throw new UnauthorizedException('Token de autenticação não fornecido')
      }

      const token = authHeader.split(' ')[1]
      console.log('[AutoPermissionMiddleware] Token extraído, verificando...')

      try {
        // Verificar e decodificar o token JWT
        const payload = this.jwtService.verify(token)
        this.userId = String(payload.sub)
        console.log('[AutoPermissionMiddleware] Token válido, userId:', this.userId)

        // Buscar sessão ativa do usuário no Redis
        console.log('[AutoPermissionMiddleware] Buscando sessão no Redis para userId:', this.userId)
        const session = await this.sessionService.getUserActiveSession(this.userId)

        if (!session) {
          console.log('[AutoPermissionMiddleware] Sessão não encontrada no Redis')
          throw new UnauthorizedException('Sessão não encontrada ou expirada')
        }

        console.log('[AutoPermissionMiddleware] Sessão encontrada no Redis:', session.id)

        // Anexar informações do usuário ao objeto request para uso posterior
        // Compatível com o formato esperado pelo JwtStrategy e LoggerMiddleware
        ;(req as any).user = {
          userId: this.userId,
          role: payload.role,
          // Dados adicionais da sessão se disponíveis
          ...(session.userData && typeof session.userData === 'object' ? session.userData : {}),
        }

        console.log('[AutoPermissionMiddleware] Usuário anexado ao request:', (req as any).user)
      } catch (error) {
        console.log('[AutoPermissionMiddleware] Erro ao verificar token:', error)
        console.log(error)
        // Garantir que erros de token (incluindo expiração) retornem 401 Unauthorized

        throw new UnauthorizedException('Token inválido ou expirado')
        // Repassar o erro original para outros tipos de problemas
        throw error
      }

      // Verificar se a rota está mapeada
      const permission = this.getRoutePermission(routeKey)
      console.log('[AutoPermissionMiddleware] Permissão necessária:', permission)

      if (!permission) {
        // Se a rota não estiver mapeada, permitir acesso (pode ser uma rota pública não listada)
        console.log('[AutoPermissionMiddleware] Rota não mapeada, permitindo acesso')
        this.logger.warn(`Rota não mapeada: ${routeKey}`)
        return next()
      }

      // Verificar se o usuário tem a permissão necessária
      console.log('[AutoPermissionMiddleware] Verificando permissão para userId:', this.userId)
      const hasPermission = await this.effectivePermissionsService.hasPermission(
        String(this.userId),
        permission.resource,
        permission.action,
      )

      console.log(
        '[AutoPermissionMiddleware] Resultado da verificação de permissão:',
        hasPermission,
      )

      if (!hasPermission) {
        console.log('[AutoPermissionMiddleware] Acesso negado: permissão insuficiente')
        throw new ForbiddenException(
          `Você não tem permissão para ${this.getActionName(permission.action)} ${this.getResourceName(permission.resource)}`,
        )
      }

      console.log('[AutoPermissionMiddleware] Acesso permitido')
      next()
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
   * Normaliza o caminho da rota para corresponder ao formato do mapeamento
   * Substitui IDs específicos por :id para corresponder ao padrão
   */
  private normalizePath(path: string): string {
    // Remove a barra final se existir
    path = path.endsWith('/') ? path.slice(0, -1) : path

    // Divide o caminho em segmentos
    const segments = path.split('/').filter(Boolean)

    // Substitui IDs numéricos por :id
    const normalizedSegments = segments.map((segment, index) => {
      // Se não for o primeiro segmento e parecer um ID (numérico ou UUID)
      if (
        index > 0 &&
        (/^\d+$/.test(segment) || // ID numérico
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) // UUID
      ) {
        return ':id'
      }
      return segment
    })

    return '/' + normalizedSegments.join('/')
  }

  /**
   * Verifica se uma rota está na lista de rotas públicas
   */
  private isPublicRoute(routeKey: string): boolean {
    return this.publicRoutes.some((publicRoute) => {
      // Converte o padrão de rota pública em regex para suportar parâmetros
      const pattern = publicRoute.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(routeKey)
    })
  }

  /**
   * Obtém a permissão necessária para uma rota
   */
  private getRoutePermission(routeKey: string): { resource: string; action: Action } | null {
    // Verificar correspondência exata
    if (this.routePermissionMap[routeKey]) {
      return this.routePermissionMap[routeKey]
    }

    // Verificar correspondência com parâmetros
    for (const [route, permission] of Object.entries(this.routePermissionMap)) {
      // Converte o padrão de rota em regex para suportar parâmetros
      const pattern = route.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${pattern}$`)

      if (regex.test(routeKey)) {
        return permission
      }
    }

    return null
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
      users: 'Usuários',
      roles: 'Papéis',
      permissions: 'Permissões',
      plans: 'Planos',
      orders: 'Pedidos',
      coupons: 'Cupons',
      dashboard: 'Dashboard',
      rbac: 'Permissões de Acesso',
      blog: 'Blog',
      integracoes: 'Integrações',
      paginas: 'Páginas',
    }

    return resourceMap[resource] || resource
  }
}
