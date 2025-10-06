import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { InsuranceConnectorBase } from './insurance.connector.base';
import { QuoteRequestDto } from '../dto/quote-request.dto';
import { NormalizedPlan } from '../dto/normalized-plan.dto';
import { TokenService } from '../services/token.service';
import prisma from 'src/prisma/client';

// Response validation schemas
const HeroPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  total_price: z.number().positive(),
  currency: z.string().optional().default('BRL'),
  destination: z.string(),
  medical_coverage: z.number().positive(),
  baggage_coverage: z.number().optional(),
  covid_coverage: z.boolean().optional(),
  days: z.number().positive(),
  details: z.object({
    description: z.string().optional(),
    conditions: z.string().optional(),
    exclusions: z.array(z.string()).optional(),
  }).optional(),
});

const HeroResponseSchema = z.object({
  plans: z.array(HeroPlanSchema),
  metadata: z.object({
    request_id: z.string(),
    timestamp: z.string(),
  }).optional(),
});

@Injectable()
export class HeroConnector extends InsuranceConnectorBase {
  readonly insurerId = 'hero';
  readonly baseUrl = 'https://api.hero-seguros.com.br';
  
  private readonly logger = new Logger(HeroConnector.name);

  constructor(
    protected readonly tokenService: TokenService,
  ) {
    super(tokenService);
  }

  async authenticate(): Promise<string> {
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { insurerName: 'hero' },
      });

      if (!credentials) {
        throw new Error('Hero credentials not found');
      }

      this.logger.debug('Authenticating with Hero API...');

      const { data } = await this.axiosInstance.post(
        '/oauth/token',
        {
          grant_type: credentials.grantType,
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          scope: credentials.scope,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      await this.tokenService.updateTokens(
        credentials.id,
        data.access_token,
        data.refresh_token,
        data.expires_in
      );

      this.logger.debug('Successfully authenticated with Hero API');
      return data.access_token;
    });
  }

  async getPlans(params: QuoteRequestDto): Promise<NormalizedPlan[]> {
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { insurerName: 'hero' },
      });

      if (!credentials) {
        throw new Error('Hero credentials not found');
      }

      const { accessToken } = await this.tokenService.getTokens(credentials.id);
      
      const requestBody = this.buildQuoteRequest(params);
      
      this.logger.debug(
        `Requesting quotes for destination: ${params.destination}`
      );

      const { data } = await this.axiosInstance.post('/api/quotes', requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Validate response data
      const validatedData = HeroResponseSchema.parse(data);

      // Normalize and apply markup
      const normalizedPlans = this.normalizePlans(validatedData);
      return this.applyMarkup(normalizedPlans);
    });
  }

  protected normalizePlans(rawData: z.infer<typeof HeroResponseSchema>): NormalizedPlan[] {
    return rawData.plans.map((plan) => ({
      id: `hero-${plan.id}`,
      insurer: 'hero',
      name: plan.name,
      price: plan.total_price,
      currency: plan.currency || 'BRL',
      destination: plan.destination,
      coverage: {
        medical: plan.medical_coverage,
        baggage: plan.baggage_coverage,
        covid: plan.covid_coverage || false,
      },
      days: plan.days,
      markupApplied: false,
      metadata: {
        requestId: rawData.metadata?.request_id,
        timestamp: rawData.metadata?.timestamp,
        description: plan.details?.description,
        conditions: plan.details?.conditions,
        exclusions: plan.details?.exclusions,
      },
    }));
  }

  private buildQuoteRequest(params: QuoteRequestDto) {
    return {
      destination: params.destination,
      start_date: params.travelStart,
      end_date: params.travelEnd,
      passengers: params.passengers.map(p => ({
        age: p.age,
        coverage_type: this.determineCoverageType(p.age),
      })),
      currency: params.currency || 'BRL',
      options: {
        include_covid: true,
        include_baggage: true,
      },
    };
  }

  private determineCoverageType(age: number): string {
    if (age < 18) return 'CHILD';
    if (age >= 65) return 'SENIOR';
    return 'ADULT';
  }
}