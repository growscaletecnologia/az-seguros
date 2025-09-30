"use client";

// Adicionando configuração para evitar pré-renderização no servidor
export const dynamic = "force-dynamic";
export const runtime = "edge";

import JoditEditorComponent from "@/components/Inputs/JoditEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	SystemPage,
	SystemPageType,
	SystemPagesService,
} from "@/services/systemPages";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Página de criação de novas páginas do sistema
 */
export default function NovoConteudoPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [systemPage, setSystemPage] = useState({
		title: "",
		slug: "",
		content: "",
		type: "TERMS" as SystemPageType,
		status: "DRAFT" as const,
		metadata: {
			title: "",
			description: "",
			keywords: "",
		},
	});

	// Atualiza o estado da página
	const handleChange = (field: string, value: any) => {
		setSystemPage((prev) => ({ ...prev, [field]: value }));
	};

	// Atualiza os metadados da página
	const handleMetadataChange = (field: string, value: string) => {
		setSystemPage((prev) => ({
			...prev,
			metadata: {
				...prev.metadata!,
				[field]: value,
			},
		}));
	};

	// Gera um slug a partir do título
	const generateSlug = () => {
		if (!systemPage.title) return;

		const slug = systemPage.title
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s]/g, "")
			.replace(/\s+/g, "-");

		handleChange("slug", slug);
	};

	// Salva a página
	const handleSave = async (status: "DRAFT" | "PUBLISHED" = "DRAFT") => {
		try {
			setLoading(true);

			// Validações básicas
			if (!systemPage.title.trim()) {
				toast.error("O título é obrigatório.");
				return;
			}

			if (!systemPage.slug.trim()) {
				toast.error("O slug é obrigatório.");
				return;
			}

			if (status === "PUBLISHED" && !systemPage.content.trim()) {
				toast.error("O conteúdo é obrigatório para publicar a página.");
				return;
			}

			// Atualiza o status antes de salvar
			const pageToSave = {
				...systemPage,
				status,
				content: systemPage.content || "",
				// Metadados SEO não são mais obrigatórios
				metadata: systemPage.metadata?.title || systemPage.metadata?.description || systemPage.metadata?.keywords ? {
					title: systemPage.metadata?.title || "",
					description: systemPage.metadata?.description || "",
					keywords: systemPage.metadata?.keywords || "",
				} : undefined,
			};

			// Criar a página
			const savedPage = await SystemPagesService.create(pageToSave);

			toast.success("Página salva com sucesso!");
			router.push("/admin/conteudos");
		} catch (error: any) {
			console.error("Erro ao salvar página:", error);
			// Exibe mensagem de erro mais específica se disponível
			const errorMessage =
				error.message ||
				error.response?.data?.message ||
				"Erro ao salvar página. Verifique os dados e tente novamente.";

			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// Obter label do tipo de página
	const getTypeLabel = (type: SystemPageType) => {
		switch (type) {
			case "TERMS":
				return "Termos de Uso";
			case "POLICIES":
				return "Política de Privacidade";
			case "FAQ":
				return "Perguntas Frequentes";
			case "HELP":
				return "Ajuda";
			case "ABOUT":
				return "Sobre";
			case "CONTACT":
				return "Contato";
			default:
				return type;
		}
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Nova Página do Sistema</h1>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => router.push("/admin/conteudos")}>
						Cancelar
					</Button>
					<Button
						variant="secondary"
						onClick={() => handleSave("DRAFT")}
						disabled={loading}
					>
						Salvar como Rascunho
					</Button>
					<Button onClick={() => handleSave("PUBLISHED")} disabled={loading}>
						Publicar
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Informações Básicas</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<Label htmlFor="title">Título</Label>
									<Input
										id="title"
										value={systemPage.title}
										onChange={(e) => handleChange("title", e.target.value)}
										onBlur={generateSlug}
									/>
								</div>

								<div>
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										value={systemPage.slug || ""}
										onChange={(e) => handleChange("slug", e.target.value)}
									/>
								</div>

								<div>
									<Label htmlFor="type">Tipo de Página</Label>
									<Select
										value={systemPage.type}
										onValueChange={(value) => handleChange("type", value as SystemPageType)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o tipo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="TERMS">Termos de Uso</SelectItem>
											<SelectItem value="PRIVACY">Política de Privacidade</SelectItem>
											<SelectItem value="FAQ">Perguntas Frequentes</SelectItem>
											<SelectItem value="HELP">Ajuda</SelectItem>
											<SelectItem value="ABOUT">Sobre</SelectItem>
											<SelectItem value="CONTACT">Contato</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Conteúdo</CardTitle>
						</CardHeader>
						<CardContent>
							<JoditEditorComponent
								onChange={(value) => handleChange("content", value)}
								value={systemPage.content || ""}
							/>
						</CardContent>
					</Card>

					{/* <Tabs defaultValue="seo">
						<TabsList className="mb-4">
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						<TabsContent value="seo">
							<Card>
								<CardHeader>
									<CardTitle>Metadados SEO</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<Label htmlFor="meta-title">Título SEO</Label>
											<Input
												id="meta-title"
												value={systemPage.metadata?.title || ""}
												onChange={(e) =>
													handleMetadataChange("title", e.target.value)
												}
												placeholder="Título para SEO (recomendado: até 60 caracteres)"
											/>
										</div>

										<div>
											<Label htmlFor="meta-description">Descrição SEO</Label>
											<Textarea
												id="meta-description"
												value={systemPage.metadata?.description || ""}
												onChange={(e) =>
													handleMetadataChange("description", e.target.value)
												}
												placeholder="Descrição para SEO (recomendado: até 160 caracteres)"
												rows={3}
											/>
										</div>

										<div>
											<Label htmlFor="meta-keywords">Palavras-chave</Label>
											<Input
												id="meta-keywords"
												value={systemPage.metadata?.keywords || ""}
												onChange={(e) =>
													handleMetadataChange("keywords", e.target.value)
												}
												placeholder="Palavras-chave separadas por vírgula"
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs> */}
				</div>

				{/* Coluna lateral direita */}
				<div className="space-y-6">
					{/* Status da Publicação */}
					<Card className="border-none">
						<CardHeader>
							<CardTitle>Status da Publicação</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
								</div>
								<span>Nova página</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity">
										<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
									</svg>
								</div>
								<span>Status: Rascunho</span>
							</div>
							<Button
								className="w-full bg-white text-black hover:bg-gray-200"
								onClick={() => handleSave("PUBLISHED")}
								disabled={loading}
							>
								Publicar
							</Button>
							<Button
								variant="outline"
								className="w-full border-white hover:bg-blue-300"
								onClick={() => handleSave("DRAFT")}
								disabled={loading}
							>
								Salvar Rascunho
							</Button>
						</CardContent>
					</Card>

					{/* Tipo de Página */}
					<Card className="border-none">
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="flex items-center">
								Tipo de Página
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text ml-2">
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14 2 14 8 20 8" />
									<line x1="16" y1="13" x2="8" y2="13" />
									<line x1="16" y1="17" x2="8" y2="17" />
									<polyline points="10 9 9 9 8 9" />
								</svg>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex items-center space-x-2 bg-sky-200 p-2 rounded">
								<span>{getTypeLabel(systemPage.type)}</span>
							</div>
						</CardContent>
					</Card>

					{/* Informações Adicionais */}
					<Card className="border-none">
						<CardHeader>
							<CardTitle className="flex items-center">
								Informações
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info ml-2">
									<circle cx="12" cy="12" r="10" />
									<path d="M12 16v-4" />
									<path d="M12 8h.01" />
								</svg>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="text-sm text-gray-600">
								<p><strong>Slug:</strong> {systemPage.slug || "Será gerado automaticamente"}</p>
								<p><strong>Tipo:</strong> {getTypeLabel(systemPage.type)}</p>
								<p><strong>Status:</strong> Rascunho</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}