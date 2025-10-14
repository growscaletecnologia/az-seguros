import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface ValePayConfig {
  apiKey: string
  apiSecret: string
  baseUrl: string
  timeout: number
  accessToken: string | null
}

@Injectable()
export class ValePayProvider {
  private axiosInstance: AxiosInstance
  private config: ValePayConfig
  private logger: Logger

  constructor(private readonly configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get('VALEPAY_API_KEY') || '',
      apiSecret: this.configService.get('VALEPAY_API_SECRET') || '',
      baseUrl: this.configService.get('VALEPAY_BASE_URL') || 'https://api.valepay.com/v1',
      timeout: this.configService.get('VALEPAY_TIMEOUT') || 10000,
      accessToken: null,
    }
    this.initializeAxios()
    this.logger = new Logger(ValePayProvider.name)
  }

  private readonly buildHeaders = (): Record<string, string> => {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.config.accessToken}`,
    }
  }

  private readonly initializeAxios = (): void => {
    this.axiosInstance = axios.create({
      baseURL: process.env.VALEPAY_BASE_URL || 'https://hom-payments.valepay.dev.br',
      timeout: 10000,
    })

    this.configureRequestInterceptor()
    this.configureResponseInterceptor()
  }

  private readonly configureRequestInterceptor = (): void => {
    this.axiosInstance.interceptors.request.use(
      this.requestInterceptor,
      this.requestInterceptorError,
    )
  }

  private readonly requestInterceptor = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    this.logger.log(`Requesting [${config.method?.toUpperCase()}] ${config.url}`)
    config.headers = {
      ...config.headers,
      ...this.buildHeaders(),
    } as InternalAxiosRequestConfig['headers']
    return config
  }

  private readonly requestInterceptorError = (error: unknown) => {
    this.logger.error(`Request Error: ${JSON.stringify(error)}`)
    return Promise.reject(error)
  }

  private readonly configureResponseInterceptor = (): void => {
    this.axiosInstance.interceptors.response.use(
      this.responseInterceptor,
      this.responseInterceptorError,
    )
  }

  private readonly responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    this.logger.log(
      `Response [${response.status}] from ${response.config.url}, data: ${JSON.stringify(response.data)}`,
    )
    return response
  }

  private readonly responseInterceptorError = async (error: AxiosError) => {
    this.logger.error(`Response Error: ${JSON.stringify(error)}`)

    if (error.response?.status === HttpStatus.UNAUTHORIZED) {
      this.authenticate()

      if (error.config) {
        delete error.config.headers?.Authorization

        return await this.axiosInstance.request(error.config)
      }
    }

    return Promise.reject(error)
  }

  private readonly authenticate = async () => {
    this.logger.log('Authenticating with ValePay API...')

    const response = await this.axiosInstance.post(
      'v1/api/authenticate',
      {},
      {
        headers: {
          public: this.config.apiKey,
          private: this.config.apiSecret,
        },
      },
    )

    this.config.accessToken = response.data.access_token
    this.logger.log('Authentication successful.')
  }

  public getAxiosInstance = (): AxiosInstance => {
    return this.axiosInstance
  }
}
