import prisma from 'src/prisma/client'
import { Prisma } from '@prisma/client'

export const PlansRepository = {
  /**
   * Retorna todos os planos com paginação
   */
  async findAll(page = 1, perPage = 10) {
    const [items, total] = await Promise.all([
      prisma.insurerPlan.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          destinies: {
            include: {
              ageGroups: true,
              destiny: true,
            },
          },
          securityIntegration: {
            select: { insurerName: true, insurerCode: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.insurerPlan.count(),
    ])

    return {
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
      data: items,
    }
  },

  /**
   * Retorna um plano específico por ID
   */
  async findOne(id: number) {
    return prisma.insurerPlan.findUnique({
      where: { id },
      include: {
        destinies: {
          include: {
            ageGroups: true,
            destiny: true,
          },
        },
        securityIntegration: {
          select: { insurerName: true, insurerCode: true },
        },
      },
    })
  },

  /**
   * Retorna um plano específico com benefícios
   * (placeholder — depois você pode relacionar PlanBenefit)
   */
  async findWithBenefits(id: number) {
    return prisma.insurerPlan.findUnique({
      where: { id },
      include: {
        destinies: {
          include: {
            ageGroups: true,
            destiny: true,
          },
        },
        // benefits: true, // adicionar quando relacionar
        securityIntegration: {
          select: { insurerName: true, insurerCode: true },
        },
      },
    })
  },

  /**
   * Deleta um plano e suas dependências
   */
  async delete(id: number) {
    return prisma.insurerPlan.delete({ where: { id } })
  },

  /**
   * Busca planos com filtros opcionais + paginação
   * - slug: ID do destino (Destiny.id)
   * - age: número, verifica se idade está entre start e end
   */
 async findWithFilter(
  filters: { slug?: string; age?: number },
  page = 1,
  perPage = 10
) {
  const { slug, age } = filters
  const where: Prisma.InsurerPlanWhereInput = {}

  console.log('[PlansRepository] Filtro recebido:', { slug, age })

  // 🔹 ambos slug e age
  if (slug && age !== undefined) {
    where.AND = [
      {
        destinies: {
          some: {
            slug, // <-- slug vem direto de InsurerPlanDestiny
          },
        },
      },
      {
        destinies: {
          some: {
            ageGroups: {
              some: { start: { lte: age }, end: { gte: age } },
            },
          },
        },
      },
    ]
  }
  // 🔹 apenas slug
  else if (slug) {
    where.destinies = {
      some: { slug },
    }
  }
  // 🔹 apenas age
  else if (age !== undefined) {
    where.destinies = {
      some: {
        ageGroups: {
          some: { start: { lte: age }, end: { gte: age } },
        },
      },
    }
  }

  const [items, total] = await Promise.all([
    prisma.insurerPlan.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        destinies: {
          include: {
            ageGroups: true,
          },
        },
        securityIntegration: {
          select: { insurerName: true, insurerCode: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.insurerPlan.count({ where }),
  ])

  console.log(`[PlansRepository] Retornados ${items.length} planos`)

  return {
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
    data: items,
  }
}}