import { api } from '@/lib/api'

export type SystemPageType = 'TERMS' | 'POLICIES' | 'FAQ' | 'HELP' | 'ABOUT' | 'CONTACT'
export type SystemPageStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'

export interface SystemPage {
  id: string
  title: string
  slug: string
  content: string
  type: SystemPageType
  status: SystemPageStatus
  updatedBy?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CreateSystemPageDto {
  title: string
  slug: string
  content: string
  type: SystemPageType
  status?: SystemPageStatus
}

export interface UpdateSystemPageDto {
  title?: string
  slug?: string
  content?: string
  type?: SystemPageType
  status?: SystemPageStatus
}

export interface SystemPagesResponse {
  systemPages: SystemPage[]
  nextPage: number | null
  total: number
}

/**
 * Serviço para gerenciar páginas do sistema
 */
export const SystemPagesService = {
  /**
   * Busca todas as páginas do sistema
   */
  async getAll(page = 1, limit = 10): Promise<SystemPagesResponse> {
    const response = await api.get(`/system-pages?page=${page}&limit=${limit}`)
    return response.data
  },

  /**
   * Busca todas as páginas do sistema por status
   */
  async getAllByStatus(status: SystemPageStatus, page = 1, limit = 10): Promise<SystemPagesResponse> {
    const response = await api.get(`/system-pages/status/${status}?page=${page}&limit=${limit}`)
    return response.data
  },

  /**
   * Busca uma página do sistema pelo ID
   */
  async getById(id: string): Promise<SystemPage> {
    const response = await api.get(`/system-pages/${id}`)
    return response.data
  },

  /**
   * Busca uma página do sistema pelo slug
   */
  async getBySlug(slug: string): Promise<SystemPage> {
    const response = await api.get(`/system-pages/slug/${slug}`)
    return response.data
  },

  /**
   * Busca uma página do sistema pelo tipo
   */
  async getByType(type: SystemPageType): Promise<SystemPage> {
    const response = await api.get(`/system-pages/type/${type}`)
    return response.data
  },

  /**
   * Cria uma nova página do sistema
   */
  async create(data: CreateSystemPageDto): Promise<SystemPage> {
    const response = await api.post('/system-pages', data)
    return response.data
  },

  /**
   * Atualiza uma página do sistema existente
   */
  async update(id: string, data: UpdateSystemPageDto): Promise<SystemPage> {
    const response = await api.put(`/system-pages/${id}`, data)
    return response.data
  },

  /**
   * Remove uma página do sistema
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/system-pages/${id}`)
  }
}