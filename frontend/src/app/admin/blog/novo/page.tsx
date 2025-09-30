"use client";

// Adicionando configuração para evitar pré-renderização no servidor
export const dynamic = "force-dynamic";
export const runtime = "edge";

import JoditEditorComponent from "@/components/Inputs/JoditEditor";
import { TinyMCEEditor } from "@/components/Inputs/TinyMCEEditor";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { AddTagModal } from "@/components/modals/AddTagModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
	type CreatePostDTO,
	type Category,
	type Tag,
	postsService,
} from "@/services/posts.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { validateImageFile, convertToWebP, generateImagePreview } from "@/utils/imageUtils";

/**
 * Página de criação de novos posts
 */
export default function NovoBlogPostPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	
	// Estados para controlar os modais
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [showTagModal, setShowTagModal] = useState(false);

	// Estado para armazenar o arquivo de imagem de capa
	const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
	const [coverImagePreview, setCoverImagePreview] = useState<string>("");

	const [post, setPost] = useState<CreatePostDTO>({
		title: "",
		content: "",
		resume: "",
		status: "DRAFT",
		fullUrl: "",
		coverImage: "",
		metadata: {
			title: "",
			description: "",
			keywords: "",
		},
	});

	// Carrega categorias e tags
	useEffect(() => {
		const loadData = async () => {
			try {
				const [categoriesData, tagsData] = await Promise.all([
					postsService.getCategories(),
					postsService.getTags(),
				]);
				setCategories(categoriesData?.categories || []);
				setTags(tagsData?.tags || []);
				
				// Seleciona automaticamente a primeira categoria disponível (Blog)
				if (categoriesData?.categories?.length > 0) {
					setSelectedCategories([categoriesData.categories[0].id]);
				}
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
			}
		};

		loadData();
	}, []);

	// Função para recarregar categorias
	const reloadCategories = async () => {
		try {
			const categoriesData = await postsService.getCategories();
			setCategories(categoriesData);
		} catch (error) {
			console.error("Erro ao recarregar categorias:", error);
		}
	};

	// Função para recarregar tags
	const reloadTags = async () => {
		try {
			const tagsData = await postsService.getTags();
			setTags(tagsData);
		} catch (error) {
			console.error("Erro ao recarregar tags:", error);
		}
	};

	// Callback quando uma nova categoria é adicionada
	const handleCategoryAdded = (newCategory: Category) => {
		setCategories(prev => [...prev, newCategory]);
		setSelectedCategories(prev => [...prev, newCategory.id]);
	};

	// Callback quando uma nova tag é adicionada
	const handleTagAdded = (newTag: Tag) => {
		setTags(prev => [...prev, newTag]);
		setSelectedTags(prev => [...prev, newTag.id]);
	};

	// Atualiza o estado do post
	const handleChange = (field: keyof CreatePostDTO, value: any) => {
		setPost((prev) => ({ ...prev, [field]: value }));
	};

	// Atualiza os metadados do post
	const handleMetadataChange = (field: string, value: string) => {
		setPost((prev) => ({
			...prev,
			metadata: {
				...prev.metadata!,
				[field]: value,
			},
		}));
	};

	// Gera um slug a partir do título
	const generateSlug = () => {
		if (!post.title) return;

		const slug = post.title
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^\w\s]/g, "")
			.replace(/\s+/g, "-");

		handleChange("slug", slug);
		generateFullUrl(slug);
	};

	/**
	 * Gera a URL completa baseada no slug e categoria selecionada
	 */
	const generateFullUrl = (slug?: string) => {
		const currentSlug = slug || post.slug;
		if (!currentSlug) return;

		// Se há categorias selecionadas, usar a primeira categoria
		if (selectedCategories.length > 0) {
			const firstCategory = categories.find(cat => cat.id === selectedCategories[0]);
			if (firstCategory) {
				// Normalizar o slug da categoria (remover acentos e espaços)
				const categorySlug = firstCategory.slug
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/[^\w\s]/g, "")
					.replace(/\s+/g, "-");
				
				handleChange("fullUrl", `/blog/${categorySlug}/${currentSlug}`);
			} else {
				handleChange("fullUrl", `/blog/${currentSlug}`);
			}
		} else {
			handleChange("fullUrl", `/blog/${currentSlug}`);
		}
	};

	/**
	 * Manipula a seleção de arquivo de imagem de capa com conversão automática para WebP
	 */
	const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			// Validar arquivo
			const validation = validateImageFile(file);
			if (!validation.isValid) {
				toast.error(validation.error);
				return;
			}

			// Mostrar loading
			toast.info("Processando imagem...");

			// Converter para WebP se não for SVG
			let processedFile = file;
			if (file.type !== 'image/svg+xml') {
				processedFile = await convertToWebP(file, 0.85, 1200, 800);
			}

			setCoverImageFile(processedFile);
			
			// Gerar preview
			const preview = await generateImagePreview(processedFile);
			setCoverImagePreview(preview);

			toast.success("Imagem processada com sucesso!");
		} catch (error) {
			console.error("Erro ao processar imagem:", error);
			toast.error("Erro ao processar a imagem. Tente novamente.");
		}
	};

	/**
	 * Remove a imagem de capa selecionada
	 */
	const removeCoverImage = () => {
		setCoverImageFile(null);
		setCoverImagePreview("");
		// Limpar o input file
		const fileInput = document.getElementById('coverImageFile') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	// Salva o post
	const handleSave = async (status: "DRAFT" | "PUBLISHED" = "DRAFT") => {
		try {
			setLoading(true);

			// Atualiza o status antes de salvar
			const postToSave: CreatePostDTO = {
				...post,
				content:  post.content || "",
				status,
				categoryIds: selectedCategories.length > 0 ? selectedCategories : 
					(categories.length > 0 ? [categories[0].id] : []),
				tagIds: selectedTags || [],
				// Garante que os campos de texto não sejam nulos
				resume: post.resume || "",
				// Metadados SEO não são mais obrigatórios
				metadata: post.metadata?.title || post.metadata?.description || post.metadata?.keywords ? {
					title: post.metadata?.title || "",
					description: post.metadata?.description || "",
					keywords: post.metadata?.keywords || "",
				} : undefined,
			};

			// Criar o post primeiro
			const savedPost = await postsService.createPost(postToSave);

			// Se há uma imagem de capa selecionada, fazer o upload
			if (coverImageFile && savedPost.id) {
				try {
					await postsService.uploadCoverImage(savedPost.id, coverImageFile);
					toast.success("Post e imagem salvos com sucesso!");
				} catch (uploadError) {
					console.error("Erro ao fazer upload da imagem:", uploadError);
					toast.warning("Post salvo, mas houve erro no upload da imagem. Você pode tentar novamente na edição.");
				}
			} else {
				toast.success("Post salvo com sucesso!");
			}

			router.push("/admin/blog");
		} catch (error: any) {
			console.error("Erro ao salvar post:", error);
			// Exibe mensagem de erro mais específica se disponível
			const errorMessage =
				error.message ||
				error.response?.data?.message ||
				"Erro ao salvar post. Verifique os dados e tente novamente.";

			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};
 console.log("categories", categories)
	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Novo Post</h1>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => router.push("/admin/blog")}>
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
										value={post.title}
										onChange={(e) => handleChange("title", e.target.value)}
										onBlur={generateSlug}
									/>
								</div>

								<div>
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										value={post.slug || ""}
										onChange={(e) => handleChange("slug", e.target.value)}
									/>
								</div>

								<div>
									<Label htmlFor="resume">Resumo</Label>
									<Textarea
										id="resume"
										value={post.resume || ""}
										onChange={(e) => handleChange("resume", e.target.value)}
										rows={3}
									/>
								</div>

								<div>
									<Label htmlFor="fullUrl">URL Completa</Label>
									<Input
										id="fullUrl"
										value={post.fullUrl || ""}
										onChange={(e) => handleChange("fullUrl", e.target.value)}
										placeholder="/blog/meu-post-slug"
									/>
								</div>

								<div>
									<Label htmlFor="coverImageFile">Imagem de Capa</Label>
									<div className="space-y-3">
										{/* Input de arquivo */}
										<Input
											id="coverImageFile"
											type="file"
											accept="image/*"
											onChange={handleCoverImageChange}
											className="cursor-pointer"
										/>
										
										{/* Preview da imagem */}
										{coverImagePreview && (
											<div className="relative">
												<img
													src={coverImagePreview}
													alt="Preview da imagem de capa"
													className="w-full max-w-md h-48 object-cover rounded-lg border"
												/>
												<Button
													type="button"
													variant="destructive"
													size="sm"
													className="absolute top-2 right-2"
													onClick={removeCoverImage}
												>
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<path d="M18 6 6 18"/>
														<path d="m6 6 12 12"/>
													</svg>
												</Button>
											</div>
										)}
										
										{/* Informações sobre o arquivo */}
										<p className="text-sm text-gray-500">
											Formatos aceitos: JPG, PNG, GIF, WebP, SVG. Tamanho máximo: 5MB
											<br />
											<span className="text-blue-600">As imagens serão automaticamente convertidas para WebP para melhor performance.</span>
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Conteúdo</CardTitle>
						</CardHeader>
						<CardContent>
							{/* <TinyMCEEditor
								value={post.content}
								onChange={(value) => handleChange("content", value)}
								height={500}
								label="Conteúdo do Post"
							/> */}
							<JoditEditorComponent
								onChange={(value) => handleChange("content", value)}
								value={post.content || ""}
							></JoditEditorComponent>
						</CardContent>
					</Card>

					<Tabs defaultValue="categories">
						<TabsList className="mb-4">
							<TabsTrigger value="categories">Categorias</TabsTrigger>
							<TabsTrigger value="tags">Tags</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						<TabsContent value="categories">
							<Card>
								<CardHeader>
									<CardTitle>Categoria (selecione apenas uma)</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{/* Opção para não selecionar categoria */}
										<div className="flex items-center space-x-2">
											<input
												type="radio"
												id="no-category"
												name="category"
												checked={selectedCategories.length === 0}
												onChange={() => {
													setSelectedCategories([]);
													// Atualizar fullUrl quando categoria for removida
													if (post.slug) {
														handleChange("fullUrl", `/blog/${post.slug}`);
													}
												}}
												className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
											/>
											<Label htmlFor="no-category" className="text-gray-600">
												Sem categoria
											</Label>
										</div>
										
										{/* Lista de categorias disponíveis */}
										{categories?.map((category) => (
											<div
												key={category?.id}
												className="flex items-center space-x-2"
											>
												<input
													type="radio"
													id={`category-${category.id}`}
													name="category"
													checked={selectedCategories.includes(category.id)}
													onChange={() => {
														setSelectedCategories([category.id]);
														// Atualizar fullUrl quando categoria for selecionada
														if (post.slug) {
															const categorySlug = category.slug
																.toLowerCase()
																.normalize("NFD")
																.replace(/[\u0300-\u036f]/g, "")
																.replace(/[^\w\s]/g, "")
																.replace(/\s+/g, "-");
															handleChange("fullUrl", `/blog/${categorySlug}/${post.slug}`);
														}
													}}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
												/>
												<Label htmlFor={`category-${category.id}`}>
													{category.name}
												</Label>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="tags">
							<Card>
								<CardHeader>
									<CardTitle>Tags</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										{tags.map((tag) => (
											<div key={tag.id} className="flex items-center space-x-2">
												<Checkbox
													id={`tag-${tag.id}`}
													checked={selectedTags.includes(tag.id)}
													onCheckedChange={(checked) => {
														if (checked) {
															setSelectedTags([...selectedTags, tag.id]);
														} else {
															setSelectedTags(
																selectedTags.filter((id) => id !== tag.id),
															);
														}
													}}
												/>
												<Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

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
												value={post.metadata?.title || ""}
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
												value={post.metadata?.description || ""}
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
												value={post.metadata?.keywords || ""}
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
					</Tabs>
				</div>

				{/* Coluna lateral direita */}
				<div className="space-y-6">
					{/* Status da Publicação */}
					<Card className="  border-none">
						<CardHeader>
							<CardTitle className="">Status da Publicação</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
								</div>
								<span>Atualizado em</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
										<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</div>
								<span>Atualizado por</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity">
										<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
									</svg>
								</div>
								<span>Status</span>
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
								className="w-full border-white  hover:bg-blue-300"
								onClick={() => handleSave("DRAFT")}
								disabled={loading}
							>
								Salvar Rascunho
							</Button>
						</CardContent>
					</Card>

					{/* Categorias */}
					<Card className="  border-none">
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className=" flex items-center">
								Categorias
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag ml-2">
									<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
									<path d="M7 7h.01" />
								</svg>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{selectedCategories.length > 0 ? (
								categories
									.filter(cat => selectedCategories.includes(cat.id))
									.map((category) => (
										<div key={category.id} className="flex items-center space-x-2 bg-sky-200 p-2 rounded">
											
											<span>{category.name}</span>
										</div>
									))
							) : (
								<div className="text-gray-400">Nenhuma categoria selecionada</div>
							)}
							<Button
								variant="outline"
								className="w-full mt-2 border-white  hover:bg-blue-300"
								onClick={() => setShowCategoryModal(true)}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-2">
									<path d="M5 12h14" />
									<path d="M12 5v14" />
								</svg>
								Adicionar Nova Categoria
							</Button>
						</CardContent>
					</Card>

					{/* Tags */}
					<Card className="  border-none">
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className=" flex items-center">
								Tags
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hash ml-2">
									<line x1="4" x2="20" y1="9" y2="9" />
									<line x1="4" x2="20" y1="15" y2="15" />
									<line x1="10" x2="8" y1="3" y2="21" />
									<line x1="16" x2="14" y1="3" y2="21" />
								</svg>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{selectedTags.length > 0 ? (
								tags
									.filter(tag => selectedTags.includes(tag.id))
									.map((tag) => (
										<div key={tag.id} className="flex items-center space-x-2 bg-sky-200 p-2 rounded">
											<span>{tag.name}</span>
										</div>
									))
							) : (
								<div className="text-gray-400">Nenhuma tag selecionada</div>
							)}
							<Button
								variant="outline"
								className="w-full mt-2 border-white  hover:bg-blue-300"
								onClick={() => setShowTagModal(true)}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-2">
									<path d="M5 12h14" />
									<path d="M12 5v14" />
								</svg>
								Adicionar Nova Tag
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Modais */}
			<AddCategoryModal
				open={showCategoryModal}
				onOpenChange={setShowCategoryModal}
				onCategoryAdded={handleCategoryAdded}
			/>

			<AddTagModal
				open={showTagModal}
				onOpenChange={setShowTagModal}
				onTagAdded={handleTagAdded}
			/>
		</div>
	);
}
