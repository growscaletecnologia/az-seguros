import { api } from "@/lib/api";

/**
 * Interface que representa um Benefício
 */
export interface Benefit {
    id: string;
    name: string;
    slug: string;
    code:number;
    description: string;
    categoryId: string; // ID da Categoria à qual o benefício pertence
    createdAt: string;
    updatedAt: string;
}

/**
 * DTO para criação de um novo Benefício
 */
export interface CreateBenefitDTO {
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
}

/**
 * DTO para atualização de um Benefício existente
 */
export interface UpdateBenefitDTO extends Partial<CreateBenefitDTO> {
    id: string;
}

/**
 * DTO para atribuição de benefícios (Novo, baseado no `assignBenefits` do Controller)
 * Ajuste esta interface conforme o seu `AssignBenefitsDto` do backend.
 */
export interface AssignBenefitsDTO {
    userId: string; // Exemplo de campo, ajuste conforme o backend
    benefitIds: string[];
}

/**
 * Serviço para gerenciar Benefícios
 */
export const benefitsService = {
    /**
     * Busca todos os benefícios sem paginação (Mapeado para GET /benefits - findAll)
     */
    async getAll(): Promise<Benefit[]> {
        const { data } = await api.get("/benefits");
        return data || [];
    },

    /**
     * Busca um benefício por ID (Mapeado para GET /benefits/:id - findOne)
     * Assumindo que o ID é string no frontend e o backend lida com a conversão se necessário.
     */
    async getById(id: string): Promise<Benefit> {
        const { data } = await api.get(`/benefits/${id}`);
        return data;
    },

    /**
     * Cria um novo benefício (Mapeado para POST /benefits - create)
     */
    async create(benefit: CreateBenefitDTO): Promise<Benefit> {
        const { data } = await api.post("/benefits", benefit);
        return data;
    },

    /**
     * Cria múltiplos benefícios (Novo, mapeado para POST /benefits/bulk - createMany)
     */
    async createMany(benefits: CreateBenefitDTO[]): Promise<any> {
        const { data } = await api.post("/benefits/bulk", benefits);
        return data;
    },

    /**
     * Atribui benefícios a um usuário/entidade (Novo, mapeado para POST /benefits/assign - assignBenefits)
     */
    async assignBenefits(assignment: AssignBenefitsDTO): Promise<any> {
        const { data } = await api.post("/benefits/assign", assignment);
        return data;
    },

    /**
     * Atualiza um benefício (Mapeado para PATCH /benefits/:id - update)
     * **CORRIGIDO** para usar PATCH e a rota mais limpa.
     */
    async update(id: string, benefit: Partial<CreateBenefitDTO>): Promise<Benefit> {
        const { data } = await api.patch(`/benefits/${id}`, benefit);
        return data;
    },

    /**
     * Remove um benefício (Mapeado para DELETE /benefits/:id - remove)
     */
    async remove(id: string): Promise<void> {
        await api.delete(`/benefits/${id}`);
    },

    // O método getAllPaginated foi removido porque não há um endpoint explícito
    // no BenefitsController que ele possa mapear, apenas o findAll().
};

export default benefitsService;
