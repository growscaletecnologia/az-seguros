// app/termos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SystemPagesService } from "@/services/systemPages";
import DOMPurify from "dompurify";
import UnavailableContent from "@/components/UnavailableContent";

/**
 * Componente para renderizar conteúdo HTML de forma segura
 */
function SafeHTML({ html }: { html: string }) {
	return (
		<div
			dangerouslySetInnerHTML={{
				__html: DOMPurify.sanitize(html),
			}}
		/>
	);
}

export default function TermosPage() {
	const [pageTitle, setPageTitle] = useState<string>("Termos e Condições");
	const [loading, setLoading] = useState<boolean>(true);
	const [content, setContent] = useState<string>("");

	// Buscar conteúdo da página de Termos da API
	useEffect(() => {
		const fetchTermsContent = async () => {
			try {
				setLoading(true);
				const termsPage = await SystemPagesService.getByType("TERMS");
				
				if (termsPage) {
					setContent(termsPage.content);
					
					// Se tiver título, atualizamos o título da página
					if (termsPage.title) {
						setPageTitle(termsPage.title);
					}
				}
			} catch (error) {
				console.error("Erro ao buscar conteúdo dos Termos:", error);
				setContent("<p>Não foi possível carregar os termos e condições. Por favor, tente novamente mais tarde.</p>");
			} finally {
				setLoading(false);
			}
		};

		fetchTermsContent();
	}, []);

	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			{loading ? (
				<div className="text-center py-8">Carregando...</div>
			) : content ? (
				<div className="prose prose-blue max-w-none">
					<h1 className="text-3xl font-bold text-center mb-8">
						{pageTitle}
					</h1>
					<SafeHTML html={content} />
				</div>
			) : (
				<UnavailableContent 
					title="Termos Indisponíveis"
					message="Os termos e condições não estão disponíveis no momento. Por favor, tente novamente mais tarde."
				/>
			)}
		</main>
	);
}