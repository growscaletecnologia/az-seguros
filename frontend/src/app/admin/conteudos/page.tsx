"use client";

// Configurações para evitar pré-renderização no servidor
export const dynamic = "force-dynamic";
export const runtime = "edge";

import JoditEditorComponent from "@/components/Inputs/JoditEditor";
import { FrontSectionModal } from "@/components/modals/FrontSectionModal";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	type FrontSection,
	frontSectionsService,
} from "@/services/frontsections.service";
import { settingsService } from "@/services/settings.service";
import {
	type SystemPage,
	SystemPageStatus,
	type SystemPageType,
	SystemPagesService,
} from "@/services/systemPages";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Edit, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// Interface para os conteúdos legados
interface Conteudo {
	id: number;
	titulo: string;
	tipo: "pagina" | "banner" | "faq" | "termo";
	conteudo: string;
	ativo: boolean;
	dataAtualizacao: string;
}

const ConteudosPage = () => {
	const router = useRouter();

	// ------------------ STATE SYSTEM PAGES ------------------
	const [systemPages, setSystemPages] = useState<SystemPage[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// ------------------ STATE FRONT SECTIONS ------------------
	const [frontSections, setFrontSections] = useState<FrontSection[]>([]);
	const [isLoadingFrontSections, setIsLoadingFrontSections] = useState(true);
	const [showFrontSectionModal, setShowFrontSectionModal] = useState(false);
	const [editingFrontSection, setEditingFrontSection] =
		useState<FrontSection | null>(null);
	const [sectionTitle, setSectionTitle] = useState<string>(
		"Por que escolher a SeguroViagem?",
	);

	// ------------------ FUNCTIONS SYSTEM PAGES ------------------
	/**
	 * Loads all system pages from the API
	 */
	const loadSystemPages = async () => {
		try {
			setIsLoading(true);
			const response = await SystemPagesService.getAll();
			setSystemPages(response.systemPages);
		} catch (error) {
			console.error("Erro ao carregar páginas:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// ------------------ FUNCTIONS FRONT SECTIONS ------------------
	/**
	 * Carrega todas as seções do backend
	 */
	const loadFrontSections = async () => {
		try {
			setIsLoadingFrontSections(true);
			const sections = await frontSectionsService.getAll();
			setFrontSections(sections);
		} catch (error) {
			console.error("Erro ao carregar seções:", error);
			toast.error("Erro ao carregar seções");
		} finally {
			setIsLoadingFrontSections(false);
		}
	};

	/**
	 * Abre o modal para criar nova seção
	 */
	const handleNewFrontSection = () => {
		setEditingFrontSection(null);
		setShowFrontSectionModal(true);
	};

	/**
	 * Abre o modal para editar seção existente
	 */
	const handleEditFrontSection = (section: FrontSection) => {
		setEditingFrontSection(section);
		setShowFrontSectionModal(true);
	};

	/**
	 * Callback quando uma seção é salva
	 */
	const handleFrontSectionSaved = (section: FrontSection) => {
		loadFrontSections(); // Recarrega a lista
	};

	/**
	 * Alterna o status de uma seção (ACTIVE/INACTIVE)
	 */
	const toggleFrontSectionStatus = async (section: FrontSection) => {
		try {
			await frontSectionsService.toggleStatus(section.id);
			await loadFrontSections();
			toast.success(
				`Seção ${section.status === "ACTIVE" ? "desativada" : "ativada"} com sucesso!`,
			);
		} catch (error) {
			console.error("Erro ao alterar status:", error);
			toast.error("Erro ao alterar status da seção");
		}
	};

	/**
	 * Remove uma seção
	 */
	const handleDeleteFrontSection = async (section: FrontSection) => {
		if (
			!confirm(`Tem certeza que deseja excluir a seção "${section.title}"?`)
		) {
			return;
		}

		try {
			await frontSectionsService.remove(section.id);
			await loadFrontSections();
			toast.success("Seção excluída com sucesso!");
		} catch (error) {
			console.error("Erro ao excluir seção:", error);
			toast.error("Erro ao excluir seção");
		}
	};

	/**
	 * Renderiza o ícone da seção
	 */
	const renderSectionIcon = (iconName: string) => {
		const IconComponent = (LucideIcons as any)[iconName];
		if (!IconComponent)
			return <div className="w-6 h-6 bg-gray-300 rounded"></div>;
		return <IconComponent className="w-6 h-6" />;
	};

	/**
	 * Navigates to the edit page route
	 */
	const editSystemPage = (page: SystemPage) => {
		router.push(`/admin/conteudos/editar/${page.id}`);
	};

	/**
	 * Toggles the status of a system page between PUBLISHED and DRAFT
	 */
	const toggleSystemPageStatus = async (page: SystemPage) => {
		try {
			const newStatus = page.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
			await SystemPagesService.update(page.id, { status: newStatus });
			await loadSystemPages();
		} catch (error) {
			console.error("Erro ao alterar status:", error);
		}
	};

	// Restaurar uma versão arquivada
	const restoreArchivedVersion = async (page: SystemPage) => {
		try {
			// Verificar se já existe uma página publicada do mesmo tipo
			const currentPublished = systemPages.find(
				(p) => p.type === page.type && p.status === "PUBLISHED",
			);

			if (currentPublished) {
				const confirm = window.confirm(
					`Ao restaurar esta versão, a versão atual publicada será arquivada. Deseja continuar?`,
				);

				if (!confirm) return;

				// Arquivar a versão atual
				await SystemPagesService.update(currentPublished.id, {
					status: "ARCHIVED",
				});
			}

			// Publicar a versão arquivada
			await SystemPagesService.update(page.id, {
				status: "PUBLISHED",
			});

			// Atualizar a lista
			await loadSystemPages();
			toast.success("Versão restaurada com sucesso!");
		} catch (error) {
			console.error("Erro ao restaurar versão:", error);
			toast.error("Erro ao restaurar versão");
		}
	};

	useEffect(() => {
		loadSystemPages();
		loadFrontSections();
	}, []);

	// Obter cor com base no tipo da página
	const getTypeColor = (type: SystemPageType) => {
		switch (type) {
			case "TERMS":
				return "bg-orange-100 text-orange-800";
			case "POLICIES":
				return "bg-red-100 text-red-800";
			case "FAQ":
				return "bg-blue-100 text-blue-800";
			case "HELP":
				return "bg-green-100 text-green-800";
			case "ABOUT":
				return "bg-purple-100 text-purple-800";
			case "CONTACT":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// ------------------ STATE SECTION "POR QUE ESCOLHER" ------------------
	// Removido: agora usa frontSections do backend

	// ------------------ STATE HEADER & FOOTER ------------------
	const [headerFooter, setHeaderFooter] = useState({
		headerCode: "",
		footerCode: "",
	});
	const [isLoadingGtm, setIsLoadingGtm] = useState(true);
	const [isSavingGtm, setIsSavingGtm] = useState(false);

	// Carregar configurações do GTM
	useEffect(() => {
		const loadGtmSettings = async () => {
			try {
				setIsLoadingGtm(true);
				const settings = await settingsService.getGtmSettings();
				setHeaderFooter({
					headerCode: settings.gtm_head_code || "",
					footerCode: settings.gtm_body_code || "",
				});
			} catch (error) {
				console.error("Erro ao carregar configurações GTM:", error);
				toast.error("Erro ao carregar configurações do Google Tag Manager");
			} finally {
				setIsLoadingGtm(false);
			}
		};

		loadGtmSettings();
	}, []);

	// Salvar configurações do GTM
	const saveGtmSettings = async () => {
		try {
			setIsSavingGtm(true);
			await settingsService.updateGtmSettings({
				gtm_head_code: headerFooter.headerCode,
				gtm_body_code: headerFooter.footerCode,
			});
			toast.success("Configurações do Google Tag Manager salvas com sucesso");
		} catch (error) {
			console.error("Erro ao salvar configurações GTM:", error);
			toast.error("Erro ao salvar configurações do Google Tag Manager");
		} finally {
			setIsSavingGtm(false);
		}
	};

	// ------------------ STATE AVALIAÇÕES ------------------
	const [avaliacoes, setAvaliacoes] = useState([
		{
			id: 1,
			cliente: "João Silva",
			comentario: "Excelente atendimento e seguro confiável!",
		},
		{
			id: 2,
			cliente: "Maria Souza",
			comentario: "Super fácil contratar e me senti protegida na viagem.",
		},
	]);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Gestão de Páginas </h1>

			<Tabs defaultValue="conteudos">
				<TabsList className="mb-6">
					<TabsTrigger value="conteudos">Conteúdos</TabsTrigger>
					<TabsTrigger value="section">Seção: Por que escolher</TabsTrigger>
					{/* 	 */}
				</TabsList>

				{/* Aba Conteúdos */}
				<TabsContent value="conteudos">
					<div className="bg-white p-6 rounded-lg shadow">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-semibold">Páginas do Sistema</h2>
						</div>

						{isLoading ? (
							<div className="flex justify-center p-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
							</div>
						) : systemPages.length === 0 ? (
							<div className="text-center p-8 border rounded bg-gray-50">
								<p className="text-gray-500">Nenhuma página encontrada</p>
							</div>
						) : (
							<div className="space-y-4">
								{systemPages.map((page) => (
									<div key={page.id} className="border p-4 rounded">
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h3 className="font-semibold">{page.title}</h3>
													<span
														className={`px-2 py-1 text-xs rounded ${getTypeColor(
															page.type,
														)}`}
													>
														{page.type}
													</span>
													<span
														className={`px-2 py-1 text-xs rounded ${
															page.status === "PUBLISHED"
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{page.status === "PUBLISHED"
															? "Publicado"
															: "Rascunho"}
													</span>
												</div>
												<p className="text-gray-600 text-sm mb-2">
													Slug: {page.slug} | Última atualização:{" "}
													{new Date(page.updatedAt).toLocaleDateString()}
												</p>
												<div className="bg-gray-50 p-3 rounded text-sm max-h-24 overflow-hidden">
													<div
														className="text-gray-700"
														dangerouslySetInnerHTML={{
															__html:
																page.content.substring(0, 150) +
																(page.content.length > 150 ? "..." : ""),
														}}
													></div>
												</div>
											</div>
											<div className="flex flex-col space-y-2 ml-4">
												<Button
													onClick={() => editSystemPage(page)}
													variant="outline"
													className="bg-yellow-500 text-white hover:bg-yellow-600 border-none"
												>
													Editar
												</Button>
												{page.status !== "ARCHIVED" ? (
													<Button
														onClick={() => toggleSystemPageStatus(page)}
														variant="outline"
														className={`border-none ${
															page.status === "PUBLISHED"
																? "bg-orange-500 hover:bg-orange-600"
																: "bg-green-500 hover:bg-green-600"
														} text-white`}
													>
														{page.status === "PUBLISHED"
															? "Despublicar"
															: "Publicar"}
													</Button>
												) : (
													<Button
														variant="outline"
														className="bg-amber-500 text-white hover:bg-amber-600 border-none"
														onClick={() => restoreArchivedVersion(page)}
													>
														Restaurar
													</Button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</TabsContent>

				{/* Aba Section */}
				<TabsContent value="section">
					<div className="bg-white p-6 rounded-lg shadow space-y-6">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-semibold">Seção: Por que escolher</h2>
							<Button
								onClick={handleNewFrontSection}
								className="bg-blue-600 text-white hover:bg-blue-700"
							>
								<Plus className="h-4 w-4 mr-2" />
								Nova Seção
							</Button>
						</div>

						{isLoadingFrontSections ? (
							<div className="flex justify-center p-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
							</div>
						) : frontSections.length === 0 ? (
							<div className="text-center p-8 border rounded bg-gray-50">
								<p className="text-gray-500">Nenhuma seção encontrada</p>
								<Button
									onClick={handleNewFrontSection}
									className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
								>
									<Plus className="h-4 w-4 mr-2" />
									Criar primeira seção
								</Button>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{frontSections
									.sort((a, b) => a.order - b.order)
									.map((section) => (
										<div
											key={section.id}
											className="border p-4 rounded-lg space-y-3 relative"
										>
											{/* Status Badge */}
											<div className="absolute top-2 right-2">
												<span
													className={`px-2 py-1 text-xs rounded ${
														section.status === "ACTIVE"
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{section.status === "ACTIVE" ? "Ativo" : "Inativo"}
												</span>
											</div>

											{/* Ícone e Título */}
											<div className="flex items-center gap-3 mb-3">
												<div
													className={`p-2 rounded-lg bg-${section.bgColor}-100`}
												>
													{renderSectionIcon(section.icon)}
												</div>
												<div>
													<h3 className="font-semibold text-lg">
														{section.title}
													</h3>
													<p className="text-sm text-gray-500">
														Ordem: {section.order}
													</p>
												</div>
											</div>

											{/* Descrição */}
											<p className="text-gray-600 text-sm">
												{section.description}
											</p>

											{/* Ações */}
											<div className="flex gap-2 pt-3 border-t">
												<Button
													onClick={() => handleEditFrontSection(section)}
													variant="outline"
													size="sm"
													className="flex-1"
												>
													<Edit className="h-4 w-4 mr-1" />
													Editar
												</Button>
												<Button
													onClick={() => toggleFrontSectionStatus(section)}
													variant="outline"
													size="sm"
													className={`${
														section.status === "ACTIVE"
															? "text-orange-600 hover:bg-orange-50"
															: "text-green-600 hover:bg-green-50"
													}`}
												>
													{section.status === "ACTIVE" ? (
														<>
															<EyeOff className="h-4 w-4 mr-1" /> Desativar
														</>
													) : (
														<>
															<Eye className="h-4 w-4 mr-1" /> Ativar
														</>
													)}
												</Button>
												<Button
													onClick={() => handleDeleteFrontSection(section)}
													variant="outline"
													size="sm"
													className="text-red-600 hover:bg-red-50"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
							</div>
						)}
					</div>
				</TabsContent>

				{/* Aba Header/Footer */}
				<TabsContent value="headerFooter">
					<div className="bg-white p-6 rounded-lg shadow space-y-6">
						<h2 className="text-xl font-semibold mb-4">Google Tag Manager</h2>

						{isLoadingGtm ? (
							<div className="flex justify-center p-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
							</div>
						) : (
							<>
								<div>
									<label className="block text-sm font-medium mb-2">
										Código para o &lt;head&gt;
									</label>
									<Textarea
										className="h-32 bg-white border-gray-300 font-mono"
										value={headerFooter.headerCode}
										onChange={(e) =>
											setHeaderFooter({
												...headerFooter,
												headerCode: e.target.value,
											})
										}
										placeholder="<!-- Google Tag Manager -->"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Cole o código do GTM que deve ser inserido na seção
										&lt;head&gt; do site.
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Código para o &lt;body&gt;
									</label>
									<Textarea
										className="h-32 bg-white border-gray-300 font-mono"
										value={headerFooter.footerCode}
										onChange={(e) =>
											setHeaderFooter({
												...headerFooter,
												footerCode: e.target.value,
											})
										}
										placeholder="<!-- Google Tag Manager (noscript) -->"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Cole o código do GTM que deve ser inserido logo após a
										abertura da tag &lt;body&gt;.
									</p>
								</div>
								<Button
									className="bg-blue-600 text-white hover:bg-blue-700"
									onClick={saveGtmSettings}
									disabled={isSavingGtm}
								>
									{isSavingGtm ? (
										<>
											<span className="animate-spin mr-2">⏳</span>
											Salvando...
										</>
									) : (
										"Salvar Alterações"
									)}
								</Button>
							</>
						)}
					</div>
				</TabsContent>

				{/* Aba Avaliações */}
				<TabsContent value="avaliacoes">
					<div className="bg-white p-6 rounded-lg shadow space-y-6">
						<h2 className="text-xl font-semibold mb-4">Gerenciar Avaliações</h2>
						<div className="space-y-4">
							{avaliacoes.map((av) => (
								<div
									key={av.id}
									className="border p-4 rounded flex justify-between items-start"
								>
									<div>
										<p className="font-semibold">{av.cliente}</p>
										<p className="text-gray-600">{av.comentario}</p>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={() =>
												setAvaliacoes((prev) =>
													prev.filter((item) => item.id !== av.id),
												)
											}
										>
											Excluir
										</Button>
									</div>
								</div>
							))}
						</div>
						<div className="border-t pt-4">
							<h3 className="text-lg font-semibold mb-2">
								Adicionar Avaliação
							</h3>
							<Input placeholder="Nome do cliente" className="mb-2" />
							<Textarea placeholder="Comentário" className="mb-2" />
							<Button className="bg-blue-600 text-white hover:bg-blue-700">
								Adicionar
							</Button>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* Modal FrontSection */}
			<FrontSectionModal
				open={showFrontSectionModal}
				onOpenChange={setShowFrontSectionModal}
				onSectionSaved={handleFrontSectionSaved}
				editingSection={editingFrontSection}
			/>
		</div>
	);
};

export default ConteudosPage;
