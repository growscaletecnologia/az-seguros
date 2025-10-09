import { api } from '@/lib/api';

export interface Plan {
  id: number;
  name: string;
  price: number;
  destinies: string[];
  ageGroups: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FilterPlansDto {
  slug?: string;
  age?: number;
  page?: number;
  perPage?: number;
}

/**
 * Serviço para gerenciar planos de seguradoras
 */
export const PlanService = {
  /**
   * Lista todos os planos com paginação
   * @param page Página atual
   * @param perPage Número de itens por página
   * @returns Lista de planos paginada
   */
  async getAll(page = 1, perPage = 10): Promise<Plan[]> {
    const response = await api.get(`/insurer/plans?page=${page}&perPage=${perPage}`);
    return response.data;
  },

  /**
   * Filtra planos por destino e/ou idade
   * @param filters Filtros de destino e idade
   * @returns Lista de planos filtrada
   */
  async filter(filters: FilterPlansDto): Promise<Plan[]> {
    const { slug, age, page = 1, perPage = 10 } = filters;
    const response = await api.get(
      `/insurer/plans/filter?slug=${slug || ''}&age=${age || ''}&page=${page}&perPage=${perPage}`
    );
    return response.data;
  },

  /**
   * Busca um plano específico pelo ID
   * @param id ID do plano
   * @returns Detalhes do plano
   */
  async getById(id: number): Promise<Plan> {
    const response = await api.get(`/insurer/plans/${id}`);
    return response.data;
  },

  /**
   * Deleta um plano pelo ID
   * @param id ID do plano
   * @returns Confirmação da exclusão
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/insurer/plans/${id}`);
  },
};