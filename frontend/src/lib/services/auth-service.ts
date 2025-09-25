/**
 * Serviço de autenticação para integração com o backend
 * Gerencia login, logout e armazenamento de tokens
 */

import { z } from "zod";

// Tipos para autenticação
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
	};
}

// Schema de validação para login
export const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

// Classe de serviço de autenticação
export class AuthService {
	private static API_URL =
		process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
	private static TOKEN_KEY = "auth_token";
	private static USER_KEY = "auth_user";

	/**
	 * Realiza login com email e senha
	 * @param credentials Credenciais de login (email e senha)
	 * @returns Resposta de autenticação com tokens e dados do usuário
	 */
	static async login(credentials: LoginCredentials): Promise<AuthResponse> {
		try {
			const response = await fetch(`${this.API_URL}/auth/login/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Falha na autenticação");
			}

			const data = await response.json();

			// Armazena tokens e dados do usuário
			this.setAuthData(data);

			return data;
		} catch (error) {
			console.error("Erro de login:", error);
			throw error;
		}
	}

	/**
	 * Armazena dados de autenticação no localStorage
	 * @param data Dados de autenticação
	 */
	private static setAuthData(data: AuthResponse): void {
		if (typeof window !== "undefined") {
			localStorage.setItem(this.TOKEN_KEY, data.accessToken);
			localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
		}
	}

	/**
	 * Obtém o token de acesso armazenado
	 * @returns Token de acesso ou null se não existir
	 */
	static getToken(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem(this.TOKEN_KEY);
		}
		return null;
	}

	/**
	 * Obtém os dados do usuário armazenados
	 * @returns Dados do usuário ou null se não existir
	 */
	static getUser(): AuthResponse["user"] | null {
		if (typeof window !== "undefined") {
			const userData = localStorage.getItem(this.USER_KEY);
			return userData ? JSON.parse(userData) : null;
		}
		return null;
	}

	/**
	 * Verifica se o usuário está autenticado
	 * @returns true se autenticado, false caso contrário
	 */
	static isAuthenticated(): boolean {
		return !!this.getToken();
	}

	/**
	 * Realiza logout removendo dados de autenticação
	 */
	static logout(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.TOKEN_KEY);
			localStorage.removeItem(this.USER_KEY);
		}
	}
}

export default AuthService;
