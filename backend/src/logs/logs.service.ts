import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import prisma from '../prisma/client';
import { HttpMethod } from '@prisma/client';

interface FindAllParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  path?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
}

@Injectable()
export class LogsService {
  async findAll(params: FindAllParams) {
    const { page, limit, sortBy, sortOrder, path, method, statusCode, userId } = params;
    const skip = (page - 1) * limit;

    // Construir o filtro baseado nos parâmetros opcionais
    const where: any = {};
    if (path) where.path = { contains: path };
    if (method) where.method = method as HttpMethod;
    if (statusCode) where.statusCode = statusCode;
    if (userId) where.userId = userId;

    // Buscar logs com paginação
    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.log.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return prisma.log.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
