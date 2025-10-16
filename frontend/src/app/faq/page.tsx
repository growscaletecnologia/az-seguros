// app/faq/page.tsx
"use client";

import UnavailableContent from "@/components/UnavailableContent";
import { SystemPagesService } from "@/services/systemPages";
import DOMPurify from "dompurify";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface FAQItem {
	question: string;
	answer: string;
}

// FAQs padrão caso a API não retorne dados
const defaultFaqs: FAQItem[] = [
	{
		question: "O que é o seguro viagem e por que eu preciso dele?",
		answer:
			"O seguro viagem cobre despesas médicas, hospitalares e imprevistos durante sua viagem, garantindo tranquilidade em caso de acidentes, doenças, perda de bagagem ou atrasos de voo. Em muitos destinos internacionais, o seguro é obrigatório.",
	},
	{
		question: "O seguro é obrigatório para viajar?",
		answer:
			"Depende do destino. Países da União Europeia que fazem parte do Tratado de Schengen exigem a contratação de um seguro viagem com cobertura mínima de €30 mil. Outros destinos não exigem, mas sempre é recomendado contratar.",
	},
	{
		question: "A cobertura vale a partir de quando?",
		answer:
			"A cobertura do seguro viagem passa a valer a partir da data de embarque informada na contratação, desde que a viagem inicie no Brasil. Viagens já em andamento não podem ser seguradas.",
	},
	{
		question: "O que acontece se eu precisar usar o seguro durante a viagem?",
		answer:
			"Você terá acesso à central de atendimento da seguradora 24h por dia, em português. A central orienta sobre hospitais credenciados e procedimentos para acionamento do seguro, sem custo adicional.",
	},
	{
		question: "Posso cancelar o seguro depois de comprar?",
		answer:
			"Sim, é possível solicitar o cancelamento antes do início da vigência do seguro. Após o embarque, o cancelamento não será mais permitido.",
	},
	{
		question: "Como recebo minha apólice de seguro?",
		answer:
			"Após a confirmação do pagamento, você receberá a apólice por e-mail e poderá também acessá-la na Área do Cliente dentro do nosso site.",
	},
];

function FAQItemComponent({ item }: { item: FAQItem }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-b border-gray-200 py-4">
			<button
				onClick={() => setOpen(!open)}
				className="flex justify-between items-center w-full text-left"
			>
				<span className="font-medium text-gray-800">{item.question}</span>
				<ChevronDown
					className={`h-5 w-5 text-gray-500 transition-transform ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>
			{open && (
				<p className="mt-2 text-gray-600 text-sm leading-relaxed">
					{item.answer}
				</p>
			)}
		</div>
	);
}

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

export default function FAQPage() {
	const [faqs, setFaqs] = useState<FAQItem[]>(defaultFaqs);
	const [pageTitle, setPageTitle] = useState<string>("Perguntas Frequentes");
	const [loading, setLoading] = useState<boolean>(true);
	const [htmlContent, setHtmlContent] = useState<string | null>(null);

	// Buscar conteúdo da página FAQ da API
	useEffect(() => {
		const fetchFAQContent = async () => {
			let faqPage = null;

			try {
				setLoading(true);
				faqPage = await SystemPagesService.getByType("FAQ");

				if (faqPage) {
					// Se tiver conteúdo HTML, usamos ele diretamente
					setHtmlContent(faqPage.content);

					// Se tiver título, atualizamos o título da página
					if (faqPage.title) {
						setPageTitle(faqPage.title);
					}

					// Tentamos extrair FAQs do conteúdo se não for HTML estruturado
					// Isso é um fallback caso o conteúdo não seja HTML completo
					try {
						const parsedContent = JSON.parse(faqPage.content);
						if (Array.isArray(parsedContent) && parsedContent.length > 0) {
							setFaqs(parsedContent);
							setHtmlContent(null); // Não usamos HTML se temos FAQs estruturadas
						}
					} catch (e) {
						// Se não conseguir fazer parse como JSON, mantém o conteúdo HTML
						console.log("Usando conteúdo HTML da página");
					}
				}
			} catch (error) {
				console.error("Erro ao buscar conteúdo FAQ:", error);
				// Mantém os FAQs padrão em caso de erro
			} finally {
				setLoading(false);
			}

			// Se não houver conteúdo na API e não tivermos FAQs padrão, mostraremos o componente de indisponibilidade
			if (!faqPage && defaultFaqs.length === 0) {
				setHtmlContent(null);
				setFaqs([]);
			}
		};

		fetchFAQContent();
	}, []);

	return (
		<main className="max-w-3xl mx-auto px-4 py-12">
			{loading ? (
				<div className="text-center py-8">Carregando...</div>
			) : htmlContent || faqs.length > 0 ? (
				<>
					<h1 className="text-3xl font-bold text-center mb-8">{pageTitle}</h1>

					{htmlContent ? (
						// Renderiza conteúdo HTML se disponível
						<div className="faq-content">
							<SafeHTML html={htmlContent} />
						</div>
					) : (
						// Renderiza FAQs estruturados se não tiver HTML
						<div className="space-y-2">
							{faqs.map((faq, index) => (
								<FAQItemComponent key={index} item={faq} />
							))}
						</div>
					)}
				</>
			) : (
				// Mostra o componente de conteúdo indisponível quando não há dados
				<UnavailableContent
					title="FAQ Indisponível"
					message="As perguntas frequentes não estão disponíveis no momento. Por favor, tente novamente mais tarde."
				/>
			)}
		</main>
	);
}
