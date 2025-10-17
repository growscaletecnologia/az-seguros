import { Injectable } from '@nestjs/common'
import { ValePayProvider } from '../provider/valePay.provider'
import { AxiosInstance } from 'axios'
import {
  GeneratePixQrCodeRequestType,
  GeneratePixQrCodeResponseType,
  TokenizeCardRequestType,
  TransactionsCustomerRequestType,
  TransactionsPaymentRequestType,
  TransactionsStartRequestType,
  ValePayCompanyConfig,
} from '../types/valePay.types'
import {
  mapPixQrCodeRequestToRaw,
  mapPixQrCodeResponseToDomain,
  mapTokenizeCardRequestToRaw,
  mapTransactionsPaymentRequestToRaw,
  mapTransactionsStartRequestToRaw,
} from '../mappers/valePay.mappers'

@Injectable()
export class ValePayService {
  private http: AxiosInstance
  private companyConfig: ValePayCompanyConfig

  constructor(valePayProvider: ValePayProvider) {
    this.http = valePayProvider.getAxiosInstance()
    this.companyConfig = valePayProvider.getCompanyConfig()
  }

  async genPixQrCode(data: GeneratePixQrCodeRequestType): Promise<GeneratePixQrCodeResponseType> {
    const body = mapPixQrCodeRequestToRaw({ ...data, ...this.companyConfig })

    const response = await this.http.post('/v1/api/pix/dynamic-qrcode', body)
    return mapPixQrCodeResponseToDomain(response.data)
  }

  async transactionStart(data: TransactionsStartRequestType): Promise<unknown> {
    const body = mapTransactionsStartRequestToRaw({
      ...data,
      companyUuid: this.companyConfig.companyUuid,
    })

    const response = await this.http.post('/v1/api/transactions/start', body)
    return response.data
  }

  async transactionCustomer(data: TransactionsCustomerRequestType): Promise<unknown> {
    const response = await this.http.post('/v1/api/transactions/customer', data)
    return response.data
  }

  async tokenizeCard(data: TokenizeCardRequestType): Promise<unknown> {
    const body = mapTokenizeCardRequestToRaw(data)

    const response = await this.http.post('/v1/api/cards/tokenize', body)
    return response.data
  }

  async transactionPayment(data: TransactionsPaymentRequestType): Promise<unknown> {
    const body = mapTransactionsPaymentRequestToRaw(data)

    const response = await this.http.post('/v1/api/transactions/payment', body)
    return response.data
  }
}
