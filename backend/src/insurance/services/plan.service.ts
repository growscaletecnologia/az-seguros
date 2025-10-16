import { Injectable, Logger } from '@nestjs/common'
import prisma from 'src/prisma/client'
import { HeroConnector } from '../connectors/hero.connector'
import { MTAConnector } from '../connectors/mta.connector'
import { PlansRepository } from '../repository/plans.repository'
import { QuoteService } from './quote.service'

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name)
  private readonly maxRetries = 0

  constructor(
    private readonly heroConnector: HeroConnector,
    private readonly mtaConnector: MTAConnector,
    private readonly quoteService: QuoteService
  ) {}

  /**
   * Sincroniza todos os planos de seguradoras ativas
   */
  async syncPlans() {
    const startTime = Date.now()
    let successfulInsurers = 0
    let failedInsurers = 0
    let externalTime = 0

    this.logger.log('[PlanService] Iniciando sincronização de planos...')
    try {
      const activeInsurers = await this.getActiveInsurers()
      this.logger.log(`[PlanService] Seguradoras ativas: ${activeInsurers.length}`)

      const results = await Promise.allSettled(
        activeInsurers.map(async (insurer) => {
          const connector = this.getConnector(insurer.insurerCode || '')
          if (!connector) {
            this.logger.warn(`[PlanService] Nenhum conector encontrado para ${insurer.insurerCode}`)
            failedInsurers++
            return
          }

          try {
            const externalStartTime = Date.now()
            const insurerPlans = await this.fetchPlansWithRetry(connector, insurer.id)
            externalTime += Date.now() - externalStartTime

            this.logger.log(
              `[PlanService] ${insurer.insurerName} sincronizada (${insurerPlans?.length || 0} planos)`
            )
          } catch (error) {
            failedInsurers++
            this.logger.error(
              `[PlanService] Erro ao sincronizar planos de ${insurer.insurerName}: ${error}`
            )
          }
        }),
      )

      results.forEach((result) => {
        if (result.status === 'fulfilled') successfulInsurers++
        else failedInsurers++
      })
    } catch (error) {
      this.logger.error('[PlanService] Erro geral ao sincronizar planos:', error)
      throw error
    }

    const totalTime = Date.now() - startTime
    return {
      data: {
        insurers: {
          successful: successfulInsurers,
          failed: failedInsurers,
        },
        timing: {
          total: totalTime,
          external: externalTime,
        },
      },
    }
  }

  /**
   * Retorna todos os planos (com paginação)
   */
  async findAll(page = 1, perPage = 10) {
    return PlansRepository.findAll(page, perPage)
  }

  /**
   * Retorna um plano específico
   */
  async findOne(id: number) {
    const plan = await PlansRepository.findOne(id)
    if (!plan) throw new Error(`Plano com ID ${id} não encontrado`)
    return plan
  }

  /**
   * Retorna um plano com benefícios (placeholder para futura relação)
   */
  async findWithBenefits(id: number) {
    const plan = await PlansRepository.findWithBenefits(id)
    if (!plan) throw new Error(`Plano com ID ${id} não encontrado`)
    return plan
  }

  /**
   * Deleta um plano do banco
   */
  async delete(id: number) {
    const plan = await PlansRepository.findOne(id)
    if (!plan) throw new Error(`Plano com ID ${id} não encontrado`)

    await PlansRepository.delete(id)
    this.logger.log(`[PlanService] Plano ${plan.name} deletado com sucesso`)
    return { message: `Plano ${plan.name} deletado com sucesso` }
  }

  /**
   * Busca planos com filtros e paginação
   * - destinyGroup: ID do destino
   * - age: idade (usada em faixa etária)
   */
  async findWithFilter(
    filters: { slug?: string; age?: number },
    page = 1,
    perPage = 10
  ) {
    return PlansRepository.findWithFilter(filters, page, perPage)
  }

  /**
   * Busca seguradoras ativas
   */
  private async getActiveInsurers() {
    return prisma.securityIntegration.findMany({
      where: { ativa: true },
      orderBy: { insurerName: 'asc' },
    })
  }

  /**
   * Determina o conector de acordo com o código da seguradora
   */
  private getConnector(insurerCode: string) {
    if (insurerCode === 'hero') return this.heroConnector
    if (insurerCode === 'mta') return this.mtaConnector
    throw new Error(`Nenhum conector encontrado para o código: ${insurerCode}`)
  }

  /**
   * Faz retry automático para buscar planos da seguradora
   */
  private async fetchPlansWithRetry(connector: any, insurerId: string, attempt = 0) {
    try {
      await connector.getTodayCotation()
      return await connector.getPlans(insurerId)
    } catch (error) {
      if (attempt >= this.maxRetries) throw error

      const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))

      this.logger.warn(
        `[PlanService] Retentando ${insurerId} (tentativa ${attempt + 1})`
      )
      return this.fetchPlansWithRetry(connector, insurerId, attempt + 1)
    }
  }

   async getPlanInfo(destination: string, departure: string, arrival: string, id: number) {
    try {
      this.logger.log(
        `[PlanService] Buscando informações do plano ${id} para destino ${destination}`,
      );

      const response = await this.quoteService.calculateQuote({
        slug: destination,
        departure,
        arrival,
        passengers: [{ type: 'age', age: 30 }],
        dateFormat: 'YYYY-MM-DD',
      });

      if (!response || !Array.isArray(response)) {
        throw new Error('Resposta inválida da QuoteService');
      }

      // Filtra o plano pelo id recebido
      const selectedPlan = response.find(plan => plan.code === id);

      if (!selectedPlan) {
        this.logger.warn(`[PlanService] Nenhum plano encontrado com ID ${id}`);
        return { message: 'Plano não encontrado' };
      }

      this.logger.log(`[PlanService] Plano ${selectedPlan.name} encontrado com sucesso`);

      // Retorna o plano filtrado e outras informações
      return {
        ...selectedPlan,
        destination,
        departure,
        arrival,
      };
    } catch (error) {
      this.logger.error(`[PlanService] Erro ao calcular cotação: ${error}`);
      throw error;
    }
  }
}
