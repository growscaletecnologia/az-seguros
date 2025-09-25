import { api } from '@/lib/api';

export interface UserFunction {
  id: string;
  name: string;
  displayName: string;
}

export interface UserAction {
  functionId: string;
  actions: string; // String de 4 caracteres representando permissões: Ver, Criar, Editar, Excluir (ex: "1010")
}

export interface Profile {
  id: string;
  name: string;
  userActions: UserAction[];
  created_at: string;
  updated_at: string;
}

export interface ProfilesFilter {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProfilesResponse {
  profiles: Profile[];
  total: number;
  nextPage: boolean;
}

export interface CreateProfileDTO {
  name: string;
  userActions: UserAction[];
}

export interface UpdateProfileDTO {
  name?: string;
  userActions?: UserAction[];
}

/**
 * Serviço para gerenciar perfis de acesso
 */
export const profilesService = {
  /**
   * Busca todos os perfis com filtros opcionais
   * @param filter Filtros para busca de perfis
   * @returns Resposta com perfis, total e indicador de próxima página
   */
  async getProfiles(filter: ProfilesFilter = {}): Promise<ProfilesResponse> {
    const { data } = await api.get('/profiles', { params: filter });
    return data;
  },

  /**
   * Busca um perfil pelo ID
   * @param id ID do perfil
   * @returns Perfil encontrado
   */
  async getProfileById(id: string): Promise<Profile> {
    const { data } = await api.get(`/profiles/${id}`);
    return data;
  },

  /**
   * Cria um novo perfil
   * @param profile Dados do perfil a ser criado
   * @returns Perfil criado
   */
  async createProfile(profile: CreateProfileDTO): Promise<Profile> {
    const { data } = await api.post('/profiles', profile);
    return data;
  },

  /**
   * Atualiza um perfil existente
   * @param id ID do perfil
   * @param profile Dados do perfil a ser atualizado
   * @returns Perfil atualizado
   */
  async updateProfile(id: string, profile: UpdateProfileDTO): Promise<Profile> {
    const { data } = await api.put(`/profiles/${id}`, profile);
    return data;
  },

  /**
   * Exclui um perfil
   * @param id ID do perfil
   * @returns Void
   */
  async deleteProfile(id: string): Promise<void> {
    await api.delete(`/profiles/${id}`);
  },

  /**
   * Busca todas as funções de usuário disponíveis
   * @returns Lista de funções de usuário
   */
  async getUserFunctions(): Promise<UserFunction[]> {
    const { data } = await api.get('/profiles/functions');
    return data;
  }
};