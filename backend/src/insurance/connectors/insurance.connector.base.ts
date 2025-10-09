import axios, { AxiosInstance } from 'axios'
import { QuoteRequestDto } from '../dto/quote-request.dto'
import { NormalizedPlan } from '../dto/normalized-plan.dto'
//import { TokenService } from '../services/token.service';
import prisma from 'src/prisma/client'
import { TokenService } from '../services/token.service'

export abstract class InsuranceConnectorBase {
  protected axiosInstance: AxiosInstance
  protected readonly maxRetries = 1
  protected readonly timeout = 10000 // 10 seconds

  constructor(public tokenService: TokenService) {}

  protected initializeAxios(): void {
    this.axiosInstance = axios.create({
      timeout: this.timeout,
    })

    // Add retry interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.config || !this.shouldRetry(error)) {
          return Promise.reject(error)
        }

        error.config.__retryCount = (error.config.__retryCount || 0) + 1

        if (error.config.__retryCount > this.maxRetries) {
          return Promise.reject(error)
        }

        // Exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, error.config.__retryCount), 10000)
        await new Promise((resolve) => setTimeout(resolve, backoffDelay))

        // If token expired, try to refresh it
        if (error.response?.status === 401) {
          const newToken = await this.authenticate()
          error.config.headers.Authorization = `Bearer ${newToken}`
        }

        return this.axiosInstance(error.config)
      },
    )
  }

  abstract authenticate(id?: string): Promise<string>
  abstract getPlans(id?: string): Promise<NormalizedPlan[]>
  abstract getCotation(params: QuoteRequestDto, id?: string): Promise<NormalizedPlan[]>
  protected abstract normalizePlans(rawData: any, id?: string): Promise<NormalizedPlan[]>

  protected shouldRetry(error: any): boolean {
    // Retry on network errors and 5xx responses
    if (!error.response) return true
    if (error.response.status >= 500) return true
    if (error.response.status === 401) return true
    return false
  }

  protected async withErrorHandling<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data)
      }
      throw error
    }
  }

  protected async applyMarkup(
    plans: NormalizedPlan[],
    insurerId: string,
  ): Promise<NormalizedPlan[]> {
    const insurer = await prisma.securityIntegration.findFirst({
      where: { id: insurerId },
      select: { markUp: true },
    })

    if (!insurer?.markUp) {
      return plans
    }

    //@ts-ignore
    return plans.map((plan) => ({
      ...plan,
      price: Number(plan.price) * (1 + (insurer.markUp || 0) / 100),
      markupApplied: true,
    }))
  }
}
