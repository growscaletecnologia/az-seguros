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
  code_sale: string
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
  codeSale: string
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

export type TransactionStartRawResponse = {
  uuid: string
  total: number
  installments: number
  acquirer_guid: string
  amount_installments: number
  code_sale: string
  amount_return: number
}

export type TransactionStartResponse = {
  uuid: string
  total: number
  installments: number
  acquirerGuid: string
  amountInstallments: number
  codeSale: string
  amountReturn: number
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

export type TransactionCustomerResponseRaw = {
  uuid: string
  total: number
  installments: number
  amount_installments: number
  customer_uuid: string
}

export type TransactionCustomerResponse = {
  uuid: string
  total: number
  installments: number
  amountInstallments: number
  customerUuid: string
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

export type TokenizeCardResponseType = {
  token: string
  paymentMethodID: string
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

type TransactionPaymentResponseCommon = {
  uuid: string
  installments: number
  authorization: string
  product: {
    name: string
  }
  status: {
    id: number
    status: string
  }
}

export type TransactionPaymentResponseRawType = TransactionPaymentResponseCommon & {
  code_sale: string
  total_amount: number
  amount_instalment: number
  amount_return: number
  payment_date: Date | string
  antecipation_date: Date | string
  sof_description: string
  aquirer_message: string
}

export type TransactionPaymentResponseType = TransactionPaymentResponseCommon & {
  codeSale: string
  totalAmount: number
  amountInstalment: number
  amountReturn: number
  paymentDate: Date | string
  antecipationDate: Date | string
  sofDescription: string
  aquirerMessage: string
}

// -- ValePay Transaction Payment -- END --
