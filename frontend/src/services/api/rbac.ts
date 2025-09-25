import { api } from "@/lib/api";
import type {
	AssignPermissionsDto,
	AssignRolesDto,
	InviteUserDto,
	Permission,
	Role,
} from "@/types/rbac";

/**
 * Serviço para gerenciamento de papéis (roles)
 */
export const rolesService = {
	/**
	 * Obtém todos os papéis
	 */
	getAll: async (): Promise<Role[]> => {
		const response = await api.get("/roles");
		return response.data;
	},

	/**
	 * Obtém um papel pelo ID
	 */
	getById: async (id: number): Promise<Role> => {
		const response = await api.get(`/roles/${id}`);
		return response.data;
	},

	/**
	 * Cria um novo papel
	 */
	create: async (
		role: Omit<Role, "id" | "createdAt" | "updatedAt">,
	): Promise<Role> => {
		const response = await api.post("/roles", role);
		return response.data;
	},

	/**
	 * Atualiza um papel existente
	 */
	update: async (id: number, role: Partial<Role>): Promise<Role> => {
		const response = await api.patch(`/roles/${id}`, role);
		return response.data;
	},

	/**
	 * Remove um papel
	 */
	remove: async (id: number): Promise<void> => {
		await api.delete(`/roles/${id}`);
	},

	/**
	 * Atribui permissões a um papel
	 */
	assignPermissions: async (
		roleId: number,
		assignPermissionsDto: AssignPermissionsDto,
	): Promise<Role> => {
		const response = await api.post(
			`/roles/${roleId}/permissions`,
			assignPermissionsDto,
		);
		return response.data;
	},

	/**
	 * Remove permissões de um papel
	 */
	removePermissions: async (
		roleId: number,
		permissionIds: number[],
	): Promise<Role> => {
		const response = await api.delete(`/roles/${roleId}/permissions`, {
			data: permissionIds,
		});
		return response.data;
	},

	/**
	 * Atualiza permissões granulares de um papel
	 */
	updateGranularPermissions: async (
		roleId: number,
		data: any,
	): Promise<Role> => {
		const response = await api.post(
			`/roles/${roleId}/granular-permissions`,
			data,
		);
		return response.data;
	},
};

/**
 * Serviço para gerenciamento de permissões
 */
export const permissionsService = {
	/**
	 * Obtém todas as permissões
	 */
	getAll: async (): Promise<Permission[]> => {
		const response = await api.get("/permissions");
		return response.data;
	},

	/**
	 * Obtém uma permissão pelo ID
	 */
	getById: async (id: number): Promise<Permission> => {
		const response = await api.get(`/permissions/${id}`);
		return response.data;
	},

	/**
	 * Cria uma nova permissão
	 */
	create: async (
		permission: Omit<Permission, "id" | "createdAt" | "updatedAt">,
	): Promise<Permission> => {
		const response = await api.post("/permissions", permission);
		return response.data;
	},

	/**
	 * Atualiza uma permissão existente
	 */
	update: async (
		id: number,
		permission: Partial<Permission>,
	): Promise<Permission> => {
		const response = await api.patch(`/permissions/${id}`, permission);
		return response.data;
	},

	/**
	 * Remove uma permissão
	 */
	remove: async (id: number): Promise<void> => {
		await api.delete(`/permissions/${id}`);
	},
};

/**
 * Serviço para gerenciamento de usuários relacionado ao RBAC
 */
export const userRbacService = {
	/**
	 * Atribui papéis a um usuário
	 */
	assignRoles: async (
		userId: string,
		assignRolesDto: AssignRolesDto,
	): Promise<any> => {
		const response = await api.post(`/users/${userId}/roles`, assignRolesDto);
		return response.data;
	},

	/**
	 * Remove papéis de um usuário
	 */
	removeRoles: async (userId: string, roleIds: number[]): Promise<any> => {
		const response = await api.delete(`/users/${userId}/roles`, {
			data: roleIds,
		});
		return response.data;
	},

	/**
	 * Atribui permissões diretas a um usuário
	 */
	assignPermissions: async (
		userId: string,
		assignPermissionsDto: AssignPermissionsDto,
	): Promise<any> => {
		const response = await api.post(
			`/users/${userId}/permissions`,
			assignPermissionsDto,
		);
		return response.data;
	},

	/**
	 * Remove permissões diretas de um usuário
	 */
	removePermissions: async (
		userId: string,
		permissionIds: number[],
	): Promise<any> => {
		const response = await api.delete(`/users/${userId}/permissions`, {
			data: permissionIds,
		});
		return response.data;
	},

	/**
	 * Convida um novo usuário
	 */
	inviteUser: async (inviteUserDto: InviteUserDto): Promise<any> => {
		const response = await api.post("/invitations", inviteUserDto);
		return response.data;
	},

	/**
	 * Reenvia um convite para um usuário
	 */
	resendInvitation: async (userId: string): Promise<any> => {
		const response = await api.post(`/invitations/resend/${userId}`);
		return response.data;
	},
};
