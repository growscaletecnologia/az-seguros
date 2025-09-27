"use client";

// Adicionando configuração para evitar pré-renderização no servidor
export const dynamic = "force-dynamic";
export const runtime = "edge";

import JoditEditorComponent from "@/components/Inputs/JoditEditor";
import { TinyMCEEditor } from "@/components/Inputs/TinyMCEEditor";
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
	type PostCategory,
	type PostTag,
	postsService,
} from "@/services/posts.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Página de criação de novos posts
 */
export default function NovoBlogPostPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState<PostCategory[]>([]);
	const [tags, setTags] = useState<PostTag[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const [post, setPost] = useState<CreatePostDTO>({
		title: "",
		content: "",
		resume: "",
		status: "DRAFT",
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
				setCategories(categoriesData);
				setTags(tagsData);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
			}
		};

		loadData();
	}, []);

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
				categoryIds: selectedCategories || [],
				tagIds: selectedTags || [],
				// Garante que os campos de texto não sejam nulos
				resume: post.resume || "",
				metadata: {
					title: post.metadata?.title || "",
					description: post.metadata?.description || "",
					keywords: post.metadata?.keywords || "",
				},
			};

			const savedPost = await postsService.createPost(postToSave);

			toast.success("Post salvo com sucesso!");
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
									<CardTitle>Categorias</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										{categories?.map((category) => (
											<div
												key={category?.id}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`category-${category.id}`}
													checked={selectedCategories.includes(category.id)}
													onCheckedChange={(checked) => {
														if (checked) {
															setSelectedCategories([
																...selectedCategories,
																category.id,
															]);
														} else {
															setSelectedCategories(
																selectedCategories.filter(
																	(id) => id !== category.id,
																),
															);
														}
													}}
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
								className="w-full border-white  hover:bg-gray-800"
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
										<div key={category.id} className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
											<div className="w-4 h-4 bg-gray-600 rounded"></div>
											<span>{category.name}</span>
										</div>
									))
							) : (
								<div className="text-gray-400">Nenhuma categoria selecionada</div>
							)}
							<Button 
								variant="outline" 
								className="w-full mt-2 border-white  hover:bg-gray-800"
								onClick={() => router.push("/admin/blog/categorias")}
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
										<div key={tag.id} className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
											<span>{tag.name}</span>
										</div>
									))
							) : (
								<div className="text-gray-400">Nenhuma tag selecionada</div>
							)}
							<Button 
								variant="outline" 
								className="w-full mt-2 border-white  hover:bg-gray-800"
								onClick={() => router.push("/admin/blog/tags")}
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
		</div>
	);
}
