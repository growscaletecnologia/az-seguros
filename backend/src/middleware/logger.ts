// logs/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'

import prisma from 'src/prisma/client'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now()

    res.on('finish', () => {
      const responseTime = Math.round(performance.now() - start)

      void prisma.log
        .create({
          data: {
            userId: (req as any).user?.id ?? null,
            path: req.path,
            method: req.method as any,
            statusCode: res.statusCode,
            userAgent: req.headers['user-agent'],
            ip: req.ip,
            requestBody: Object.keys(req.body ?? {}).length ? req.body : undefined,
            responseTime,
          },
        })
        .catch((err) => {
          console.error('Erro ao salvar log:', err)
        })
    })

    next()
  }
}
