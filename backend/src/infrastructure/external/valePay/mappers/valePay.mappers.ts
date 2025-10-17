import {
  GeneratePixQrCodeRequestRawType,
  GeneratePixQrCodeRequestType,
  GeneratePixQrCodeResponseRawType,
  GeneratePixQrCodeResponseType,
  TransactionsStartRequestRawType,
  TransactionsStartRequestType,
  TokenizeCardRequestRawType,
  TokenizeCardRequestType,
  TransactionsCustomerRequestRawType,
  TransactionsCustomerRequestType,
  TransactionsPaymentRequestRawType,
  TransactionsPaymentRequestType,
  ValePayCompanyConfig,
} from '../types/valePay.types'

export function mapPixQrCodeRequestToRaw({
  companyUuid,
  expirationDate,
  userUuid,
  webhookUrl,
  ...common
}: GeneratePixQrCodeRequestType & ValePayCompanyConfig): GeneratePixQrCodeRequestRawType {
  return {
    company_uuid: companyUuid,
    user_uuid: userUuid,
    expiration_date: expirationDate,
    webhook_url: webhookUrl,
    ...common,
  }
}

export function mapPixQrCodeResponseToDomain({
  formatted_amount,
  liquid_amount,
  max_tax,
  percentage_tax,
  total_tax,
  transaction_uuid,
  ...common
}: GeneratePixQrCodeResponseRawType): GeneratePixQrCodeResponseType {
  return {
    transactionUuid: transaction_uuid,
    formattedAmount: formatted_amount,
    liquidAmount: liquid_amount,
    percentageTax: percentage_tax,
    totalTax: total_tax,
    maxTax: max_tax,
    ...common,
  }
}

export function mapTransactionsStartRequestToRaw({
  markupType,
  calculateMarkup,
  entryMoney,
  productId,
  webhookUrl,
  companyUuid,
  ...common
}: TransactionsStartRequestType & { companyUuid: string }): TransactionsStartRequestRawType {
  return {
    markup_type: markupType,
    calculate_markup: calculateMarkup,
    entry_money: entryMoney,
    product_id: productId,
    webhook_url: webhookUrl,
    company_uuid: companyUuid,
    ...common,
  }
}

export function mapTransactionsCustomerRequestToRaw({
  transactionUuid,
  customer: { taxId, motherName, birthDate, ...common },
}: TransactionsCustomerRequestType): TransactionsCustomerRequestRawType {
  return {
    transaction_uuid: transactionUuid,
    customer: {
      tax_id: taxId,
      mother_name: motherName,
      birth_date: birthDate,
      ...common,
    },
  }
}

export function mapTokenizeCardRequestToRaw(
  data: TokenizeCardRequestType,
): TokenizeCardRequestRawType {
  return {
    cardNumber: data.cardNumber,
    transaction_uuid: data.transactionUuid,
  }
}

export function mapTransactionsPaymentRequestToRaw({
  transactionUuid,
  paymentInfo: { softDescription, ipAddress, ...common },
}: TransactionsPaymentRequestType): TransactionsPaymentRequestRawType {
  return {
    transaction_uuid: transactionUuid,
    paymentInfo: {
      ip_address: ipAddress,
      soft_description: softDescription,
      ...common,
    },
  }
}
