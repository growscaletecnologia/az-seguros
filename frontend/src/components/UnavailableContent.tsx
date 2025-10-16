"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

interface UnavailableContentProps {
	title?: string;
	message?: string;
	showHomeButton?: boolean;
	showBackButton?: boolean;
}

/**
 * Componente para exibir quando um conteúdo não está disponível ou uma página não foi encontrada
 *
 * @param title - Título personalizado (padrão: "Conteúdo Indisponível")
 * @param message - Mensagem personalizada (padrão: "O conteúdo que você está procurando não está disponível no momento.")
 * @param showHomeButton - Se deve mostrar o botão para voltar à página inicial
 * @param showBackButton - Se deve mostrar o botão para voltar à página anterior
 */
export default function UnavailableContent({
	title = "Conteúdo Indisponível",
	message = "O conteúdo que você está procurando não está disponível no momento.",
	showHomeButton = true,
	showBackButton = true,
}: UnavailableContentProps) {
	return (
		<div className="flex flex-col  bg-white items-center justify-center min-h-[50vh] py-12 px-4 text-center">
			<div className="mb-8  w-full max-w-md">
				<Image
					src="/images/notfound.png"
					alt="Conteúdo indisponível"
					width={800}
					height={400}
					style={{ objectFit: "contain" }}
					priority
				/>
			</div>
			<h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
			<p className="text-lg text-gray-600 mb-8 max-w-md">{message}</p>

			<div className="flex flex-wrap gap-4 justify-center">
				{showHomeButton && (
					<Button asChild>
						<Link href="/">Voltar para a página inicial</Link>
					</Button>
				)}

				{showBackButton && (
					<Button variant="outline" onClick={() => window.history.back()}>
						Voltar
					</Button>
				)}
			</div>
		</div>
	);
}
