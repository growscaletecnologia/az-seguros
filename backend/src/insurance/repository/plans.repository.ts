import prisma from 'src/prisma/client'
import { Prisma } from '@prisma/client'

export const PlansRepository = {
  /**
   * Retorna todos os planos com paginação
   */
   
  async findAll(page = 1, perPage = 10) {
     const where: Prisma.InsurerPlanWhereInput = {
        securityIntegration: {
          ativa: true, // ✅ só planos com integração ativa
        },
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
              destiny: true,
            },
          },
          coverages: {
            include: {
              coverage: true,
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
    return prisma.insurerPlan.findFirst({
      where: { id,
        securityIntegration: {
          ativa: true, 
        },
       },
      include: {
        destinies: {
          include: {
            ageGroups: true,
            destiny: true,
          },
        },
        coverages: {
          include: {
            coverage: true,
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
    return prisma.insurerPlan.findFirst({
      where: { id,
        securityIntegration: {
          ativa: true, 
        }
       },
      include: {
        destinies: {
          include: {
            ageGroups: true,
            destiny: true,
          },
        },
        coverages: {
          include: {
            coverage: true,
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
//   async findWithFilter(
//     filters: { slug?: string; age?: number },
//     page = 1,
//     perPage = 30
//   ) {
//     const { slug, age } = filters
//     const where: Prisma.InsurerPlanWhereInput = {

//        securityIntegration: {
//         ativa: true,
//        },
//     }

//     console.log('[PlansRepository] Filtro recebido:', { slug, age })

//     if (slug && age !== undefined) {
//       where.AND = [
//         {
//           destinies: {
//             some: {
//               slug,
//             },
//           },
//         },
//         {
//           destinies: {
//             some: {
//               ageGroups: {
//                 some: { start: { lte: age }, end: { gte: age } },
//               },
//             },
//           },
//         },
//       ]
//     }
//     // 🔹 apenas slug
//     else if (slug) {
//       where.destinies = {
//         some: { slug },
//       }
//     }
//     // 🔹 apenas age
//     else if (age !== undefined) {
//       where.destinies = {
//         some: {
//           ageGroups: {
//             some: { start: { lte: age }, end: { gte: age } },
//           },
//         },
//       }
//     }

//     const [items, total] = await Promise.all([
//       prisma.insurerPlan.findMany({
//         where,
//         skip: (page - 1) * perPage,
//         take: perPage,
//         include: {
//           destinies: {
//             include: {
//               ageGroups: true,
//             },
//           },
//           coverages: {
//             include: {
//               coverage: true,
//             },
//           },
//             securityIntegration: {
//             select: { insurerName: true, insurerCode: true,  markUp:true , ativa:true},
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//       }),
//       prisma.insurerPlan.count({ where }),
//     ])

//     console.log(`[PlansRepository] Retornados ${items.length} planos`)

//     return {
//       meta: {
//         page,
//         perPage,
//         total,
//         totalPages: Math.ceil(total / perPage),
//       },
//       data: items,
//     }
//   },

//  async findNormalizedPlans(filters: { slug?: string; age?: number }) {
//   const { slug, age } = filters

//   const resp = await this.findWithFilter({ slug, age })
//   const plans = resp.data

//   return plans.map((plan) => {
//     const provider = plan.securityIntegration

//     // 🔹 filtra apenas os destinos do slug solicitado
//     const matchingDestinies = plan.destinies.filter(
//       (dest) => dest.slug.toLowerCase() === slug?.toLowerCase()
//     )

//     // 🔹 extrai e deduplica faixas etárias desse destino
//     const ageGroups = matchingDestinies.flatMap((dest) =>
//       dest.ageGroups.map((group) => ({
//         start: group.start,
//         end: group.end,
//         price: group.price.toString(),
//         priceIof: group.priceIof?.toString() || null,
//       }))
//     )

//     const uniqueGroups = ageGroups.reduce((acc, curr) => {
//       const exists = acc.some(
//         (g) =>
//           g.start === curr.start &&
//           g.end === curr.end &&
//           g.price === curr.price &&
//           g.priceIof === curr.priceIof
//       )
//       if (!exists) acc.push(curr)
//       return acc
//     }, [])

//     uniqueGroups.sort((a, b) => a.start - b.start)

//     return {
//       code: plan.id,
//       name: plan.name,
//       slug: plan.slug,
//       provider_code: provider?.insurerCode || '',
//       provider_name: provider?.insurerName || '',
//       markUp: provider?.markUp,
//       ageGroups: uniqueGroups,
//       benefits: [
//         { id: 51, name: 'Despesa Médica Hospitalar' },
//         { id: 55, name: 'Validade Geográfica' },
//         { id: 57, name: 'Cobertura COVID-19' },
//       ],
//       covid_coverage: false,
//       travel_renewal: 'no',
//       receptive_product: false,
//       special_product: false,
//       specialist_indicator: true,
//       tags: '',
//     }
//   })
// }



 async findWithFilter(filters: { slug?: string; age?: number }, page = 1, perPage = 30) {
    const { slug, age } = filters
    const where: Prisma.InsurerPlanWhereInput = {
      securityIntegration: { ativa: true },
    }

    if (slug && age !== undefined) {
      where.AND = [
        { destinies: { some: { slug } } },
        {
          destinies: {
            some: {
              ageGroups: { some: { start: { lte: age }, end: { gte: age } } },
            },
          },
        },
      ]
    } else if (slug) {
      where.destinies = { some: { slug } }
    } else if (age !== undefined) {
      where.destinies = {
        some: {
          ageGroups: { some: { start: { lte: age }, end: { gte: age } } },
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
            include: { ageGroups: true, destiny: true },
          },
          coverages: {
            include: { coverage: true },
          },
          // 🔹 inclui os benefícios reais
          planBenefits: {
            include: {
              planBenefit: true,
            },
          },
          // 🔹 inclui dados do provider e do termo
          securityIntegration: {
            select: {
              insurerName: true,
              insurerCode: true,
              markUp: true,
              ativa: true,
              insurerProvider: { select: { terms_url: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.insurerPlan.count({ where }),
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
   * Retorna planos normalizados (sem mocks de benefícios)
   */
  async findNormalizedPlans(filters: { slug?: string; age?: number }) {
    const { slug, age } = filters
    const resp = await this.findWithFilter({ slug, age })
    const plans = resp.data

    return plans.map((plan) => {
      const provider = plan.securityIntegration

      // 🔹 filtra destinos que correspondem ao slug
      const matchingDestinies = plan.destinies.filter(
        (dest) => dest.slug.toLowerCase() === slug?.toLowerCase()
      )

      // 🔹 extrai grupos de idade e valores
      const ageGroups = matchingDestinies.flatMap((dest) =>
        dest.ageGroups.map((group) => ({
          start: group.start,
          end: group.end,
          price: group.price.toString(),
          priceIof: group.priceIof?.toString() || null,
        }))
      )

      // 🔹 remove duplicatas
      const uniqueGroups = ageGroups.reduce((acc, curr) => {
        const exists = acc.some(
          (g) =>
            g.start === curr.start &&
            g.end === curr.end &&
            g.price === curr.price &&
            g.priceIof === curr.priceIof
        )
        if (!exists) acc.push(curr)
        return acc
      }, [])

      uniqueGroups.sort((a, b) => a.start - b.start)

      // 🔹 converte os benefícios reais (sem mocks)
      const benefits = plan.planBenefits.map((pb) => ({
        id: pb.planBenefit.id,
        code: pb.planBenefit.code,
        category_name: pb.planBenefit.categoryName,
        name: pb.planBenefit.name,
        long_description: pb.planBenefit.longDescription,
      }))

      return {
        code: plan.id,
        name: plan.name,
        slug: plan.slug,
        provider_code: provider?.insurerCode || '',
        provider_name: provider?.insurerName || '',
        markUp: provider?.markUp,
        term_url: provider?.insurerProvider?.terms_url || null,
        ageGroups: uniqueGroups,
        benefits,
        covid_coverage: false,
        travel_renewal: 'no',
        receptive_product: false,
        special_product: false,
        specialist_indicator: true,
        tags: '',
      }
    })
  },
}