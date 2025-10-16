import { Injectable, Logger } from '@nestjs/common'
import { QuoteRequestDto } from '../dto/quote-request.dto'
import { NormalizedPlan } from '../dto/normalized-plan.dto'
import { PlansRepository } from '../repository/plans.repository'
import prisma from 'src/prisma/client'
import { BadRequestError } from 'src/common/errors/http-errors'

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name)
  private readonly defaultCurrency = 'BRL'
  private readonly dollarValue = 5.6 // taxa fictícia de conversão

 
 async calculateQuote(dto: QuoteRequestDto): Promise<any[]> {
  const { slug, departure, arrival, passengers } = dto;

  await this.validateRequest(dto);

  const days = this.calculateDays(departure, arrival);
  const avgAge = this.calculateAverageAge(passengers.map(p => ({ age: Number(p.age) })));

  this.logger.log(`Calculando cotação para destino: ${slug}, dias: ${days}, idade média: ${avgAge}`);

  const plans = await PlansRepository.findNormalizedPlans({ slug, age: avgAge });
  console.log("plans", plans)
  if (!plans) {
    this.logger.warn(`Nenhum plano encontrado para o destino: ${slug}`);
    //throw new BadRequestError('Nenhum plano disponível para os critérios fornecidos.');
  }

  const dollar_price = await prisma.dollarCotation.findFirst({ where: { id: 1 } });
  const dolar = Number(dollar_price?.price || 1);

  const quotedPlans = plans.map(plan => {
    let total = 0;

    // 🧮 tabela de valores calculados por faixa etária
    const detailedAgeGroups = plan.ageGroups.map(group => {
      const faixaValor = passengers
        .filter(p => p.age >= group.start && p.age <= group.end)
        .map(p => {
          const price = Number(group.price);
          const iof = Number(group.priceIof);
            const isBrazil = slug.toLowerCase() === 'brasil';
          const baseValue = isBrazil
            ? price * days // já em reais
        : (price * days) * dolar; // converter de USD para BRL

          const valorFinal = baseValue + (baseValue * iof);

          let valorComMarkup = valorFinal;
          if (plan.markUp && plan.markUp > 0) {
            const margem = plan.markUp / 100;
            valorComMarkup = valorFinal / (1 - margem);
          }

          return valorComMarkup;
        });

      const totalGroupValue = faixaValor.reduce((acc, v) => acc + v, 0);

      return {
        start: group.start,
        end: group.end,
        price: Number(group.price),
        priceIof: Number(group.priceIof),
        totalGroupValue: Number(totalGroupValue.toFixed(2)),
      };
    });

    // 💰 soma total geral
    total = detailedAgeGroups.reduce((acc, g) => acc + g.totalGroupValue, 0);

    // 💸 aplica desconto de 5% no PIX
    const totalPriceWithPixDiscount = Number((total * 0.95).toFixed(2));

    return {
      code: plan.code,
      name: plan.name,
      slug: plan.slug,
      provider_code: plan.provider_code,
      provider_name: plan.provider_name,
      provider_terms_url: plan.term_url,
      totalPrice: Number(total.toFixed(2)),
      totalPriceWithPixDiscount,
      dolar:dolar,
      currency: this.defaultCurrency,
      days,
      passengers: passengers.length,
      ageGroups: detailedAgeGroups,
      benefits: plan.benefits,
    };
  });

  this.logger.log(`Cotação calculada com sucesso para ${quotedPlans.length} planos.`);
  return quotedPlans;
}

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