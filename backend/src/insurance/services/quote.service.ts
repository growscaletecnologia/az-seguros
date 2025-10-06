import { Injectable, Logger } from '@nestjs/common';
import { QuoteRequestDto } from '../dto/quote-request.dto';
import { NormalizedPlan } from '../dto/normalized-plan.dto';
import { CacheService } from './cache.service';
import { HeroConnector } from '../connectors/hero.connector';
import { ConfigService } from '@nestjs/config';
import prisma from 'src/prisma/client'

interface QuoteResponse {
  meta: {
    requestId: string;
    destination: string;
    days: number;
    passengers: number;
    averageAge: number;
    ageGroup: string;
    insurers: {
      total: number;
      successful: number;
      failed: number;
    };
    timing: {
      total: number;
      cache: number;
      external: number;
    };
  };
  plans: NormalizedPlan[];
}

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);
  private readonly maxRetries = 2;
  private readonly defaultCurrency = 'BRL';

  constructor(
    private readonly cacheService: CacheService,
    private readonly heroConnector: HeroConnector,
    private readonly configService: ConfigService,
  ) {}

  async getQuotes(dto: QuoteRequestDto): Promise<QuoteResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    this.logger.log(`Starting quote request ${requestId} for ${dto.destination}`);

    try {
      await this.validateRequest(dto);

      const { destination, passengers } = dto;
      const days = this.calculateDays(dto.travelStart, dto.travelEnd);
      const avgAge = this.calculateAverageAge(passengers);
      const ageGroup = this.determineAgeGroup(avgAge);

      const activeInsurers = await this.getActiveInsurers();
      const plans: NormalizedPlan[] = [];
      let successfulInsurers = 0;
      let failedInsurers = 0;
      let cacheTime = 0;
      let externalTime = 0;

      const results = await Promise.allSettled(
        activeInsurers.map(async (insurer) => {
          const cacheKey = this.cacheService.generateQuoteKey({
            destination,
            paxCount: passengers.length,
            ageGroup,
            days,
            insurerId: insurer.id,
          });

          const cacheStartTime = Date.now();
          const cached = await this.cacheService.get<NormalizedPlan[]>(cacheKey);
          cacheTime += Date.now() - cacheStartTime;

          if (cached) {
            this.logger.debug(
              `Cache hit for ${insurer.insurerName} - ${requestId}`
            );
            plans.push(...cached);
            successfulInsurers++;
            return;
          }

          try {
            const externalStartTime = Date.now();
            const connector = this.getConnector(insurer.id);
            if (!connector) {
              failedInsurers++;
              return;
            }

            const insurerPlans = await this.fetchPlansWithRetry(
              connector,
              dto,
              insurer.insurerName ||""
            );
            externalTime += Date.now() - externalStartTime;

            if (insurerPlans.length > 0) {
              await this.cacheService.set(cacheKey, insurerPlans);
              plans.push(...insurerPlans);
              successfulInsurers++;
            } else {
              failedInsurers++;
            }
          } catch (error) {
            failedInsurers++;
            this.logger.error(
              `Error fetching plans from ${insurer.insurerName} - ${requestId}:`,
              error
            );
          }
        })
      );

      const totalTime = Date.now() - startTime;

      const response: QuoteResponse = {
        meta: {
          requestId,
          destination,
          days,
          passengers: passengers.length,
          averageAge: avgAge,
          ageGroup,
          insurers: {
            total: activeInsurers.length,
            successful: successfulInsurers,
            failed: failedInsurers,
          },
          timing: {
            total: totalTime,
            cache: cacheTime,
            external: externalTime,
          },
        },
        plans: this.processPlans(plans, dto.currency),
      };

      this.logger.log(
        `Completed quote request ${requestId} in ${totalTime}ms with ${successfulInsurers} successful insurers`
      );

      return response;
    } catch (error) {
      this.logger.error(`Error processing quote request ${requestId}:`, error);
      throw error;
    }
  }

  private async validateRequest(dto: QuoteRequestDto): Promise<void> {
    const start = new Date(dto.travelStart);
    const end = new Date(dto.travelEnd);
    const now = new Date();

    if (start < now) {
      throw new Error('Travel start date must be in the future');
    }

    if (end <= start) {
      throw new Error('Travel end date must be after start date');
    }

    if (dto.passengers.length === 0) {
      throw new Error('At least one passenger is required');
    }

    if (dto.passengers.some(p => p.age < 0 || p.age > 120)) {
      throw new Error('Invalid passenger age');
    }
  }

  private async fetchPlansWithRetry(
    connector: any,
    dto: QuoteRequestDto,
    insurerName: string,
    attempt = 1
  ): Promise<NormalizedPlan[]> {
    try {
      return await connector.getPlans(dto);
    } catch (error) {
      if (attempt >= this.maxRetries) {
        throw error;
      }

      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));

      this.logger.warn(
        `Retrying ${insurerName} after failure (attempt ${attempt + 1})`
      );
      return this.fetchPlansWithRetry(connector, dto, insurerName, attempt + 1);
    }
  }

  private getConnector(insurerId: string) {
    // In a real implementation, this would dynamically return the correct connector
    // based on the insurer ID. For now, we just return the Hero connector.
    return this.heroConnector;
  }

  private calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  private calculateAverageAge(passengers: { age: number }[]): number {
    const sum = passengers.reduce((acc, p) => acc + p.age, 0);
    return Math.floor(sum / passengers.length);
  }

  private determineAgeGroup(avgAge: number): string {
    if (avgAge < 18) return 'MINOR';
    if (avgAge < 30) return 'YOUNG';
    if (avgAge < 60) return 'ADULT';
    return 'SENIOR';
  }

  private processPlans(plans: NormalizedPlan[], targetCurrency?: string): NormalizedPlan[] {
    const normalizedPlans = plans.map(plan => ({
      ...plan,
      currency: plan.currency || this.defaultCurrency,
    }));

    // Convert currency if needed (would implement exchange rate conversion here)
    if (targetCurrency && targetCurrency !== this.defaultCurrency) {
      // TODO: Implement currency conversion
    }

    return this.sortPlans(normalizedPlans);
  }

  private sortPlans(plans: NormalizedPlan[]): NormalizedPlan[] {
    return [...plans].sort((a, b) => {
      // First by price
      if (a.price !== b.price) return a.price - b.price;
      
      // Then by medical coverage
      return b.coverage.medical - a.coverage.medical;
    });
  }

  private async getActiveInsurers() {
    return prisma.securityIntegration.findMany({
      where: { ativa: true },
      orderBy: { insurerName: 'asc' },
    });
  }

  private generateRequestId(): string {
    return `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}