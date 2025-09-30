// logs/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'

import prisma from 'src/prisma/client'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * Middleware para registrar logs de requisições HTTP
   * - Ignora requisições GET para reduzir volume de logs
   * - Captura informações detalhadas sobre a origem do request
   * - Registra tempo de resposta e dados da requisição
   * - Busca e salva informações do usuário autenticado (nome ou email)
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Ignora requisições GET
    if (req.method === 'GET') {
      return next()
    }

    const start = performance.now()

    res.on('finish', async () => {
      const responseTime = Math.round(performance.now() - start)

      // Extrai informações detalhadas sobre a origem do request
      const origin = this.extractOriginInfo(req)

      // Extrai informações do usuário autenticado
      const userInfo = await this.extractUserInfo(req)

      void prisma.log
        .create({
          data: {
            userId: userInfo.userId,
            userName: userInfo.userName,
            userEmail: userInfo.userEmail,
            path: req.path,
            method: req.method as any,
            statusCode: res.statusCode,
            userAgent: req.headers['user-agent'],
            ip: origin.ip,
            requestBody: Object.keys(req.body ?? {}).length ? req.body : undefined,
            responseTime,
            // Informações adicionais sobre a origem
            referer: req.headers.referer,
            origin: req.headers.origin,
            xForwardedFor: req.headers['x-forwarded-for'] as string,
            xRealIp: req.headers['x-real-ip'] as string,
            host: req.headers.host,
            acceptLanguage: req.headers['accept-language'],
          },
        })
        .catch((err) => {
          console.error('Erro ao salvar log:', err)
        })
    })

    next()
  }

  /**
   * Extrai informações do usuário autenticado
   * Busca o usuário completo no banco de dados para obter nome e email
   */
  private async extractUserInfo(req: Request) {
    const userId = (req as any).user?.userId ?? (req as any).user?.id ?? null

    if (!userId) {
      return {
        userId: null,
        userName: null,
        userEmail: null,
      }
    }

    try {
      // Busca o usuário completo no banco de dados
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      if (!user) {
        return {
          userId,
          userName: null,
          userEmail: null,
        }
      }

      return {
        userId: user.id,
        userName: user.name || null,
        userEmail: user.email,
      }
    } catch (error) {
      console.error('Erro ao buscar informações do usuário para log:', error)
      return {
        userId,
        userName: null,
        userEmail: null,
      }
    }
  }

  /**
   * Extrai informações detalhadas sobre a origem do request
   * Considera proxies, load balancers e CDNs
   */
  private extractOriginInfo(req: Request) {
    // Prioriza headers de proxy/load balancer para obter o IP real
    const xForwardedFor = req.headers['x-forwarded-for'] as string
    const xRealIp = req.headers['x-real-ip'] as string

    let realIp = req.ip

    if (xForwardedFor) {
      // X-Forwarded-For pode conter múltiplos IPs separados por vírgula
      // O primeiro é geralmente o IP original do cliente
      realIp = xForwardedFor.split(',')[0].trim()
    } else if (xRealIp) {
      realIp = xRealIp
    }

    return {
      ip: realIp,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      origin: req.headers.origin,
      host: req.headers.host,
      acceptLanguage: req.headers['accept-language'],
    }
  }
}
