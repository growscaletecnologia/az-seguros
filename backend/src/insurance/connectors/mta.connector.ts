import { Injectable, Logger } from '@nestjs/common'
import { InsuranceConnectorBase } from './insurance.connector.base'
import { QuoteRequestDto } from '../dto/quote-request.dto'
import { NormalizedPlan } from '../dto/normalized-plan.dto'
import prisma from 'src/prisma/client'
import { TokenService } from '../services/token.service'
import { BadRequestError } from 'src/common/errors/http-errors'

@Injectable()
export class MTAConnector extends InsuranceConnectorBase {
  baseUrl = ''

  private readonly logger = new Logger(MTAConnector.name)
   constructor(tokenService: TokenService) {
    super(tokenService); // Passa o tokenService para o construtor da classe base
   }

  async authenticate(id?: string): Promise<string> {
    console.log('[MTAConnector] authenticate() called');
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { id: id },
      });
      console.log('[MTAConnector] Credentials:', credentials);
      if (!credentials) {
        console.log('[MTAConnector] Hero credentials not found');
        throw new Error('Hero credentials not found');
      }
  
      // Usa a authUrl completa diretamente
      const fullAuthUrl = credentials.authUrl;
      if (!fullAuthUrl) {
        throw new Error('authUrl is not defined in credentials');
      }
  
      this.initializeAxios();
      this.logger.debug('Authenticating with Hero API...');
      console.log('[MTAConnector] Authenticating with Hero API...');
      console.log('[MTAConnector] fullAuthUrl:', fullAuthUrl);
  
      try {
        const { data } = await this.axiosInstance.post(
          fullAuthUrl,
          {
            username: credentials.username,
            grant_type: credentials.grantType,
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            password: credentials.password,
            scope: credentials.scope,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        console.log('[MTAConnector] Auth response:', data);
  
        await this.tokenService.updateTokens(
          credentials.id,
          data.access_token,
          data.refresh_token,
          data.expires_in
        );
  
        this.logger.debug('Successfully authenticated with Hero API');
        console.log('[MTAConnector] Successfully authenticated with Hero API');
        return data.access_token;
      } catch (err) {
        console.log('[MTAConnector] Error during authentication:', err);
        throw err;
      }
    });
  }
  
  async getPlans(params?: QuoteRequestDto, id?: string): Promise<NormalizedPlan[]> {
    console.log('[MTAConnector] getPlans() called with params:', params);
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { id: id },
      });
      console.log('[MTAConnector] getPlans credentials:', credentials);
      if (!credentials) {
        console.log('[MTAConnector] Hero credentials not found');
        throw new Error('Hero credentials not found');
      }
  
      // Usa a baseUrl completa diretamente
      const fullBaseUrl = credentials.baseUrl;
      if (!fullBaseUrl) {
        throw new Error('baseUrl is not defined in credentials');
      }
  
      this.initializeAxios();
  
      // Verifica se existe accessToken válido, senão autentica
      if (!credentials.accessToken) {
        console.log('[MTAConnector] No accessToken, authenticating...');
        credentials.accessToken = await this.authenticate(id);
      }
   
      this.logger.debug('Requesting quotes from MTA API...');
      const fullPlansUrl = `${fullBaseUrl}getPlans`; // Adiciona o endpoint ao final da baseUrl
      console.log('[MTAConnector] fullPlansUrl:', fullPlansUrl);
  
      try {

        if(credentials.accessToken){
          const { data } = await this.axiosInstance.get(fullPlansUrl, {
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('[MTAConnector] API response:', data);
    
          // Transform the indexed object into an array
          const plansArray = Object.values(data.data).filter((item) => typeof item === 'object');
          console.log('[MTAConnector] Transformed plans array:', plansArray);
    
          // Process data directly without Zod validation
          const processedData = { plans: plansArray, metadata: data.metadata || {} };
          console.log('[MTAConnector] Processed data (without validation):', processedData);
    
          // Normalize and apply markup
          const normalizedPlans = this.normalizePlans(processedData, credentials.id);
          console.log('[MTAConnector] Normalized plans:', normalizedPlans);
    
          return normalizedPlans;
        }else{
          throw new BadRequestError('No accessToken found');
        }
       
      } catch (err) {
        console.error('[MTAConnector] Error during getPlans:', err);
        throw err;
      }
    });
  }

  protected async  normalizePlans(rawData: { plans: any[]; metadata: any }, insurerId: string): Promise<NormalizedPlan[]> {
    const appliedMarkUp = await this.applyMarkup(rawData.plans, insurerId);
  
    return appliedMarkUp.map((plan) => {
      console.log('[MTAConnector] Normalizing plan:', plan);
  
      return {
        name: plan.name,
        slug: plan.slug || plan.name.toLowerCase().replace(/\s+/g, '-'),
        group: plan.group || plan.name,
        currency: plan.currency || 'USD',
        is: plan.is || '',
        is_receptive: plan.is_receptive || 0,
        is_travel_extension: plan.is_travel_extension || 0,
        is_default: plan.is_default || 0,
        min_days_qtd: plan.min_days_qtd || 0,
        min_passengers_qtd: plan.min_passengers_qtd || 0,
        categories: plan.categories || [],
        can_show_local_currency: plan.can_show_local_currency || 0,
        locate_currency: plan.locate_currency || 'USD',
        plan_id: plan.plan_id,
        price: plan.price || '0.00',
        price_raw: plan.price_raw || '0',
        price_to_calc: plan.price_to_calc || '0.00',
        price_to_calc_raw: plan.price_to_calc_raw || '0',
        price_to_calc_currency_bill: plan.price_to_calc_currency_bill || 'USD',
        cocation_usd: plan.cocation_usd || '0.00',
        cocation_usd_raw: plan.cocation_usd_raw || '0',
        cocation_eur: plan.cocation_eur || '0.00',
        cocation_eur_raw: plan.cocation_eur_raw || '0',
        days: plan.days || 0,
        additional_id: plan.additional_id || 0,
        currency_bill: plan.currency_bill || 'USD',
        coverages: (plan.coverages || []).map((coverage: any) => ({
          is: coverage.is || '',
          coverage_type: coverage.coverage_type || '',
          coverage: {
            id: coverage.coverage?.id || 0,
            title: coverage.coverage?.title || '',
            name: coverage.coverage?.name || '',
            slug: coverage.coverage?.slug || '',
            highlight: coverage.coverage?.highlight || '',
            content: coverage.coverage?.content || '',
            display_order: coverage.coverage?.display_order || 0,
          },
        })),
      };
    });
  }

  // private buildQuoteRequest(params: QuoteRequestDto) {
  //   console.log('[MTAConnector] buildQuoteRequest called with:', params)
  //   const req = {
  //     destination: params.destination,
  //     start_date: params.travelStart,
  //     end_date: params.travelEnd,
  //     passengers: params.passengers.map((p) => {
  //       const passenger = {
  //         age: p.age,
  //         coverage_type: this.determineCoverageType(p.age),
  //       }
  //       console.log('[MTAConnector] Passenger for request:', passenger)
  //       return passenger
  //     }),
  //     currency: params.currency || 'BRL',
  //     options: {
  //       include_covid: true,
  //       include_baggage: true,
  //     },
  //   }
  //   console.log('[MTAConnector] Final request body:', req)
  //   return req
  // }

  async getCotation(params?: QuoteRequestDto, id?: string){
      console.log('[MTAConnector] getCotation() called with params:', params);
    return this.withErrorHandling(async () => {
      const credentials = await prisma.securityIntegration.findFirst({
        where: { id: id },
      });
      //console.log('[MTAConnector] getCotation credentials:', credentials);
      if (!credentials) {
        console.log('[MTAConnector] MTA credentials not found');
        throw new Error('MTA credentials not found');
      }
  
      // Usa a baseUrl completa diretamente
      const fullBaseUrl = credentials.baseUrl;
      if (!fullBaseUrl) {
        throw new Error('baseUrl is not defined in credentials');
      }
  
      this.initializeAxios();
  
      // Verifica se existe accessToken válido, senão autentica
      if (!credentials.accessToken) {
        console.log('[MTAConnector] No accessToken, authenticating...');
        credentials.accessToken = await this.authenticate(id);
      }
   
      this.logger.debug('Requesting quotes from MTA API...');
      const fullPlansUrl = `${fullBaseUrl}cotation`; 
      //console.log('[MTAConnector] fullPlansUrl:', fullPlansUrl);
  
      try {

        if(credentials.accessToken){
          const { data } = await this.axiosInstance.post(fullPlansUrl, 
            params,
            {
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            
          });
          //console.log('[MTAConnector] API response:', data);
    
          // Transform the indexed object into an array
          const plansArray = Object.values(data.data).filter((item) => typeof item === 'object');
          console.log('[MTAConnector] Transformed plans array:', plansArray);
    
          // Process data directly without Zod validation
          const processedData = { plans: plansArray, metadata: data.metadata || {} };
          console.log('[MTAConnector] Processed data (without validation):', processedData);
    
          // Normalize and apply markup
          const normalizedPlans = this.normalizePlans(processedData, id||'');
          console.log('[MTAConnector] Normalized plans:', normalizedPlans);
    
          return normalizedPlans;
        }else{
          throw new BadRequestError('No accessToken found');
        }
       
      } catch (err) {
        console.error('[MTAConnector] Error during getPlans:', err);
        throw err;
      }
    });
  }

  private determineCoverageType(age: number): string {
    console.log('[MTAConnector] determineCoverageType called with age:', age)
    if (age < 18) return 'CHILD'
    if (age >= 65) return 'SENIOR'
    return 'ADULT'
  }
}