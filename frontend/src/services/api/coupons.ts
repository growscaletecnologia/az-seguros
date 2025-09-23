import { api } from '@/lib/api'
import { Coupon, CouponUsage, CreateCouponDto, UpdateCouponDto } from '@/types/coupons'

/**
 * Serviço para gerenciamento de cupons de desconto
 */
export const couponsService = {
  /**
   * Busca todos os cupons
   * @returns Lista de cupons
   */
  async getAll(): Promise<Coupon[]> {
    const response = await api.get('/coupons')
    return response.data
  },

  /**
   * Busca cupons publicáveis na tela inicial
   * @returns Lista de cupons publicáveis
   */
  async getPublicCoupons(): Promise<Coupon[]> {
    const response = await api.get('/coupons/public')
    return response.data
  },

  /**
   * Busca um cupom pelo ID
   * @param id ID do cupom
   * @returns Dados do cupom
   */
  async getById(id: string): Promise<Coupon> {
    const response = await api.get(`/coupons/${id}`)
    return response.data
  },

  /**
   * Busca um cupom pelo código
   * @param code Código do cupom
   * @returns Dados do cupom
   */
  async getByCode(code: string): Promise<Coupon> {
    const response = await api.get(`/coupons/code/${code}`)
    return response.data
  },

  /**
   * Cria um novo cupom
   * @param data Dados do cupom
   * @returns Cupom criado
   */
  async create(data: CreateCouponDto): Promise<Coupon> {
    const response = await api.post('/coupons', data)
    return response.data
  },

  /**
   * Atualiza um cupom existente
   * @param id ID do cupom
   * @param data Dados para atualização
   * @returns Cupom atualizado
   */
  async update(id: string, data: UpdateCouponDto): Promise<Coupon> {
    const response = await api.patch(`/coupons/${id}`, data)
    return response.data
  },

  /**
   * Remove um cupom (soft delete)
   * @param id ID do cupom
   * @returns Resultado da operação
   */
  async remove(id: string): Promise<any> {
    const response = await api.delete(`/coupons/${id}`)
    return response.data
  },

  /**
   * Registra o uso de um cupom
   * @param id ID do cupom
   * @param userId ID do usuário
   * @param orderId ID do pedido (opcional)
   * @returns Resultado da operação
   */
  async registerUsage(id: string, userId: string, orderId?: string): Promise<any> {
    const response = await api.post(`/coupons/${id}/use`, { userId, orderId })
    return response.data
  }
}