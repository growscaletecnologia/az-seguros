import { api } from '@/lib/api';

export interface SecurityIntegration {
  id?: string;
  securityName: string;
  grantType: string;
  clientId: number;
  clientSecret: string;
  username: string;
  password: string;
  scope?: string;
  ativa?: boolean;
  markUp?: number | null;
  refreshToken?: string;
  expiresIn?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SecurityIntegrationResponse {
  id: string;
  securityName: string;
  grantType: string;
  clientId: number;
  clientSecret: string;
  username: string;
  password: string;
  scope?: string;
  ativa: boolean;
  markUp?: number;
  refreshToken?: string;
  expiresIn?: number;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = '/security-integrations';

/**
 * Busca todas as integrações de segurança
 * @returns Lista de integrações de segurança
 */
export async function getAllSecurityIntegrations(): Promise<SecurityIntegrationResponse[]> {
  const response = await api.get<SecurityIntegrationResponse[]>(BASE_URL);
  return response.data;
}

/**
 * Busca uma integração de segurança pelo ID
 * @param id ID da integração
 * @returns Dados da integração de segurança
 */
export async function getSecurityIntegrationById(id: string): Promise<SecurityIntegrationResponse> {
  const response = await api.get<SecurityIntegrationResponse>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Cria uma nova integração de segurança
 * @param data Dados da nova integração
 * @returns Integração criada
 */
export async function createSecurityIntegration(data: SecurityIntegration): Promise<SecurityIntegrationResponse> {
  const response = await api.post<SecurityIntegrationResponse>(BASE_URL, data);
  return response.data;
}

/**
 * Atualiza uma integração de segurança existente
 * @param id ID da integração
 * @param data Dados a serem atualizados
 * @returns Integração atualizada
 */
export async function updateSecurityIntegration(id: string, data: Partial<SecurityIntegration>): Promise<SecurityIntegrationResponse> {
  const response = await api.patch<SecurityIntegrationResponse>(`${BASE_URL}/${id}`, data);
  return response.data;
}

/**
 * Remove uma integração de segurança
 * @param id ID da integração
 * @returns Resultado da operação
 */
export async function deleteSecurityIntegration(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}