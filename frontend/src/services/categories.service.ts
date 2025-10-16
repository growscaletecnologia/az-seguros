import { api } from "@/lib/api";

export interface Category {
	id: string;
	name: string;
	slug: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryDTO {
	name: string;
	slug: string;
	description?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
	id: string;
}

/**
 * Serviço para gerenciar categorias
 */
export const categoriesService = {
	/**
	 * Busca todas as categorias sem paginação
	 */
	async getAll(): Promise<Category[]> {
		const { data } = await api.get("/categories");
		return data || [];
	},

	/**
	 * Busca categorias com paginação
	 */
	async getAllPaginated(page = 1, limit = 10) {
		const { data } = await api.get(
			`/categories/all?page=${page}&limit=${limit}`,
		);
		return data;
	},

	/**
	 * Busca uma categoria por ID
	 */
	async getById(id: string): Promise<Category> {
		const { data } = await api.get(`/categories/get/${id}`);
		return data;
	},

	/**
	 * Cria uma nova categoria
	 */
	async create(category: CreateCategoryDTO): Promise<Category> {
		const { data } = await api.post("/categories/create", category);
		return data;
	},

	/**
	 * Atualiza uma categoria
	 */
	async update(id: string, category: UpdateCategoryDTO): Promise<Category> {
		const { data } = await api.put(`/categories/update/${id}`, category);
		return data;
	},

	/**
	 * Remove uma categoria
	 */
	async remove(id: string): Promise<void> {
		await api.delete(`/categories/remove/${id}`);
	},
};

export default categoriesService;
