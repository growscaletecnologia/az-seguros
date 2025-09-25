/**
 * Tipos para o sistema de controle de acesso baseado em papéis (RBAC)
 */

export type Action = "create" | "read" | "update" | "delete" | "assign";

export interface Permission {
	id: number;
	resource: string;
	action: Action;
	description: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface Role {
	id: number;
	name: string;
	description?: string;
	isSystem: boolean;
	permissions?: RolePermission[];
	createdAt?: string;
	updatedAt?: string;
}

export interface RolePermission {
	roleId: number;
	permissionId: number;
	allow: boolean;
	permission?: Permission;
}

export interface UserRole {
	userId: string;
	roleId: number;
	role?: Role;
}

export interface UserPermission {
	userId: string;
	permissionId: number;
	allow: boolean;
	permission?: Permission;
}

export interface EffectivePermission {
	resource: string;
	action: Action;
	allow: boolean;
	source: "direct" | "role";
}

export interface RequiredPermission {
	resource: string;
	action: Action;
}

export interface AssignRolesDto {
	roleIds: number[];
}

export interface AssignPermissionsDto {
	permissionIds: number[];
	allow?: boolean;
}

export interface InviteUserDto {
	email: string;
	name: string;
	roleIds: number[];
	message?: string;
}
