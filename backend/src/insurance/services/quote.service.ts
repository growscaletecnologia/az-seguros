import { Injectable, Logger } from '@nestjs/common'
import { QuoteRequestDto } from '../dto/quote-request.dto'
import { NormalizedPlan } from '../dto/normalized-plan.dto'
import { PlansRepository } from '../repository/plans.repository'
import prisma from 'src/prisma/client'

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name)
  private readonly defaultCurrency = 'BRL'
  private readonly dollarValue = 5.6 // taxa fictícia de conversão

async calculateQuote(dto: QuoteRequestDto): Promise<any[]> {
  const { slug, departure, arrival, passengers } = dto

  await this.validateRequest(dto)

  const days = this.calculateDays(departure, arrival)
  const avgAge = this.calculateAverageAge(passengers.map(p => ({ age: Number(p.age) })))

  this.logger.log(`Calculando cotação para destino: ${slug}, dias: ${days}, idade média: ${avgAge}`)

  // busca planos normalizados apenas pro destino informado
  const plans = await PlansRepository.findNormalizedPlans({ slug, age: avgAge})

  if (!plans || plans.length === 0) {
    this.logger.warn(`Nenhum plano encontrado para o destino: ${slug}`)
    throw new Error('Nenhum plano disponível para os critérios fornecidos.')
  }
  const dollar_price = await prisma.dollarCotation.findFirst({
    where: {
      id: 1,
    }
  })
  const quotedPlans = plans.map((plan) => {
    let total = 0

    for (const passenger of passengers) {
      const age = Number(passenger.age)
      const group = plan.ageGroups.find(g => age >= g.start && age <= g.end)

      if (!group) {
        this.logger.warn(`Plano ${plan.name} não tem faixa etária para idade ${age}`)
        continue
      }

      const price = Number(group.price)
      const iof = Number(group.priceIof)
      const isBrazil = slug.toLowerCase() === 'brasil'

      // 💰 cálculo real da diária × dias
      const baseValue = price * days * (isBrazil ? 1 : Number(dollar_price?.price));

      const totalPassenger = baseValue + (baseValue * iof);
      total += totalPassenger
      // 💰 adiciona markup se houver
      if (plan.markUp && plan.markUp > 0) {
        total += totalPassenger * (plan.markUp / 100)
      }
    }
   
    return {
      code: plan.code,
      name: plan.name,
      slug: plan.slug,
      provider_code: plan.provider_code,
      provider_name: plan.provider_name,
      totalPrice: Number(total.toFixed(2)),
      currency: this.defaultCurrency,
      days,
      passengers: passengers.length,
      ageGroups: plan.ageGroups,
      benefits: plan.benefits,
    }
  })

  this.logger.log(`Cotação calculada com sucesso para ${quotedPlans.length} planos.`)
  return quotedPlans
}


  // 🔹 validações auxiliares
  private async validateRequest(dto: QuoteRequestDto): Promise<void> {
    const start = new Date(dto.departure)
    const end = new Date(dto.arrival)
    const now = new Date()

    if (dto.passengers.length === 0) throw new Error('É necessário pelo menos um passageiro.')

    if (dto.passengers.some((p) => Number(p.age) < 0 || Number(p.age) > 120)) {
      throw new Error('Idade inválida para um ou mais passageiros.')
    }
  }

 private calculateDays(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)

  // zera horas pra evitar diferença por fuso
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  const diffMs = endDate.getTime() - startDate.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  // 🔹 se for 0, retorna 1 (mesmo dia = 1 diária)
  const days = diffDays > 0 ? diffDays : 1

  console.log('[QuoteService] Dias calculados:', { start, end, diffDays, result: days })

  return days
}

  private calculateAverageAge(passengers: { age: number }[]): number {
    const sum = passengers.reduce((acc, p) => acc + p.age, 0)
    return Math.floor(sum / passengers.length)
  }
}