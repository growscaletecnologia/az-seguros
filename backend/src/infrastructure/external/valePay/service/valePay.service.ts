import { Injectable } from '@nestjs/common'
import { ValePayProvider } from '../provider/valePay.provider'
import { AxiosInstance } from 'axios'
import {
  GeneratePixQrCodeRequestRawType,
  GeneratePixQrCodeRequestType,
  GeneratePixQrCodeResponseRawType,
  GeneratePixQrCodeResponseType,
} from '../types/valePay.types'

@Injectable()
export class ValePayService {
  private http: AxiosInstance

  constructor(valePayProvider: ValePayProvider) {
    this.http = valePayProvider.getAxiosInstance()
  }

  async genPixQrCode(data: GeneratePixQrCodeRequestType): Promise<GeneratePixQrCodeResponseType> {
    const body = this.mapPixQrCodeRequestToRaw(data)

    try {
      const response = await this.http.post<GeneratePixQrCodeResponseRawType>(
        '/v1/api/pix/dynamic-qrcode',
        body,
      )
      return this.mapPixQrCodeResponseToDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  private mapPixQrCodeRequestToRaw({
    companyUuid,
    expirationDate,
    userUuid,
    webhookUrl,
    ...singleWorded
  }: GeneratePixQrCodeRequestType): GeneratePixQrCodeRequestRawType {
    return {
      company_uuid: companyUuid,
      user_uuid: userUuid,
      expiration_date: expirationDate,
      webhook_url: webhookUrl,
      ...singleWorded,
    }
  }

  private mapPixQrCodeResponseToDomain({
    formatted_amount,
    liquid_amount,
    max_tax,
    percentage_tax,
    total_tax,
    transaction_uuid,
    ...singleWorded
  }: GeneratePixQrCodeResponseRawType): GeneratePixQrCodeResponseType {
    return {
      transactionUuid: transaction_uuid,
      formattedAmount: formatted_amount,
      liquidAmount: liquid_amount,
      percentageTax: percentage_tax,
      totalTax: total_tax,
      maxTax: max_tax,
      ...singleWorded,
    }
  }
}
