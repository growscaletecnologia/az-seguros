import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { InsuranceConnectorBase } from './insurance.connector.base';
import { QuoteRequestDto } from '../dto/quote-request.dto';
import { NormalizedPlan } from '../dto/normalized-plan.dto';
//import { TokenService } from '../services/token.service';
import prisma from 'src/prisma/client';

// Response validation schemas
// const HeroPlanSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   total_price: z.number().positive(),
//   currency: z.string().optional().default('BRL'),
//   destination: z.string(),
//   medical_coverage: z.number().positive(),
//   baggage_coverage: z.number().optional(),
//   covid_coverage: z.boolean().optional(),
//   days: z.number().positive(),
//   details: z.object({
//     description: z.string().optional(),
//     conditions: z.string().optional(),
//     exclusions: z.array(z.string()).optional(),
//   }).optional(),
// });

// const HeroResponseSchema = z.object({
//   plans: z.array(HeroPlanSchema),
//   metadata: z.object({
//     request_id: z.string(),
//     timestamp: z.string(),
//   }).optional(),
// });

@Injectable()
export class HeroConnector extends InsuranceConnectorBase {
  readonly insurerId = 'hero';
  baseUrl = '';
  
  private readonly logger = new Logger(HeroConnector.name);

  async authenticate(): Promise<string> {
    console.log('[HeroConnector] authenticate() called');
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { insurerName: 'hero' },
      });
      console.log('[HeroConnector] Credentials:', credentials);
      if (!credentials) {
        console.log('[HeroConnector] Hero credentials not found');
        throw new Error('Hero credentials not found');
      }
      // baseUrl deve ser apenas '/api/' para requests, authUrl apenas '/oauth/token/'
      this.baseUrl = credentials.baseUrl || '/api/';
      this.initializeAxios();
      this.logger.debug('Authenticating with Hero API...');
      console.log('[HeroConnector] Authenticating with Hero API...');
      const fullAuthUrl = `https://api.homologacao.heroseguros.com.br${credentials.authUrl || '/oauth/token/'}`;
      console.log('[HeroConnector] fullAuthUrl:', fullAuthUrl);
      try {
        const { data } = await this.axiosInstance.post(
          fullAuthUrl.replace('https://api.homologacao.heroseguros.com.br', ''),
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
        console.log('[HeroConnector] Auth response:', data);
        
        // await this.tokenService.updateTokens(
        //   credentials.id,
        //   data.access_token,
        //   data.refresh_token,
        //   data.expires_in
        // );
        this.logger.debug('Successfully authenticated with Hero API');
        console.log('[HeroConnector] Successfully authenticated with Hero API');
        return data.access_token;
      } catch (err) {
        console.log('[HeroConnector] Error during authentication:', err);
        throw err;
      }
    });
  }

  async getPlans(params?: QuoteRequestDto): Promise<NormalizedPlan[]> {
    console.log('[HeroConnector] getPlans() called with params:', params);
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { ativa: true },
      });
      console.log('[HeroConnector] getPlans credentials:', credentials);
      if (!credentials) {
        console.log('[HeroConnector] Hero credentials not found');
        throw new Error('Hero credentials not found');
      }
      // baseUrl deve ser apenas '/api/' para requests
      this.baseUrl = credentials.baseUrl || '/api/';
      this.initializeAxios();
      // Verifica se existe accessToken válido, senão autentica
      
      if (!credentials.accessToken) {
        console.log('[HeroConnector] No accessToken, authenticating...');
        credentials.accessToken = await this.authenticate();
      }
      console.log('[HeroConnector] AccessToken:', credentials.accessToken);
      // Monta o corpo do request, se params não vier, envia vazio
      const requestBody = params ? this.buildQuoteRequest(params) : {};
      console.log('[HeroConnector] Request body:', requestBody);
      this.logger.debug('Requesting quotes from Hero API...');
      const fullPlansUrl = 'https://api.homologacao.heroseguros.com.br/api/getPlans';
      console.log('[HeroConnector] fullPlansUrl:', fullPlansUrl);
      try {
        const { data } = await this.axiosInstance.get(
          fullPlansUrl,
          {
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
       console.log('[HeroConnector] API response:', data);

        // Transform the indexed object into an array
        const plansArray = Object.values(data.data).filter((item) => typeof item === 'object');
        console.log('[HeroConnector] Transformed plans array:', plansArray);

        // Process data directly without Zod validation
        const processedData = { plans: plansArray, metadata: data.metadata || {} };
        console.log('[HeroConnector] Processed data (without validation):', processedData);

        // Normalize and apply markup
        const normalizedPlans = this.normalizePlans(processedData);
        console.log('[HeroConnector] Normalized plans:', normalizedPlans);

        return normalizedPlans;
      } catch (err) {
        console.error('[HeroConnector] Error during getPlans:', err);
        throw err;
      }
    });
  }

  protected normalizePlans(rawData: { plans: any[]; metadata: any }): NormalizedPlan[] {
    console.log('[HeroConnector] normalizePlans called with:', rawData);
    return rawData.plans.map((plan) => {
      console.log('[HeroConnector] Normalizing plan:', plan);
      return {
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
      };
    });
  }

  private buildQuoteRequest(params: QuoteRequestDto) {
    console.log('[HeroConnector] buildQuoteRequest called with:', params);
    const req = {
      destination: params.destination,
      start_date: params.travelStart,
      end_date: params.travelEnd,
      passengers: params.passengers.map(p => {
        const passenger = {
          age: p.age,
          coverage_type: this.determineCoverageType(p.age),
        };
        console.log('[HeroConnector] Passenger for request:', passenger);
        return passenger;
      }),
      currency: params.currency || 'BRL',
      options: {
        include_covid: true,
        include_baggage: true,
      },
    };
    console.log('[HeroConnector] Final request body:', req);
    return req;
  }

  private determineCoverageType(age: number): string {
    console.log('[HeroConnector] determineCoverageType called with age:', age);
    if (age < 18) return 'CHILD';
    if (age >= 65) return 'SENIOR';
    return 'ADULT';
  }
}