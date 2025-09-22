import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Configuração da URL base da API
 * Em desenvolvimento, aponta para localhost:3001
 * Em produção, usa a variável de ambiente ou um valor padrão
 */
const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL || 'https://api.azseguros.com.br/api'
  : 'http://localhost:5000';

/**
 * Obtém o token de autenticação do localStorage (apenas no cliente)
 */
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Salva o token de autenticação no localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Remove o token de autenticação do localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

/**
 * Cria uma instância do Axios com configurações padrão
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor para adicionar o token de autenticação em todas as requisições
 */
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = getAuthToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Interceptor para tratamento de respostas
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Tratamento de erro 401 (Não autorizado)
    if (error.response?.status === 401) {
      // Remove o token inválido
      removeAuthToken();
      
      // Redireciona para a página de login se estiver no cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/entrar';
      }
    }
    
    // Tratamento de erro 403 (Proibido)
    if (error.response?.status === 403) {
      console.error('Acesso negado. Você não tem permissão para acessar este recurso.');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Funções auxiliares para requisições HTTP
 */
export const apiService = {
  /**
   * Realiza uma requisição GET
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },
  
  /**
   * Realiza uma requisição POST
   */
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },
  
  /**
   * Realiza uma requisição PUT
   */
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },
  
  /**
   * Realiza uma requisição PATCH
   */
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },
  
  /**
   * Realiza uma requisição DELETE
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  }
};

export default api;