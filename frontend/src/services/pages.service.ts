import { api } from "@/lib/api";
import type { Category } from "./categories.service";

export interface PageMetadata {
	title: string;
	description: string;
	keywords: string;
}

export interface PageUser {
	id: string;
	name: string;
	email: string;
}

export interface Page {
	id: string;
	title: string;
	slug: string;
	content: string;
	description?: string;
	resume?: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	userId: string;
	metadata: PageMetadata;
	createdAt: string;
	updatedAt: string;
	updatedBy: string | null;
	publishedAt?: string;
	user: PageUser;
	categories: Category[];
}

export interface PagesResponse {
	pages: Page[];
	total: number;
	nextPage: number | null;
}

export interface CreatePageDTO {
	title: string;
	slug?: string;
	content: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	metadata?: {
		title?: string;
		description?: string;
		keywords?: string;
	};
}

export interface UpdatePageDTO extends Partial<CreatePageDTO> {
	id: string;
}

export interface PagesFilter {
	status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	page?: number;
	limit?: number;
	search?: string;
}

/**
 * Serviço para gerenciamento de páginas
 */
export const pagesService = {
	/**
	 * Busca todas as páginas com filtros opcionais
	 */
	async getPages(filters: PagesFilter = {}): Promise<PagesResponse> {
		const { data } = await api.get("/pages", { params: filters });
		return data;
	},

	/**
	 * Busca uma página pelo ID
	 */
	async getPageById(id: string): Promise<Page> {
		const { data } = await api.get(`/pages/${id}`);
		return data;
	},

	/**
	 * Busca uma página pelo slug
	 */
	async getPageBySlug(slug: string): Promise<Page> {
		const { data } = await api.get(`/pages/slug/${slug}`);
		return data;
	},

	/**
	 * Cria uma nova página
	 */
	async createPage(page: CreatePageDTO): Promise<Page> {
		const { data } = await api.post("/pages", page);
		return data;
	},

	/**
	 * Atualiza uma página existente
	 */
	async updatePage(page: UpdatePageDTO): Promise<Page> {
		const { data } = await api.patch(`/pages/${page.id}`, page);
		return data;
	},

	/**
	 * Exclui uma página
	 */
	async deletePage(id: string): Promise<void> {
		await api.delete(`/pages/${id}`);
	},
};
