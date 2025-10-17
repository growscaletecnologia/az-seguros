// ValePay API types

// -- ValePay Config -- START --
export type ValePayCompanyConfig = {
  companyUuid: string
  userUuid: string
}

export type ValePayCompanyConfigRaw = {
  company_uuid: string
  user_uuid: string
}
// -- ValePay Config -- END --

// -- ValePay Generate Pix QR Code -- START --
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
// -- ValePay Generate Pix QR Code -- END --

// -- ValePay Start Transaction -- START --
type TransactionsStartRequestCommon = {
  amount: number
  markup: string
  installments: number
  description: string
}

export type TransactionsStartRequestType = TransactionsStartRequestCommon & {
  markupType: string
  calculateMarkup: boolean
  entryMoney: number
  productId: number
  webhookUrl: string
}

export type TransactionsStartRequestRawType = TransactionsStartRequestCommon & {
  markup_type: string
  calculate_markup: boolean
  entry_money: number
  product_id: number
  webhook_url: string
  company_uuid: string
}
// -- ValePay Start Transaction -- END --

// -- ValePay Transaction Customer -- START --
type TransactionsCustomerCommon = {
  name: string
  document: string
  phone?: string
  cellphone: string
  gender: string
  email: string
  address: {
    zipcode: string
    address: string
    number: string
    complement?: string
    city: string
    state: string
    neighborhood: string
  }
}

export type TransactionsCustomerRequestType = {
  transactionUuid: string
  customer: TransactionsCustomerCommon & {
    taxId: string
    motherName?: string
    birthDate: string
  }
}

export type TransactionsCustomerRequestRawType = {
  transaction_uuid: string
  customer: TransactionsCustomerCommon & {
    tax_id: string
    mother_name?: string
    birth_date: string
  }
}

// -- ValePay Transaction Customer -- END --

// -- ValePay TokenizeCard -- START --

export type TokenizeCardRequestType = {
  cardNumber: string
  transactionUuid: string
}

export type TokenizeCardRequestRawType = {
  cardNumber: string
  transaction_uuid: string
}

// -- ValePay TokenizeCard -- END --

// -- ValePay Transaction Payment -- START --

type TransactionsPaymentInfoCommon = {
  token: string
  securityCode: string
  expirationMonth: string
  expirationYear: string
  cardholderName: string
  paymentMethodId: string
}

export type TransactionsPaymentRequestType = {
  transactionUuid: string
  paymentInfo: TransactionsPaymentInfoCommon & {
    softDescription: string
    ipAddress: string
  }
}

export type TransactionsPaymentRequestRawType = {
  transaction_uuid: string
  paymentInfo: TransactionsPaymentInfoCommon & {
    ip_address: string
    soft_description: string
  }
}

// -- ValePay Transaction Payment -- END --
