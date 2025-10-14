type GeneratePixQrCodeRequestCommon = {
  amount: number
  description: string
  reference: string
}

type GeneratePixQrCodeResponseCommon = {
  qrcode: string
  amount: number
  description: string
  reference: string
  tax: number
}

export type GeneratePixQrCodeRequestRawType = GeneratePixQrCodeRequestCommon & {
  company_uuid: string
  user_uuid: string
  expiration_date: string
  webhook_url?: string
}

export type GeneratePixQrCodeResponseRawType = GeneratePixQrCodeResponseCommon & {
  transaction_uuid: string
  formatted_amount: string
  liquid_amount: number
  percentage_tax: number
  total_tax: number
  max_tax: boolean
}

export type GeneratePixQrCodeRequestType = GeneratePixQrCodeRequestCommon & {
  companyUuid: string
  userUuid: string
  expirationDate: string
  webhookUrl?: string
}

export type GeneratePixQrCodeResponseType = GeneratePixQrCodeResponseCommon & {
  transactionUuid: string
  formattedAmount: string
  liquidAmount: number
  percentageTax: number
  totalTax: number
  maxTax: boolean
}
