import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
