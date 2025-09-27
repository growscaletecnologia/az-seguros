"use client";

// Configurações para evitar pré-renderização no servidor
export const dynamic = "force-dynamic";
export const runtime = "edge";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import {
  SystemPage,
  SystemPageType,
  SystemPageStatus,
  SystemPagesService
} from "@/services/systemPages";
import { settingsService } from "@/services/settings.service";
import JoditEditorComponent from "@/components/Inputs/JoditEditor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Separator } from "@radix-ui/react-dropdown-menu";

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
	// ------------------ STATE SYSTEM PAGES ------------------
	const [systemPages, setSystemPages] = useState<SystemPage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingPage, setEditingPage] = useState<SystemPage | null>(null);
	const [deletePassword, setDeletePassword] = useState("");
	const [deletePageId, setDeletePageId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [sectionTitle, setSectionTitle] = useState<string>(
		"Por que escolher a SeguroViagem?"
	);
	
	const [newSystemPage, setNewSystemPage] = useState({
		title: "",
		slug: "",
		content: "",
		type: "TERMS" as SystemPageType,
	});
	
	// Carregar páginas do sistema
	const fetchSystemPages = async () => {
		try {
			setIsLoading(true);
			const response = await SystemPagesService.getAll();
			setSystemPages(response.systemPages);
		} catch (error) {
			console.error("Erro ao carregar páginas do sistema:", error);
			toast.error("Erro ao carregar páginas do sistema");
		} finally {
			setIsLoading(false);
		}
	};
	
	// Restaurar uma versão arquivada
	const restoreArchivedVersion = async (page: SystemPage) => {
		try {
			// Verificar se já existe uma página publicada do mesmo tipo
			const currentPublished = systemPages.find(p => 
				p.type === page.type && 
				p.status === "PUBLISHED"
			);
			
			if (currentPublished) {
				const confirm = window.confirm(
					`Ao restaurar esta versão, a versão atual publicada será arquivada. Deseja continuar?`
				);
				
				if (!confirm) return;
				
				// Arquivar a versão atual
				await SystemPagesService.update(currentPublished.id, {
					status: "ARCHIVED"
				});
			}
			
			// Publicar a versão arquivada
			await SystemPagesService.update(page.id, {
				status: "PUBLISHED"
			});
			
			// Atualizar a lista
			await fetchSystemPages();
			toast.success("Versão restaurada com sucesso!");
		} catch (error) {
			console.error("Erro ao restaurar versão:", error);
			toast.error("Erro ao restaurar versão");
		}
	};
	
	useEffect(() => {
		fetchSystemPages();
	}, []);
	
	// Criar nova página do sistema
	const createSystemPage = async () => {
		try {
			const newPage = await SystemPagesService.create({
				...newSystemPage,
				status: "PUBLISHED"
			});
			setSystemPages([...systemPages, newPage]);
			setNewSystemPage({
				title: "",
				slug: "",
				content: "",
				type: "TERMS"
			});
			toast.success("Página criada com sucesso!");
		} catch (error) {
			console.error("Erro ao criar página:", error);
			toast.error("Erro ao criar página");
		}
	};
	
	// Editar página do sistema
	const editSystemPage = (page: SystemPage) => {
		setEditingPage(page);
	};
	
	// Salvar edição da página
	const saveSystemPageEdit = async () => {
		if (editingPage) {
			try {
				const updatedPage = await SystemPagesService.update(editingPage.id, {
					title: editingPage.title,
					slug: editingPage.slug,
					content: editingPage.content,
					type: editingPage.type,
					status: editingPage.status
				});
				
				setSystemPages(systemPages.map(page => 
					page.id === updatedPage.id ? updatedPage : page
				));
				setEditingPage(null);
				toast.success("Página atualizada com sucesso!");
			} catch (error) {
				console.error("Erro ao atualizar página:", error);
				toast.error("Erro ao atualizar página");
			}
		}
	};
	
	// Toggle status da página (publicado/rascunho)
	const toggleSystemPageStatus = async (page: SystemPage) => {
		try {
			const newStatus = page.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
			
			// Se estamos publicando, mostrar confirmação
			if (newStatus === "PUBLISHED") {
				// Verificar se já existe uma página publicada do mesmo tipo
				const existingPublished = systemPages.find(p => 
					p.type === page.type && 
					p.status === "PUBLISHED" && 
					p.id !== page.id
				);
				
				if (existingPublished) {
					// Confirmar com o usuário
					const confirm = window.confirm(
						`Já existe uma página do tipo "${page.type}" publicada. Ao publicar esta nova versão, a versão anterior será arquivada. Deseja continuar?`
					);
					
					if (!confirm) return;
				}
			}
			
			const updatedPage = await SystemPagesService.update(page.id, {
				status: newStatus
			});
			
			// Atualizar a lista de páginas (incluindo possíveis páginas arquivadas)
			await fetchSystemPages();
			
			toast.success(`Página ${newStatus === "PUBLISHED" ? "publicada" : "despublicada"} com sucesso!`);
		} catch (error) {
			console.error("Erro ao alterar status da página:", error);
			toast.error("Erro ao alterar status da página");
		}
	};
	
	// Confirmar exclusão com senha
	const confirmDelete = async () => {
		if (!deletePageId || !deletePassword) return;
		
		try {
			setIsDeleting(true);
			
			// Validar senha do usuário
			await api.post("/auth/login", {
				email: localStorage.getItem("userEmail") || "",
				password: deletePassword
			});
			
			// Se a senha estiver correta, excluir a página
			await SystemPagesService.remove(deletePageId);
			setSystemPages(systemPages.filter(page => page.id !== deletePageId));
			setDeletePageId(null);
			setDeletePassword("");
			toast.success("Página excluída com sucesso!");
		} catch (error) {
			console.error("Erro ao excluir página:", error);
			toast.error("Senha incorreta ou erro ao excluir página");
		} finally {
			setIsDeleting(false);
		}
	};
	
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

	// ------------------ STATE SECTION “POR QUE ESCOLHER” ------------------
	const [sectionItems, setSectionItems] = useState([
		{
			id: 1,
			icone: "💰",
			titulo: "Melhor Preço",
			descricao:
				"Garantimos o melhor preço do mercado ou devolvemos a diferença.",
		},
		{
			id: 2,
			icone: "⏰",
			titulo: "Suporte 24h",
			descricao:
				"Atendimento especializado 24 horas por dia, 7 dias por semana.",
		},
		{
			id: 3,
			icone: "🛡️",
			titulo: "Compra Segura",
			descricao: "Transações 100% seguras com certificado SSL e criptografia.",
		},
		{
			id: 4,
			icone: "👥",
			titulo: "+1M Clientes",
			descricao:
				"Mais de 1 milhão de viajantes já confiaram em nossos serviços.",
		},
	]);

	const handleUpdateSection = (id: number, field: string, value: string) => {
		setSectionItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
		);
	};

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
							<Button
								onClick={() => setEditingPage({
									id: '',
									title: '',
									slug: '',
									content: '',
									type: 'TERMS',
									status: 'DRAFT',
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString()
								})}
								className="bg-blue-600 hover:bg-blue-700"
							>
								Nova Página
							</Button>
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
															page.type
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
														{page.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
													</span>
												</div>
												<p className="text-gray-600 text-sm mb-2">
													Slug: {page.slug} | Última atualização: {new Date(page.updatedAt).toLocaleDateString()}
												</p>
												<div className="bg-gray-50 p-3 rounded text-sm max-h-24 overflow-hidden">
													<div className="text-gray-700" dangerouslySetInnerHTML={{ __html: page.content.substring(0, 150) + (page.content.length > 150 ? '...' : '') }}></div>
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
											{page.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
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
									
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="outline"
												className="bg-red-500 text-white hover:bg-red-600 border-none"
												onClick={() => setDeletePageId(page.id)}
											>
												Excluir
											</Button>
										</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
															<AlertDialogDescription>
																Esta ação não pode ser desfeita. Digite sua senha para confirmar a exclusão.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<div className="py-4">
															<Input
																type="password"
																placeholder="Digite sua senha"
																value={deletePassword}
																onChange={(e) => setDeletePassword(e.target.value)}
															/>
														</div>
														<AlertDialogFooter>
															<AlertDialogCancel onClick={() => {
																setDeletePageId(null);
																setDeletePassword("");
															}}>
																Cancelar
															</AlertDialogCancel>
															<AlertDialogAction
																onClick={confirmDelete}
																disabled={isDeleting || !deletePassword}
																className="bg-red-500 hover:bg-red-600"
															>
																{isDeleting ? "Excluindo..." : "Excluir"}
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
						
						{/* Editor de página */}
						{editingPage && (
							<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
								<div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
									<div className="p-6">
										<div className="flex justify-between items-center mb-6">
											<h2 className="text-xl font-semibold">
												{editingPage.id ? "Editar Página" : "Nova Página"}
											</h2>
											<Button
												variant="ghost"
												onClick={() => setEditingPage(null)}
												className="text-gray-500"
											>
												✕
											</Button>
										</div>
										
										<div className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium mb-1">Título</label>
													<Input
														value={editingPage.title}
														onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
													/>
												</div>
												<div>
													<label className="block text-sm font-medium mb-1">Slug</label>
													<Input
														value={editingPage.slug}
														onChange={(e) => setEditingPage({...editingPage, slug: e.target.value})}
													/>
												</div>
											</div>
											
											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium mb-1">Tipo</label>
													<select
														className="w-full border rounded p-2"
														value={editingPage.type}
														onChange={(e) => setEditingPage({...editingPage, type: e.target.value as SystemPageType})}
													>
														<option value="TERMS">Termos de Uso</option>
														<option value="PRIVACY">Política de Privacidade</option>
														<option value="FAQ">Perguntas Frequentes</option>
														<option value="HELP">Ajuda</option>
														<option value="ABOUT">Sobre</option>
														<option value="CONTACT">Contato</option>
													</select>
												</div>
												<div>
													<label className="block text-sm font-medium mb-1">Status</label>
													<select
														className="w-full border rounded p-2"
														value={editingPage.status}
														onChange={(e) => setEditingPage({...editingPage, status: e.target.value as SystemPageStatus})}
													>
														<option value="PUBLISHED">Publicado</option>
														<option value="DRAFT">Rascunho</option>
													</select>
												</div>
											</div>
											
											<div>
												<label className="block text-sm font-medium mb-1">Conteúdo</label>
												<JoditEditorComponent
													value={editingPage.content}
													onChange={(value) => setEditingPage({...editingPage, content: value})}
												/>
											</div>
											
											<div className="flex justify-end space-x-2 pt-4">
												<Button
													variant="outline"
													onClick={() => setEditingPage(null)}
												>
													Cancelar
												</Button>
												<Button
													onClick={editingPage.id ? saveSystemPageEdit : createSystemPage}
													className="bg-blue-600 hover:bg-blue-700"
												>
													{editingPage.id ? "Salvar Alterações" : "Criar Página"}
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</TabsContent>

				{/* Aba Section */}
				<TabsContent value="section">
					<div className="bg-white p-6 rounded-lg shadow space-y-6">
						<h2 className="text-xl font-semibold mb-4">
							<CardTitle className="mb-4">Título da Seção</CardTitle>
							<Input
								value={sectionTitle}
								onChange={(e) => setSectionTitle(e.target.value)}
								placeholder="Ícone (emoji ou classe)"
							/>
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{sectionItems.map((item) => (
								<div key={item.id} className="border p-4 rounded space-y-3">
									<Input
										value={item.icone}
										onChange={(e) =>
											handleUpdateSection(item.id, "icone", e.target.value)
										}
										placeholder="Ícone (emoji ou classe)"
									/>
									<Input
										value={item.titulo}
										onChange={(e) =>
											handleUpdateSection(item.id, "titulo", e.target.value)
										}
										placeholder="Título"
									/>
									<Textarea
										value={item.descricao}
										onChange={(e) =>
											handleUpdateSection(item.id, "descricao", e.target.value)
										}
										placeholder="Descrição"
									/>
								</div>
							))}
						</div>
						<Button className="bg-blue-600 text-white hover:bg-blue-700">
							Salvar Alterações
						</Button>
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
										Cole o código do GTM que deve ser inserido na seção &lt;head&gt; do site.
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
										Cole o código do GTM que deve ser inserido logo após a abertura da tag &lt;body&gt;.
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
		</div>
	);
};

export default ConteudosPage;
