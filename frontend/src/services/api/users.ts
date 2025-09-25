import { api } from "@/lib/api";

export interface User {
	id: string;
	email: string;
	name: string;
	role: string;
	status: string;
	userRoles?: Array<{
		roleId: number;
		role?: {
			name: string;
			description?: string;
		};
	}>;
	userPermissions?: Array<{
		permissionId: number;
		allow: boolean;
		permission?: {
			resource: string;
			action: string;
			description?: string;
		};
	}>;
}

export interface CreateUserDto {
	email: string;
	name: string;
	password?: string;
	role: string;
	status?: string;
	cpfCnpj?: string;
	phone?: string;
	birthDate?: string;
}

export interface UpdateUserDto {
	name?: string;
	email?: string;
	password?: string;
	status?: string;
	role?: string;
	cpfCnpj?: string;
	phone?: string;
	birthDate?: string;
}

/**
 * Serviço para gerenciamento de usuários
 */
export const usersService = {
	/**
	 * Obtém todos os usuários
	 */
	getAll: async (): Promise<User[]> => {
		const response = await api.get("/users");
		console.log("RESPONSE", response.data);
		return response.data;
	},

	/**
	 * Obtém um usuário pelo ID
	 */
	getById: async (id: string): Promise<User> => {
		const response = await api.get(`/users/${id}`);
		return response.data;
	},

	/**
	 * Cria um novo usuário
	 */
	create: async (user: CreateUserDto): Promise<User> => {
		const response = await api.post("/users", user);
		return response.data;
	},

	/**
	 * Atualiza um usuário existente
	 */
	update: async (id: string, user: UpdateUserDto): Promise<User> => {
		const response = await api.patch(`/users/${id}`, user);
		return response.data;
	},

	/**
	 * Remove um usuário
	 */
	remove: async (id: string): Promise<void> => {
		await api.delete(`/users/${id}`);
	},
};
