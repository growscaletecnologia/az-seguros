import { Injectable, Logger } from '@nestjs/common'
import { QuoteRequestDto } from '../dto/quote-request.dto'
import { NormalizedPlan } from '../dto/normalized-plan.dto'
import { PlansRepository } from '../repository/plans.repository'
import prisma from 'src/prisma/client'
import { BadRequestError } from 'src/common/errors/http-errors'
import { CouponsService } from 'src/coupons/coupons.service'
import { Coupon } from 'src/coupons/entities/coupon.entity'
import { Coupom } from '@prisma/client'


@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name)
  private readonly defaultCurrency = 'BRL'
  private readonly dollarValue = 5.6 // taxa fictícia de conversão

  constructor(private readonly couponService: CouponsService) {}
  // async calculateQuote(dto: QuoteRequestDto): Promise<any[]> {
  //   const { slug, departure, arrival, passengers, couponCode } = dto;

  //   let coupon;
  //   if(couponCode)
  //       coupon = await this.couponService.findByCode(couponCode);

  //   await this.validateRequest(dto);

  //   const days = this.calculateDays(departure, arrival);
  //   const avgAge = this.calculateAverageAge(passengers.map(p => ({ age: Number(p.age) })));

  //   this.logger.log(`Calculando cotação para destino: ${slug}, dias: ${days}, idade média: ${avgAge}`);

  //   const plans = await PlansRepository.findNormalizedPlans({ slug, age: avgAge });
    
  //   if (!plans) {
  //     this.logger.warn(`Nenhum plano encontrado para o destino: ${slug}`);
  //   }

  //   const dollar_price = await prisma.dollarCotation.findFirst({ where: { id: 1 } });
  //   const dolar = Number(dollar_price?.price || 1);

  //   const quotedPlans = plans.map(plan => {
  //     const detailedAgeGroups = plan.ageGroups.map(group => {
  //       const basePrice = Number(group.price);
  //       const iof = Number(group.priceIof);
  //       const isBrazil = slug.toLowerCase() === 'brasil';

  //       console.log('\n==============================');
  //       console.log(`[DEBUG] Calculando grupo etário: ${group.start}–${group.end}`);
  //       console.log(`[DEBUG] Base price:`, group.price, '→', basePrice);
  //       console.log(`[DEBUG] IOF:`, group.priceIof, '→', iof);
  //       console.log(`[DEBUG] Dias:`, days);
  //       console.log(`[DEBUG] Dólar cotação:`, dolar);
  //       console.log(`[DEBUG] É Brasil?`, isBrazil);

  //       // preço bruto (por pessoa)
  //       const baseValue = isBrazil
  //         ? basePrice * days // já em reais
  //         : (basePrice * days) * dolar; // converter de USD para BRL

  //       console.log(`[DEBUG] Base value (${isBrazil ? 'BRL' : 'USD→BRL'}):`, baseValue);

  //       const valorComIof = baseValue + (baseValue * iof);
  //       console.log(`[DEBUG] Valor com IOF aplicado:`, valorComIof);

  //       // aplica markup se existir
  //       let valorComMarkup = valorComIof;
  //       if (plan.markUp && plan.markUp > 0) {
  //         const margem = plan.markUp / 100;
  //         valorComMarkup = valorComIof / (1 - margem);
  //         console.log(`[DEBUG] Markup aplicado (${plan.markUp}%):`, valorComMarkup);
  //       } else {
  //         console.log(`[DEBUG] Sem markup aplicado.`);
  //       }

  //       console.log(`[DEBUG] Valor final por pessoa:`, valorComMarkup);
  //       console.log('==============================\n');

  //       // totalGroupValue agora é sempre o valor final (por pessoa, já com markup)
  //       return {
  //         start: group.start,
  //         end: group.end,
  //         price: basePrice,
  //         priceIof: iof,
  //         totalGroupValue: Number(valorComMarkup.toFixed(2)),
  //       };
  //     });


  //     // 💰 total real da cotação com base nas idades enviadas
  //     const total = passengers.reduce((acc, p) => {
  //       const group = detailedAgeGroups.find(g => p.age >= g.start && p.age <= g.end);
  //       return acc + (group ? group.totalGroupValue : 0);
  //     }, 0);

  //     const totalPriceWithPixDiscount = Number((total * 0.95).toFixed(2));
  //     const coverages = plan.coverages || [];
  //     const coverageHighlight = plan.coverageHighlight || [];
  //     return {
  //       code: plan.code,
  //       name: plan.name,
  //       slug: plan.slug,
  //       provider_code: plan.provider_code,
  //       provider_name: plan.provider_name,
  //       provider_terms_url: plan.term_url,
  //       totalPrice: Number(total.toFixed(2)),
  //       totalPriceWithPixDiscount,
  //       dolar,
  //       currency: this.defaultCurrency,
  //       days,
  //       passengers: passengers.length,
  //       ageGroups: detailedAgeGroups,
  //       benefits: plan.benefits,
  //       coverages,        
  //       coverageHighlight,
  //     };
  //   });

  //   this.logger.log(`Cotação calculada com sucesso para ${quotedPlans.length} planos.`);
  //   return quotedPlans;
  // }
