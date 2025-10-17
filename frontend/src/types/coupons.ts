/**
 * Tipos relacionados aos cupons de desconto
 */

/**
 * Interface que representa um cupom de desconto
 */
export type DiscountType = 'PERCENTAGE' | 'FIXED';
export interface CouponData {
    id: string;
    code: string;
    description: string;
    discount: number; // Valor do desconto (ex: 20 para 20%, ou 50 para R$50)
    discountType: DiscountType; 
    usageLimit: number;
    usagesLeft: number;
    status: 'ACTIVE' | 'INACTIVE' | string; // Use um literal se tiver apenas ACTIVE/INACTIVE
    front_publishable: boolean;
    userId: string;
    
    // Datas e Timestamps (Representadas como strings ISO)
    createdAt: string;
    updatedAt: string;
    expiresAt: string | null; // Pode ser nulo se não houver expiração
    deleted: boolean;
    deletedAt: string | null; // Null se não foi deletado
}
export interface Coupon {
	id: string;
	code: string;
	discount: number;
	discountType: "PERCENTAGE" | "FIXED";
	expiresAt: string;
	usageLimit: number;
	front_publishable: boolean;
	description?: string;
	status: "ACTIVE" | "INACTIVE" | "REDEEMED" | "EXPIRED";
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
	status?: "ACTIVE" | "INACTIVE" | "REDEEMED" | "EXPIRED";
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
	status?: "ACTIVE" | "INACTIVE" | "REDEEMED" | "EXPIRED";
}
