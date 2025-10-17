import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Avaliation } from "@/services/avaliation.service";
import { StarIcon } from "lucide-react";
import React from "react";

interface AvaliacaoCardProps {
	avaliacao: Avaliation;
}

/**
 * Componente que exibe um card de avaliação de usuário
 * com truncamento de texto e dimensões fixas
 */
export function AvaliacaoCard({ avaliacao }: AvaliacaoCardProps) {
	// Função para gerar as estrelas com base na avaliação
	const renderStars = (rating: number) => {
		return Array(5)
			.fill(0)
			.map((_, i) => (
				<StarIcon
					key={i}
					className={cn(
						"h-5 w-5",
						i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
					)}
				/>
			));
	};

	// Função para gerar as iniciais do avatar se não houver URL
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	// Função para truncar texto com limite de 100 caracteres
	const truncateText = (text: string, limit = 100) => {
		if (text.length <= limit) return text;
		return text.slice(0, limit) + "...";
	};

	return (
		<Card className="w-full max-w-[350px] bg-white shadow-sm hover:shadow-md transition-shadow">
			<CardContent className="p-3 bg-transparent h-[220px] flex flex-col">
				<div className="flex flex-col space-y-4 flex-1">
					{/* Estrelas de avaliação */}
					<div className="flex">{renderStars(avaliacao.rating)}</div>

					{/* Comentário com truncamento */}
					<p className="text-gray-700 italic line-clamp-3 flex-grow">
						"{truncateText(avaliacao.comment)}"
					</p>

					{/* Informações do usuário */}
					<div className="flex items-center mt-auto">
						{avaliacao.avatar ? (
							<img
								src={avaliacao.avatar}
								alt={avaliacao.name}
								className="w-10 h-10 rounded-full mr-3"
							/>
						) : (
							<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
								<span className="text-blue-600 font-medium">
									{getInitials(avaliacao.name)}
								</span>
							</div>
						)}
						<div>
							<p className="font-semibold text-gray-800 truncate max-w-[200px]">
								{avaliacao.name}
							</p>
							{avaliacao.location && (
								<p className="text-sm text-gray-500 truncate max-w-[200px]">
									Viagem para {avaliacao.location}
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
