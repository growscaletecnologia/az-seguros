import { api } from '@/lib/api';

export interface Avaliation {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location?: string;
  avatar?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvaliationDto {
  name: string;
  rating: number;
  comment: string;
  location?: string;
  avatar?: string;
  active?: boolean;
}

export interface UpdateAvaliationDto extends Partial<CreateAvaliationDto> {}

/**
 * Serviço para gerenciar avaliações de usuários
 */
export const AvaliationService = {
  /**
   * Busca todas as avaliações
   * @param activeOnly Se true, retorna apenas avaliações ativas
   * @returns Lista de avaliações
   */
  async getAll(activeOnly = false): Promise<Avaliation[]> {
    const response = await api.get(`/avaliations?activeOnly=${activeOnly}`);
    return response.data;
  },

  /**
   * Busca uma avaliação pelo ID
   * @param id ID da avaliação
   * @returns A avaliação encontrada
   */
  async getById(id: string): Promise<Avaliation> {
    const response = await api.get(`/avaliations/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova avaliação
   * @param data Dados da avaliação
   * @returns A avaliação criada
   */
  async create(data: CreateAvaliationDto): Promise<Avaliation> {
    const response = await api.post('/avaliations', data);
    return response.data;
  },

  /**
   * Atualiza uma avaliação existente
   * @param id ID da avaliação
   * @param data Dados para atualização
   * @returns A avaliação atualizada
   */
  async update(id: string, data: UpdateAvaliationDto): Promise<Avaliation> {
    const response = await api.patch(`/avaliations/${id}`, data);
    return response.data;
  },

  /**
   * Remove uma avaliação
   * @param id ID da avaliação
   * @returns A avaliação removida
   */
  async delete(id: string): Promise<Avaliation> {
    const response = await api.delete(`/avaliations/${id}`);
    return response.data;
  },

  /**
   * Alterna o status de ativação de uma avaliação
   * @param id ID da avaliação
   * @returns A avaliação com status atualizado
   */
  async toggleActive(id: string): Promise<Avaliation> {
    const response = await api.patch(`/avaliations/${id}/toggle-active`);
    return response.data;
  }
};