import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formata uma data para o formato brasileiro (dd/MM/yyyy)
 * @param dateString String de data para formatar
 * @returns Data formatada no padrão brasileiro
 */
export function formatDate(dateString: string) {
	const date = new Date(dateString);
	return format(date, "dd/MM/yyyy", { locale: ptBR });
}


export const formatPrice = (price: number) =>
			price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
