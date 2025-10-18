import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface ValePayConfig {
  baseUrl: string
  timeout: number
  publicKey: string
  privateKey: string
  accessToken?: string
  companyUuid: string
  userUuid: string
}

@Injectable()
export class ValePayProvider {
  private axiosInstance: AxiosInstance
  private config: ValePayConfig
  private logger: Logger

  constructor(private readonly configService: ConfigService) {
    this.config = {
      publicKey: this.configService.getOrThrow('VALEPAY_PUBLIC_KEY'),
      privateKey: this.configService.getOrThrow('VALEPAY_PRIVATE_KEY'),
      baseUrl: this.configService.get('VALEPAY_BASE_URL') || 'https://api.valepay.com/v1',
      timeout: this.configService.get('VALEPAY_TIMEOUT') || 10000,
      accessToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiM2M1NzBmZWFkYjc5ZmNiOWFkZmE1YmU1NWY5MzBjNDc3MDMzMDBmZTNmYjEyN2NiNWQyZmFiMTRhYTkxMTBlMTdiYmYxYjdmMzVlZjYzNWYiLCJpYXQiOjE3NjA2NTY3MTIuOTQwMzczLCJuYmYiOjE3NjA2NTY3MTIuOTQwMzc3LCJleHAiOjE3NjA3NDMxMTIuOTE1MDEzLCJzdWIiOiIxODIiLCJzY29wZXMiOlsiY29tcGFueS1hcGkiXX0.Ww8_m8PsecT0-j7-eOBIBRHnpHiiqUGQol1STSME1ZhhlirD3Ozj9FOikzGHk0eqG4ap0PbJzNbgF1hpyGZ3-P0c7zRm5gl7UebUViJ2Jz0ZuaHej9nVdFhz3VwKdy-ufPnlgQi41AU6K7bDCqFrD9aEMmZR0dDw8ng0I92WDDrhRQbQrQolC5j7l74BhDMCe3IQBP254cKIDgST9H6lRV4a14bfLssgCBZaR6gK4ngm-rPlbolGHpdUovImK864ACVDmy_f9GEQp2sR-itzqLe0DibYRLuT5aBK5LqqcJfvkLgJteSBQJwhiPvxSbwVArQ6yqD3j9GM1WxqncokeM-U3zVlh5045VEMsaUUUtO2TC1tDEFZHQgbqC-pUaBEuyiWXVdKUk4ttktpG7TyEfLqlWPRT9pl2fVnAJfW_Rig5AGjfRAWu-EqaItKBfSf2WNezVSvUZ-QuDE_HxWPQAWklcHjUY0-ZUS3RBG6wffydJzTnq_39VwBqV5wFZJwXikfFDcKc-p-o2XHEJ5qrzVMcxF0cDQVEyYTZtTVNliQkfX7O5ukLS53SbSxw0iboWB3TmfZbU_L5tjUEO24gSxFkAxXnmkCmxeMuXpke9L1zWr3k1HM7ZHAwyVoMZGbrJx0ceFA3t4mzCiSLvvZ7kf4C1Xs_tix-SKLr_Ttuyw',
      companyUuid: this.configService.getOrThrow('VALEPAY_COMPANY_UUID'),
      userUuid: this.configService.getOrThrow('VALEPAY_USER_UUID'),
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
    this.logger.error(`Response Error Message: ${JSON.stringify(error.message)}`)
    this.logger.error(`Response Error: ${JSON.stringify(error)}`)

    if (error.response?.status === HttpStatus.UNAUTHORIZED) {
      this.authenticate()

      if (error.config) {
        error.config.headers.Authorization = this.buildHeaders().Authorization

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
          public: this.config.publicKey,
          private: this.config.privateKey,
        },
      },
    )

// TODO: Adicionar refresh automático do token com base na expiração: response.data.data.token.expires_in
    this.config.accessToken = response.data.data.token.access_token
    this.logger.log('Authentication successful.')
  }

  public getAxiosInstance = (): AxiosInstance => {
    return this.axiosInstance
  }

  public getCompanyConfig = () => {
    return { companyUuid: this.config.companyUuid, userUuid: this.config.userUuid }
  }
}