async calculateQuote(dto: QuoteRequestDto): Promise<any[]> {
  const { slug, departure, arrival, passengers, couponCode } = dto;

  // 🔹 Busca o cupom, se informado
  
  let coupon: Coupom | null = null;
  if (couponCode) {
    coupon = await this.couponService.findByCode(couponCode);
  }

  await this.validateRequest(dto);

  const days = this.calculateDays(departure, arrival);
  const avgAge = this.calculateAverageAge(passengers.map((p) => ({ age: Number(p.age) })));

  this.logger.log(
    `Calculando cotação para destino: ${slug}, dias: ${days}, idade média: ${avgAge}`
  );

  const plans = await PlansRepository.findNormalizedPlans({ slug, age: avgAge });
  if (!plans || !plans.length) {
    this.logger.warn(`Nenhum plano encontrado para o destino: ${slug}`);
    return [];
  }

  const dollar_price = await prisma.dollarCotation.findFirst({ where: { id: 1 } });
  const dolar = Number(dollar_price?.price || 1);
  const isBrazil = slug.toLowerCase() === 'brasil';

  // 🔹 Função auxiliar pra aplicar o desconto do cupom
  const applyCoupon = (value: number): number => {
    if (!coupon) return value;
    let discounted = value;

    if (coupon.discountType === 'PERCENTAGE') {
      discounted = value * (1 - coupon.discount / 100);
    } else if (coupon.discountType === 'FIXED') {
      discounted = value - coupon.discount;
    }

    return Math.max(0, Number(discounted.toFixed(2)));
  };

  // 🔹 Processa os planos
  const quotedPlans = plans.map((plan) => {
    const detailedAgeGroups = plan.ageGroups.map((group) => {
      const basePrice = Number(group.price);
      const iof = Number(group.priceIof);

      // preço bruto (por pessoa)
      const baseValue = isBrazil
        ? basePrice * days // já em reais
        : basePrice * days * dolar; // converter de USD para BRL

      const valorComIof = baseValue + baseValue * iof;

      // aplica markup se existir
      let valorComMarkup = valorComIof;
      if (plan.markUp && plan.markUp > 0) {
        const margem = plan.markUp / 100;
        valorComMarkup = valorComIof / (1 - margem);
      }

      return {
        start: group.start,
        end: group.end,
        price: basePrice,
        priceIof: iof,
        totalGroupValue: Number(valorComMarkup.toFixed(2)),
      };
    });

    // 💰 total real da cotação com base nas idades enviadas
    const total = passengers.reduce((acc, p) => {
      const group = detailedAgeGroups.find((g) => p.age >= g.start && p.age <= g.end);
      return acc + (group ? group.totalGroupValue : 0);
    }, 0);

    // aplica cupom
    const discountedTotal = applyCoupon(total);
    const totalPriceWithPixDiscount = applyCoupon(discountedTotal * 0.95);

    const coverages = plan.coverages || [];
    const coverageHighlight = plan.coverageHighlight || [];

    return {
      code: plan.code,
      name: plan.name,
      slug: plan.slug,
      provider_code: plan.provider_code,
      provider_name: plan.provider_name,
      provider_terms_url: plan.term_url,
      totalPrice: discountedTotal,
      totalPriceWithPixDiscount,
      dolar,
      currency: this.defaultCurrency,
      days,
      passengers: passengers.length,
      ageGroups: detailedAgeGroups.map((g) => ({
        ...g,
        totalGroupValue: applyCoupon(g.totalGroupValue),
      })),
      benefits: plan.benefits,
      coverages,
      coverageHighlight,
      couponApplied: !!coupon,
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