"use client";

import JoditEditorComponent from "@/components/Inputs/JoditEditor";
import { TinyMCEEditor } from "@/components/Inputs/TinyMCEEditor";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { AddTagModal } from "@/components/modals/AddTagModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	type Post,
	type PostCategory,
	type PostTag,
	type UpdatePostDTO,
	postsService,
} from "@/services/posts.service";
import {
	buildImageUrl,
	convertToWebP,
	generateImagePreview,
	validateImageFile,
} from "@/utils/imageUtils";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Página de edição de posts existentes
 */
export default function EditarBlogPostPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [post, setPost] = useState<Post | null>(null);
	const [categories, setCategories] = useState<PostCategory[]>([]);
	const [tags, setTags] = useState<PostTag[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [showTagModal, setShowTagModal] = useState(false);

	// Estados para upload de imagem de capa
	const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
	const [coverImagePreview, setCoverImagePreview] = useState<string>("");

	// Desembrulha os parâmetros usando React.use()
	const { id: postId } = React.use(params);

	// Carrega o post e dados relacionados
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const [postData, categoriesData, tagsData] = await Promise.all([
					postsService.getPostById(postId),
					postsService.getCategories(),
					postsService.getTags(),
				]);

				setPost(postData);
				setCategories(categoriesData?.categories || []);
				setTags(tagsData?.tags || []);

				// Configura as categorias e tags selecionadas
				const postCategories =
					postData.categories?.map((cat: any) => cat.id) || [];
				const postTags = postData.tags?.map((tag: any) => tag.id) || [];

				// Se não há categorias selecionadas, usar a primeira categoria disponível
				if (
					postCategories.length === 0 &&
					categoriesData?.categories?.length > 0
				) {
					setSelectedCategories([categoriesData.categories[0].id]);
				} else {
					setSelectedCategories(postCategories);
				}

				setSelectedTags(postTags);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast.error("Erro ao carregar o post. Verifique se o ID é válido.");
				router.push("/admin/blog");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [postId, router]);

	// Atualiza o estado do post
	const handleChange = (field: keyof UpdatePostDTO, value: any) => {
		if (!post) return;
		setPost({ ...post, [field]: value } as Post);
	};

	/**
	 * Manipula a seleção de arquivo de imagem de capa com conversão automática para WebP
	 */
	const handleCoverImageChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
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
			if (file.type !== "image/svg+xml") {
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
		const fileInput = document.getElementById(
			"coverImageFile",
		) as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	// Atualiza os metadados do post
	const handleMetadataChange = (field: string, value: string) => {
		if (!post) return;
		setPost({
			...post,
			metadata: {
				...post.metadata,
				[field]: value,
			},
		});
	};

	// Gera um slug a partir do título
	const generateSlug = () => {
		if (!post?.title) return;

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
		const currentSlug = slug || post?.slug;
		if (!currentSlug) return;

		// Se há categorias selecionadas, usar a primeira categoria
		if (selectedCategories.length > 0) {
			const firstCategory = categories.find(
				(cat) => cat.id === selectedCategories[0],
			);
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

	// Recarrega as categorias após adicionar uma nova
	const reloadCategories = async () => {
		try {
			const categoriesData = await postsService.getCategories();
			setCategories(categoriesData);
		} catch (error) {
			console.error("Erro ao recarregar categorias:", error);
		}
	};

	// Recarrega as tags após adicionar uma nova
	const reloadTags = async () => {
		try {
			const tagsData = await postsService.getTags();
			setTags(tagsData);
		} catch (error) {
			console.error("Erro ao recarregar tags:", error);
		}
	};

	// Callback para quando uma nova categoria é adicionada
	const handleCategoryAdded = (newCategory: PostCategory) => {
		setCategories([...categories, newCategory]);
		setSelectedCategories([...selectedCategories, newCategory.id]);
		setShowCategoryModal(false);
	};

	// Callback para quando uma nova tag é adicionada
	const handleTagAdded = (newTag: PostTag) => {
		setTags([...tags, newTag]);
		setSelectedTags([...selectedTags, newTag.id]);
		setShowTagModal(false);
	};

	/**
	 * Função específica para upload de imagem sem alterar outros dados
	 */
	const handleImageUpload = async () => {
		if (!coverImageFile) {
			toast.error("Selecione uma imagem primeiro.");
			return;
		}

		try {
			setSaving(true);
			await postsService.uploadCoverImage(post.id, coverImageFile);
			toast.success("Imagem de capa atualizada com sucesso!");

			// Recarregar os dados do post para mostrar a nova imagem
			const updatedPost = await postsService.getPostById(post.id);
			setPost(updatedPost);
			setCoverImageFile(null);
			setCoverImagePreview("");
		} catch (error) {
			console.error("Erro ao fazer upload da imagem:", error);
			toast.error("Erro ao fazer upload da imagem.");
		} finally {
			setSaving(false);
		}
	};

	// Salva as alterações do post
	const handleSave = async (status?: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
		if (!post) return;

		try {
			setSaving(true);

			// Validações básicas antes de salvar
			if (status === "PUBLISHED") {
				if (!post.title?.trim()) {
					toast.error("O título é obrigatório para publicar o post.");
					return;
				}
				if (!post.slug?.trim()) {
					toast.error("O slug é obrigatório para publicar o post.");
					return;
				}
				if (!post.content?.trim()) {
					toast.error("O conteúdo é obrigatório para publicar o post.");
					return;
				}
			}

			const updateData: UpdatePostDTO = {
				//id: post.id,
				title: post.title,
				slug: post.slug,
				content: post.content,
				resume: post.resume,
				status: status || post.status,
				categoryIds:
					selectedCategories.length > 0
						? selectedCategories.filter((id) => id !== null && id !== undefined)
						: categories.length > 0
							? [categories[0].id]
							: [],
				tagIds:
					selectedTags.length > 0
						? selectedTags.filter((id) => id !== null && id !== undefined)
						: [],
				//metadata: post.metadata,
			};

			await postsService.updatePost(post.id, updateData);

			// Se há uma nova imagem de capa selecionada, fazer upload
			if (coverImageFile) {
				try {
					await postsService.uploadCoverImage(post.id, coverImageFile);
					toast.success("Post e imagem de capa atualizados com sucesso!");
				} catch (uploadError) {
					console.error("Erro ao fazer upload da imagem:", uploadError);
					toast.error("Post atualizado, mas houve erro no upload da imagem.");
				}
			} else {
				toast.success("Post atualizado com sucesso!");
			}

			router.push("/admin/blog");
		} catch (error: any) {
			console.error("Erro ao atualizar post:", error);
			// Tratamento específico para diferentes tipos de erro
			if (error?.response?.status === 409) {
				toast.error(
					"Este slug já está sendo usado por outro post. Escolha um slug diferente.",
				);
			} else if (error?.response?.status === 422) {
				toast.error("Dados inválidos. Verifique os campos obrigatórios.");
			} else {
				toast.error(
					"Erro ao atualizar post. Verifique os dados e tente novamente.",
				);
			}
		} finally {
			setSaving(false);
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

	if (!post) {
		return (
			<div className="container mx-auto py-6">
				<div className="flex justify-center items-center h-64">
					<p>Post não encontrado</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Editar Post</h1>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => router.push("/admin/blog")}>
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
					<Button
						variant="destructive"
						onClick={() => handleSave("ARCHIVED")}
						disabled={saving}
					>
						Arquivar
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6">
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
									value={post.slug}
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

							{/* Seção de Upload de Imagem de Capa */}
							<div>
								<Label htmlFor="coverImageFile">Imagem de Capa</Label>
								<div className="space-y-2">
									<Input
										id="coverImageFile"
										type="file"
										accept="image/*"
										onChange={handleCoverImageChange}
										className="cursor-pointer"
									/>
									<p className="text-sm text-gray-500">
										Formatos aceitos: JPG, PNG, GIF, WebP, SVG. Tamanho máximo:
										5MB
										<br />
										<span className="text-blue-600">
											As imagens serão automaticamente convertidas para WebP
											para melhor performance.
										</span>
									</p>

									{/* Preview da nova imagem selecionada */}
									{coverImagePreview && (
										<div className="space-y-2">
											<div className="relative inline-block">
												<img
													src={coverImagePreview}
													alt="Preview da imagem de capa"
													className="w-32 h-32 object-cover rounded-md border"
												/>
												<Button
													type="button"
													variant="destructive"
													size="sm"
													className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
													onClick={removeCoverImage}
												>
													×
												</Button>
											</div>
											{/* Botão para upload apenas da imagem */}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={handleImageUpload}
												disabled={saving}
												className="flex items-center gap-2"
											>
												{saving ? (
													<>
														<div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
														Enviando...
													</>
												) : (
													<>
														<Upload className="w-4 h-4" />
														Atualizar apenas imagem
													</>
												)}
											</Button>
										</div>
									)}

									{/* Mostrar imagem atual se não há nova selecionada */}
									{!coverImagePreview && post.coverImage && (
										<div className="relative inline-block">
											<img
												src={buildImageUrl(post.coverImage)}
												alt="Imagem de capa atual"
												className="w-32 h-32 object-cover rounded-md border"
											/>
											<p className="text-sm text-gray-500 mt-1">Imagem atual</p>
										</div>
									)}
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

				<Card>
					<CardHeader>
						<CardTitle>Mídia</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Imagens do Post</h3>

							{post.media && post.media.length > 0 ? (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{post.media.map((media) => (
										<div key={media.id} className="relative group">
											<img
												src={buildImageUrl(media.url)}
												alt="Mídia do post"
												className={`w-full h-32 object-cover rounded-md ${media.isMain ? "ring-2 ring-blue-500" : ""}`}
											/>
											<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
												{!media.isMain && (
													<Button
														size="sm"
														variant="secondary"
														onClick={async () => {
															try {
																// Aqui você implementaria a lógica para definir como imagem principal
																alert(
																	"Funcionalidade para definir imagem principal será implementada em breve",
																);
															} catch (error) {
																console.error("Erro:", error);
															}
														}}
													>
														Definir como principal
													</Button>
												)}
												<Button
													size="sm"
													variant="destructive"
													onClick={async () => {
														if (
															confirm(
																"Tem certeza que deseja remover esta imagem?",
															)
														) {
															try {
																await postsService.removeMedia(
																	post.id,
																	media.id,
																);
																// Recarrega o post para atualizar as mídias
																const updatedPost =
																	await postsService.getPostById(post.id);
																setPost(updatedPost);
															} catch (error) {
																console.error("Erro ao remover mídia:", error);
																alert("Erro ao remover mídia");
															}
														}
													}}
												>
													Remover
												</Button>
											</div>
											{media.isMain && (
												<span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
													Principal
												</span>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500">Nenhuma imagem adicionada</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Tabs defaultValue="categories">
					<TabsList className="mb-4">
						<TabsTrigger value="categories">Categorias</TabsTrigger>
						<TabsTrigger value="tags">Tags</TabsTrigger>
					</TabsList>

					<TabsContent value="categories">
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>Categoria (selecione apenas uma)</CardTitle>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowCategoryModal(true)}
									>
										Adicionar Nova Categoria
									</Button>
								</div>
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
												if (post?.slug) {
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
									{categories.map((category) => (
										<div
											key={category.id}
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
													if (post?.slug) {
														const categorySlug = category.slug
															.toLowerCase()
															.normalize("NFD")
															.replace(/[\u0300-\u036f]/g, "")
															.replace(/[^\w\s]/g, "")
															.replace(/\s+/g, "-");
														handleChange(
															"fullUrl",
															`/blog/${categorySlug}/${post.slug}`,
														);
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
								<div className="flex justify-between items-center">
									<CardTitle>Tags</CardTitle>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowTagModal(true)}
									>
										Adicionar Nova Tag
									</Button>
								</div>
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
				</Tabs>
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
