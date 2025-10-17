import { api } from "@/lib/api";
import { PlanInfo } from "@/types/types";

export interface Plan {
	id: number;
	externalId: number;
	additionalId: number;
	ref: string;
	slug: string;
	is: string; // valor numérico como string
	isShow: string; // ex: "250000,00"
	name: string;
	multitrip: boolean;
	securityIntegrationId: string;
	createdAt: string;
	updatedAt: string;

	destinies: PlanDestiny[];
	coverages: Coverage[];
	securityIntegration: SecurityIntegration;
	highlight?: boolean;
}

export interface NormalizedPlan {
	id: number;
	name: string;
	price: number; // já com markup
	destiny: string; // destino selecionado
	ageGroup: string; // ex: "0 a 64"
	insurerName: string;
	markUp: number;
	coverageValue: number; // ex: 250000
	benefits: string[]; // nomes das coberturas
	createdAt: string;
	updatedAt: string;
}

export interface PlanDestiny {
	id: number;
	insurerPlanId: number;
	destinyId: number | null;
	name: string;
	slug: string;
	displayOrder: number;
	destinyCode: string;
	crmBonusValue: number;
	createdAt: string;
	updatedAt: string;
	ageGroups: AgeGroup[];
}

export interface AgeGroup {
	id: number;
	insurerPlanDestinyId: number;
	start: number;
	end: number;
	price: string; // backend envia como string
	priceIof: string;
	createdAt: string;
	updatedAt: string;
}

export interface Coverage {
	id: number;
	title: string;
	name: string;
	slug: string;
	highlight?: string;
	content?: string;
	displayOrder?: number;
	createdAt: string;
	updatedAt: string;
}

export interface SecurityIntegration {
	insurerName: string;
	insurerCode: string;
	markUp: number;
	ativa: boolean;
}

export interface FilterPlansDto {
	slug?: string;
	age?: number;
	page?: number;
	perPage?: number;
}

/**
 * Serviço para gerenciar planos de seguradoras
 */
export const PlanService = {
	/**
	 * Lista todos os planos com paginação
	 * @param page Página atual
	 * @param perPage Número de itens por página
	 * @returns Lista de planos paginada
	 */
	async getAll(page = 1, perPage = 10): Promise<Plan[]> {
		const response = await api.get(
			`/insurer/plans?page=${page}&perPage=${perPage}`,
		);
		return response.data;
	},

	/**
	 * Filtra planos por destino e/ou idade
	 * @param filters Filtros de destino e idade
	 * @returns Lista de planos filtrada
	 */
	async filter(filters: FilterPlansDto): Promise<Plan[]> {
		const { slug, age, page = 1, perPage = 10 } = filters;
		const response = await api.get(
			`/insurer/plans/filter?slug=${slug || ""}&age=${age || ""}&page=${page}&perPage=${perPage}`,
		);
		return response.data.data;
	},

	/**
	 * Busca um plano específico pelo ID
	 * @param id ID do plano
	 * @returns Detalhes do plano
	 */
	async getById(id: number): Promise<Plan> {
		const response = await api.get(`/insurer/plans/${id}`);
		return response.data;
	},


	  /**
		 * Busca informações detalhadas do plano
		 * (usa o endpoint `/insurer/plans/product/info`)
		 */
		async getInfo(params: {
			destination: string;
			departure: string;
			arrival: string;
			id: number;
		}): Promise<PlanInfo> {
			const { destination, departure, arrival, id } = params;
			const response = await api.get(`/insurer/plans/product/info`, {
			params: { destination, departure, arrival, id },
			});
			return response.data;
		},
	/**
	 * Deleta um plano pelo ID
	 * @param id ID do plano
	 * @returns Confirmação da exclusão
	 */
	async delete(id: number): Promise<void> {
		await api.delete(`/insurer/plans/${id}`);
	},
};
