"use client";

import { TinyMCEEditor } from "@/components/Inputs/TinyMCEEditor";
import RichTextEditor from "@/components/Inputs/RichTextEditor";
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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import JoditEditorComponent from "@/components/Inputs/JoditEditor";

/**
 * Página de edição de posts existentes
 */
export default function EditarBlogPostPage({
	params,
}: { params: { id: string } }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [post, setPost] = useState<Post | null>(null);
	const [categories, setCategories] = useState<PostCategory[]>([]);
	const [tags, setTags] = useState<PostTag[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	
	// Desembrulha o objeto params usando React.use()
	const resolvedParams = React.use(params);
	const postId = resolvedParams.id;

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
				setCategories(categoriesData);
				setTags(tagsData);

				// Configura as categorias e tags selecionadas
				setSelectedCategories(postData.categories.map((cat) => cat.id));
				setSelectedTags(postData.tags.map((tag) => tag.id));
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast.error("Erro ao carregar o post. Verifique se o ID é válido.");
				router.push("/admin/blog");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [params.id, router]);

	// Atualiza o estado do post
	const handleChange = (field: keyof UpdatePostDTO, value: any) => {
		if (!post) return;
		setPost({ ...post, [field]: value } as Post);
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
	};

	// Salva as alterações do post
	const handleSave = async (status?: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
		if (!post) return;

		try {
			setSaving(true);

			const updateData: UpdatePostDTO = {
				id: post.id,
				title: post.title,
				slug: post.slug,
				content: post.content,
				resume: post.resume,
				status: status || post.status,
				categoryIds: selectedCategories,
				tagIds: selectedTags,
				metadata: post.metadata,
			};

			await postsService.updatePost(post.id, updateData);

			alert("Post atualizado com sucesso!");
			router.push("/admin/blog");
		} catch (error) {
			console.error("Erro ao atualizar post:", error);
			alert("Erro ao atualizar post. Verifique os dados e tente novamente.");
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
												src={media.url}
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
						<TabsTrigger value="seo">SEO</TabsTrigger>
					</TabsList>

					<TabsContent value="categories">
						<Card>
							<CardHeader>
								<CardTitle>Categorias</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{categories.map((category) => (
										<div
											key={category.id}
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
		</div>
	);
}
