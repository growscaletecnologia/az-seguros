/**
 * Tipos relacionados aos cupons de desconto
 */

/**
 * Interface que representa um cupom de desconto
 */
export interface Coupon {
	id: string;
	code: string;
	discount: number;
	discountType: "PERCENTAGE" | "FIXED";
	expiresAt: string;
	usageLimit: number;
	front_publishable: boolean;
	description?: string;
	status: "ACTIVE" | "INACTIVE" | "EXPIRED";
	deleted: boolean;
	deletedAt?: string;
	createdAt: string;
	updatedAt: string;
	userId?: string;
	usages?: CouponUsage[];
}

/**
 * Interface que representa o uso de um cupom
 */
export interface CouponUsage {
	id: string;
	coupomId: string;
	userId: string;
	orderId?: string;
	usedAt: string;
}

/**
 * DTO para criação de um novo cupom
 */
export interface CreateCouponDto {
	code: string;
	discount: number;
	discountType: "PERCENTAGE" | "FIXED";
	expiresAt: string;
	usageLimit: number;
	front_publishable: boolean;
	description?: string;
	userId?: string;
}

/**
 * DTO para atualização de um cupom existente
 */
export interface UpdateCouponDto {
	code?: string;
	discount?: number;
	discountType?: "PERCENTAGE" | "FIXED";
	expiresAt?: string;
	usageLimit?: number;
	front_publishable?: boolean;
	description?: string;
	status?: "ACTIVE" | "INACTIVE";
}
