import { api } from "@/lib/api";

export interface Tag {
	id: string;
	name: string;
	slug: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTagDTO {
	name: string;
	slug: string;
	description?: string;
}

export interface UpdateTagDTO extends Partial<CreateTagDTO> {
	id: string;
}

/**
 * Serviço para gerenciar tags
 */
export const tagsService = {
	/**
	 * Busca todas as tags sem paginação
	 */
	async getAll(): Promise<Tag[]> {
		const { data } = await api.get("/tags/all-no-limit");
		return data || [];
	},

	/**
	 * Busca tags com paginação
	 */
	async getAllPaginated(page = 1, limit = 10) {
		const { data } = await api.get(`/tags/all?page=${page}&limit=${limit}`);
		return data;
	},

	/**
	 * Busca uma tag por ID
	 */
	async getById(id: string): Promise<Tag> {
		const { data } = await api.get(`/tags/get/${id}`);
		return data;
	},

	/**
	 * Cria uma nova tag
	 */
	async create(tag: CreateTagDTO): Promise<Tag> {
		const { data } = await api.post("/tags/create", tag);
		return data;
	},

	/**
	 * Atualiza uma tag
	 */
	async update(id: string, tag: UpdateTagDTO): Promise<Tag> {
		const { data } = await api.put(`/tags/update/${id}`, tag);
		return data;
	},

	/**
	 * Remove uma tag
	 */
	async remove(id: string): Promise<void> {
		await api.delete(`/tags/remove/${id}`);
	},
};

export default tagsService;
