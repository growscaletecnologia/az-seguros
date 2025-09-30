"use client";

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
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Página de edição de páginas do sistema existentes
 */
export default function EditarConteudoPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [systemPage, setSystemPage] = useState<SystemPage | null>(null);
	
	// Desembrulha os parâmetros usando React.use()
	const { id: pageId } = React.use(params);

	// Carrega a página do sistema
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const pageData = await SystemPagesService.getById(pageId);
				setSystemPage(pageData);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast.error("Erro ao carregar a página. Verifique se o ID é válido.");
				router.push("/admin/conteudos");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [pageId, router]);

	// Atualiza o estado da página
	const handleChange = (field: keyof SystemPage, value: any) => {
		if (!systemPage) return;
		setSystemPage({ ...systemPage, [field]: value });
	};

	// Atualiza os metadados da página
	const handleMetadataChange = (field: string, value: string) => {
		if (!systemPage) return;
		setSystemPage({
			...systemPage,
		});
	};

	// Gera um slug a partir do título
	const generateSlug = () => {
		if (!systemPage?.title) return;

		const slug = systemPage.title
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s]/g, "")
			.replace(/\s+/g, "-");

		handleChange("slug", slug);
	};

	// Salva as alterações da página
	const handleSave = async (status?: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
		if (!systemPage) return;

		try {
			setSaving(true);

			// Validações básicas antes de salvar
			if (status === "PUBLISHED") {
				if (!systemPage.title?.trim()) {
					toast.error("O título é obrigatório para publicar a página.");
					return;
				}
				if (!systemPage.slug?.trim()) {
					toast.error("O slug é obrigatório para publicar a página.");
					return;
				}
				if (!systemPage.content?.trim()) {
					toast.error("O conteúdo é obrigatório para publicar a página.");
					return;
				}
			}

			const updateData = {
				title: systemPage.title,
				slug: systemPage.slug,
				content: systemPage.content,
				type: systemPage.type,
				status: status || systemPage.status,
				//metadata: systemPage.metadata,
			};

			await SystemPagesService.update(systemPage.id, updateData);

			toast.success("Página atualizada com sucesso!");
			router.push("/admin/conteudos");
		} catch (error: any) {
			console.error("Erro ao atualizar página:", error);
			// Tratamento específico para diferentes tipos de erro
			if (error?.response?.status === 409) {
				toast.error("Este slug já está sendo usado por outra página. Escolha um slug diferente.");
			} else if (error?.response?.status === 422) {
				toast.error("Dados inválidos. Verifique os campos obrigatórios.");
			} else {
				toast.error("Erro ao atualizar página. Verifique os dados e tente novamente.");
			}
		} finally {
			setSaving(false);
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

	// Obter cor com base no status
	const getStatusColor = (status: string) => {
		switch (status) {
			case "PUBLISHED":
				return "text-green-600";
			case "DRAFT":
				return "text-yellow-600";
			case "ARCHIVED":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto py-6">
				<div className="flex justify-center items-center h-64">
					<p>Carregando...</p>
				</div>
			</div>
		);
	}

	if (!systemPage) {
		return (
			<div className="container mx-auto py-6">
				<div className="flex justify-center items-center h-64">
					<p>Página não encontrada</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Editar Página do Sistema</h1>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => router.push("/admin/conteudos")}>
						Cancelar
					</Button>
					<Button
						variant="secondary"
						onClick={() => handleSave("DRAFT")}
						disabled={saving}
					>
						Salvar como Rascunho
					</Button>
					<Button onClick={() => handleSave("PUBLISHED")} disabled={saving}>
						Publicar
					</Button>
					{systemPage.status !== "ARCHIVED" && (
						<Button
							variant="destructive"
							onClick={() => handleSave("ARCHIVED")}
							disabled={saving}
						>
							Arquivar
						</Button>
					)}
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

								{/* <div>
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										value={systemPage.slug}
										disabled
										onChange={(e) => handleChange("slug", e.target.value)}
									/>
								</div>

								<div>
									<Label htmlFor="type">Tipo de Página</Label>
									<Select
										value={systemPage.type}
										disabled
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
								</div> */}
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
								<span>Atualizado em: {new Date(systemPage.updatedAt).toLocaleDateString()}</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity">
										<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
									</svg>
								</div>
								<span className={getStatusColor(systemPage.status)}>
									Status: {systemPage.status === "PUBLISHED" ? "Publicado" : systemPage.status === "DRAFT" ? "Rascunho" : "Arquivado"}
								</span>
							</div>
							<Button
								className="w-full bg-white text-black hover:bg-gray-200"
								onClick={() => handleSave("PUBLISHED")}
								disabled={saving}
							>
								Publicar
							</Button>
							<Button
								variant="outline"
								className="w-full border-white hover:bg-blue-300"
								onClick={() => handleSave("DRAFT")}
								disabled={saving}
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
								<p><strong>ID:</strong> {systemPage.id}</p>
								<p><strong>Slug:</strong> {systemPage.slug}</p>
								<p><strong>Tipo:</strong> {getTypeLabel(systemPage.type)}</p>
								<p><strong>Criado em:</strong> {new Date(systemPage.createdAt).toLocaleDateString()}</p>
								<p><strong>Última atualização:</strong> {new Date(systemPage.updatedAt).toLocaleDateString()}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}