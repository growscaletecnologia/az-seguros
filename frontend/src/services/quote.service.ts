import { api } from '@/lib/api';

export interface Passenger {
  age: number;
}

export interface QuoteRequestDto {
  slug: string;
  departureDate: string;
  returnDate: string;
  passengers: Passenger[];
}

export interface QuoteResponse {
  planId: number;
  planName: string;
  totalPrice: number;
  priceDetails: {
    ageGroup: string;
    pricePerDay: number;
    days: number;
  }[];
}

/**
 * Serviço para gerenciar cotações
 */
export const QuoteService = {
  /**
   * Calcula cotações com base nos dados fornecidos
   * @param data Dados da requisição de cotação
   * @returns Lista de cotações calculadas
   */
  async calculate(data: QuoteRequestDto): Promise<QuoteResponse[]> {
    const response = await api.post('/quotes', data);
    return response.data;
  },
};