import prisma from 'src/prisma/client'
import { Prisma } from '@prisma/client'
import { CoverageItem } from 'src/types/types'

export const PlansRepository = {
  /**
   * Retorna todos os planos com paginação
   */
   
  async findAll(page = 1, perPage = 10) {
     const where: Prisma.InsurerPlanWhereInput = {
        securityIntegration: {
          ativa: true, 
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
        planBenefits: {
          include: { planBenefit: true },
        },
          securityIntegration: {
            select: { insurerName: true, insurerCode: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.insurerPlan.count(),
    ])
     const formattedItems = items.map((plan) => {
    const coverages = plan.coverages.map((pc) => ({
      id: pc.coverage.id,
      title: pc.coverage.title,
      value: pc.value,
      slug: pc.coverage.slug,
      type: pc.coverageType,
      displayOrder: pc.coverage.displayOrder,
    }))

    // agrupa por título e pega a cobertura de maior valor
    
    const coverageHighlight: CoverageItem[] = [];
    const grouped = new Map<string, CoverageItem[]>()

    for (const c of coverages) {
      if (!grouped.has(c.title)) grouped.set(c.title, [])
      grouped.get(c.title)?.push(c)
    }

    for (const [, group] of grouped.entries()) {
      const sorted = group.sort((a, b) => {
        const valA = parseFloat(a.value.replace(/\./g, '').replace(',', '.')) || 0
        const valB = parseFloat(b.value.replace(/\./g, '').replace(',', '.')) || 0
        return valB - valA // maior primeiro
      })
      coverageHighlight.push(sorted[0])
    }

    // Ordena os highlights pela ordem de exibição original (displayOrder)
    const orderedHighlight = coverageHighlight.sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
    )

    return {
      ...plan,
      coverages,
      coverageHighlight: orderedHighlight.slice(0, 2), // pega as 2 principais
    }
  })
  return {
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
    data: formattedItems,
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
        planBenefits: {
          include: { planBenefit: true },
        },
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

  // 🔹 Busca planos com coberturas e benefícios
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
        planBenefits: {
          include: { planBenefit: true },
        },
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

  // 🔹 Organiza coverages e cria highlights
  const formattedItems = items.map((plan) => {
    const coverages = plan.coverages.map((pc) => ({
      id: pc.coverage.id,
      title: pc.coverage.title,
      value: pc.value,
      slug: pc.coverage.slug,
      type: pc.coverageType,
      displayOrder: pc.coverage.displayOrder,
    }))

    // agrupa por título e pega a cobertura de maior valor
    
    const coverageHighlight: CoverageItem[] = [];
    const grouped = new Map<string, CoverageItem[]>()

    for (const c of coverages) {
      if (!grouped.has(c.title)) grouped.set(c.title, [])
      grouped.get(c.title)?.push(c)
    }

    for (const [, group] of grouped.entries()) {
      const sorted = group.sort((a, b) => {
        const valA = parseFloat(a.value.replace(/\./g, '').replace(',', '.')) || 0
        const valB = parseFloat(b.value.replace(/\./g, '').replace(',', '.')) || 0
        return valB - valA // maior primeiro
      })
      coverageHighlight.push(sorted[0])
    }

    // Ordena os highlights pela ordem de exibição original (displayOrder)
    const orderedHighlight = coverageHighlight.sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
    )

    return {
      ...plan,
      coverages,
      coverageHighlight: orderedHighlight.slice(0, 2), // pega as 2 principais
    }
  })
  return {
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
    data: formattedItems,
  }
},


  /**
   * Retorna planos normalizados (sem mocks de benefícios)
   */
  
  async findNormalizedPlans(filters: { slug?: string; age?: number }) {
  const { slug, age } = filters;
  const resp = await this.findWithFilter({ slug, age });
  const plans = resp.data;

  return plans.map((plan) => {
    const provider = plan.securityIntegration;

    // 🔹 filtra destinos que correspondem ao slug
    const matchingDestinies = plan.destinies.filter(
      (dest) => dest.slug.toLowerCase() === slug?.toLowerCase()
    );

    // 🔹 extrai grupos de idade e valores
    const ageGroups = matchingDestinies.flatMap((dest) =>
      dest.ageGroups.map((group) => ({
        start: group.start,
        end: group.end,
        price: group.price.toString(),
        priceIof: group.priceIof?.toString() || null,
      }))
    );

    // 🔹 remove duplicatas
    const uniqueGroups = ageGroups.reduce((acc, curr) => {
      const exists = acc.some(
        (g) =>
          g.start === curr.start &&
          g.end === curr.end &&
          g.price === curr.price &&
          g.priceIof === curr.priceIof
      );
      if (!exists) acc.push(curr);
      return acc;
    }, []);

    uniqueGroups.sort((a, b) => a.start - b.start);

    
    const benefits = plan.planBenefits.map((pb) => ({
      id: pb.planBenefit.id,
      code: pb.planBenefit.code,
      category_name: pb.planBenefit.categoryName,
      name: pb.planBenefit.name,
      long_description: pb.planBenefit.longDescription,
    }));


    const coverages = plan.coverages;


    const grouped = new Map<string, any[]>();
    for (const c of coverages) {
      if (!grouped.has(c.title)) grouped.set(c.title, []);
      grouped.get(c.title)?.push(c);
    }

    
    const coverageHighlight: CoverageItem[] = [];
    for (const [, group] of grouped.entries()) {
      const sorted = group.sort((a, b) => {
        const valA = parseFloat(a.value.replace(/\./g, '').replace(',', '.')) || 0;
        const valB = parseFloat(b.value.replace(/\./g, '').replace(',', '.')) || 0;
        return valB - valA;
      });
      coverageHighlight.push(sorted[0]);
    }

    const orderedHighlight = coverageHighlight
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .slice(0, 2); // pega só os 2 top
    // 🔹 resposta final normalizada
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
      coverages,             
      coverageHighlight: orderedHighlight,
      covid_coverage: false,
      travel_renewal: 'no',
      receptive_product: false,
      special_product: false,
      specialist_indicator: true,
      tags: '',
    };
  });
}

}