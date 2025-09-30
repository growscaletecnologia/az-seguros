/**
 * Service para gerenciar FrontSections (Seção "Por que escolher")
 * Integra com os endpoints do backend para CRUD e consulta pública
 */

import api from "@/lib/api";



// Enum para status das seções
export enum FrontSectionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

// Interface para FrontSection
export interface FrontSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  order: number;
  status: FrontSectionStatus;
  createdAt: string;
  updatedAt: string;
}

// Interface para criação de FrontSection
export interface CreateFrontSectionDto {
  title: string;
  description: string;
  icon: string;
  bgColor?: string;
  order?: number;
  status?: FrontSectionStatus;
}

// Interface para atualização de FrontSection
export interface UpdateFrontSectionDto extends Partial<CreateFrontSectionDto> {}

/**
 * Service class para FrontSections
 */
class FrontSectionsService {
  private readonly baseUrl = '/frontsections';

  /**
   * Busca todas as seções ativas (rota pública)
   * Usado na página inicial para exibir os blocos da seção "Por que escolher"
   */
  async getPublicSections(): Promise<FrontSection[]> {
    try {
      const response = await api.get(`${this.baseUrl}/public`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar seções públicas:', error);
      throw error;
    }
  }

  /**
   * Busca todas as seções (admin)
   * Requer autenticação JWT
   */
  async getAll(): Promise<FrontSection[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todas as seções:', error);
      throw error;
    }
  }

  /**
   * Busca uma seção por ID (admin)
   * Requer autenticação JWT
   */
  async getById(id: string): Promise<FrontSection> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar seção ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria uma nova seção (admin)
   * Requer autenticação JWT
   */
  async create(data: CreateFrontSectionDto): Promise<FrontSection> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar seção:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma seção existente (admin)
   * Requer autenticação JWT
   */
  async update(id: string, data: UpdateFrontSectionDto): Promise<FrontSection> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar seção ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove uma seção (admin)
   * Requer autenticação JWT
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar seção ${id}:`, error);
      throw error;
    }
  }

  /**
   * Alterna o status de uma seção (admin)
   * Requer autenticação JWT
   */
  async toggleStatus(id: string): Promise<FrontSection> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao alternar status da seção ${id}:`, error);
      throw error;
    }
  }
}

// Instância singleton do serviço
export const frontSectionsService = new FrontSectionsService();