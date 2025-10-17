/**
 * Utilitários para geração de slugs
 */

/**
 * Gera um slug a partir de um texto, removendo acentos, espaços e caracteres especiais
 * @param text - Texto para converter em slug
 * @returns Slug formatado
 */
export function generateSlug(text: string): string {
	if (!text) return "";

	return (
		text
			.toLowerCase()
			.trim()
			// Remove acentos e caracteres especiais
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			// Remove caracteres que não são letras, números ou hífens
			.replace(/[^a-z0-9\s-]/g, "")
			// Substitui espaços e múltiplos hífens por um único hífen
			.replace(/[\s-]+/g, "-")
			// Remove hífens do início e fim
			.replace(/^-+|-+$/g, "")
	);
}

/**
 * Valida se um slug está no formato correto
 * @param slug - Slug para validar
 * @returns true se o slug é válido
 */
export function isValidSlug(slug: string): boolean {
	if (!slug) return false;

	// Slug deve conter apenas letras minúsculas, números e hífens
	// Não pode começar ou terminar com hífen
	// Não pode ter hífens consecutivos
	const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	return slugRegex.test(slug);
}

/**
 * Sanitiza um slug para garantir que está no formato correto
 * @param slug - Slug para sanitizar
 * @returns Slug sanitizado
 */
export function sanitizeSlug(slug: string): string {
	return generateSlug(slug);
}
