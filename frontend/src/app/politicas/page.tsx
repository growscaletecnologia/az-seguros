// app/politicas/page.tsx
"use client";

import UnavailableContent from "@/components/UnavailableContent";
import { SystemPagesService } from "@/services/systemPages";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

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

export default function PoliticasPage() {
	const [pageTitle, setPageTitle] = useState<string>("Política de Privacidade");
	const [loading, setLoading] = useState<boolean>(true);
	const [content, setContent] = useState<string>("");

	// Buscar conteúdo da página de Políticas da API
	useEffect(() => {
		const fetchPrivacyContent = async () => {
			try {
				setLoading(true);
				const policiesPage = await SystemPagesService.getByType("POLICIES");

				if (policiesPage) {
					setContent(policiesPage.content);

					// Se tiver título, atualizamos o título da página
					if (policiesPage.title) {
						setPageTitle(policiesPage.title);
					}
				}
			} catch (error) {
				console.error(
					"Erro ao buscar conteúdo da Política de Privacidade:",
					error,
				);
				setContent(
					"<p>Não foi possível carregar a política de privacidade. Por favor, tente novamente mais tarde.</p>",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPrivacyContent();
	}, []);

	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			{loading ? (
				<div className="text-center py-8">Carregando...</div>
			) : content ? (
				<div className="prose prose-blue max-w-none">
					<h1 className="text-3xl font-bold text-center mb-8">{pageTitle}</h1>
					<SafeHTML html={content} />
				</div>
			) : (
				<UnavailableContent
					title="Política de Privacidade Indisponível"
					message="A política de privacidade não está disponível no momento. Por favor, tente novamente mais tarde."
				/>
			)}
		</main>
	);
}
