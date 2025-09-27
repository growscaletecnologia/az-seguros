"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type Post,
	type PostsFilter,
	type PostsResponse,
	postsService,
} from "@/services/posts.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Página de listagem de posts para administração
 */
export default function BlogAdminPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<PostsFilter>({
		status: "PUBLISHED",
		page: 1,
		limit: 10,
	});
	const [search, setSearch] = useState("");
	const [totalPosts, setTotalPosts] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [response, setResponse] = useState<PostsResponse | null>(null);

	// Carrega os posts com base nos filtros
	const loadPosts = async () => {
		try {
			setLoading(true);
			const response = await postsService.getPosts({
				...filter,
				search: search.length > 2 ? search : undefined,
			});
			console.log("POSTS AQUI", response);
			setPosts(response.posts);
			setTotalPosts(response.total || 0);
			setTotalPages(Math.ceil(response.total / filter.limit!));
			setResponse(response);
		} catch (error) {
			console.error("Erro ao carregar posts:", error);
		} finally {
			setLoading(false);
		}
	};

	// Carrega os posts quando os filtros mudam
	useEffect(() => {
		loadPosts();
	}, [filter]);

	// Manipula a pesquisa
	const handleSearch = () => {
		setFilter({ ...filter, page: 1 });
	};

	// Formata o status do post para exibição
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "PUBLISHED":
				return <Badge className="bg-green-500">Publicado</Badge>;
			case "DRAFT":
				return <Badge className="bg-yellow-500">Rascunho</Badge>;
			case "ARCHIVED":
				return <Badge className="bg-gray-500">Arquivado</Badge>;
			default:
				return <Badge>{status}</Badge>;
		}
	};

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Gerenciamento de Blog</h1>
				<Link href="/admin/blog/novo">
					<Button>Novo Post</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Posts</CardTitle>
					<div className="flex gap-4 mt-4">
						<Input
							placeholder="Pesquisar posts..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="max-w-sm"
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						/>
						<Button onClick={handleSearch}>Buscar</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs
						defaultValue="PUBLISHED"
						onValueChange={(value) =>
							setFilter({ ...filter, status: value as any, page: 1 })
						}
					>
						<TabsList className="mb-4">
							<TabsTrigger value="PUBLISHED">Publicados</TabsTrigger>
							<TabsTrigger value="DRAFT">Rascunhos</TabsTrigger>
							<TabsTrigger value="ARCHIVED">Arquivados</TabsTrigger>
						</TabsList>

						{loading ? (
							<div className="flex justify-center py-8">Carregando...</div>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Título</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Data de criação</TableHead>
											<TableHead>Última atualização</TableHead>
											<TableHead className="text-right">Ações</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{posts?.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="text-center py-8">
													Nenhum post encontrado
												</TableCell>
											</TableRow>
										) : (
											posts?.map((post) => {
												// Extrair as categorias e tags da nova estrutura aninhada
												const categories = post.categories.map(
													(pc) => pc.category,
												);
												const tags = post.tags.map((pt) => pt.tag);

												return (
													<TableRow key={post.id}>
														<TableCell className="font-medium">
															{post.title}
														</TableCell>
														<TableCell>{getStatusBadge(post.status)}</TableCell>
														<TableCell>
															{format(
																new Date(post.createdAt),
																"dd/MM/yyyy HH:mm",
																{ locale: ptBR },
															)}
														</TableCell>
														<TableCell>
															{format(
																new Date(post.updatedAt),
																"dd/MM/yyyy HH:mm",
																{ locale: ptBR },
															)}
														</TableCell>
														<TableCell className="text-right">
															<div className="flex justify-end gap-2">
																<Link href={`/admin/blog/editar/${post.id}`}>
																	<Button variant="outline" size="sm">
																		Editar
																	</Button>
																</Link>
																<Link
																	href={`/blog/${post.slug}`}
																	target="_blank"
																>
																	<Button variant="outline" size="sm">
																		Visualizar
																	</Button>
																</Link>
																{/* <Button
																	variant="destructive"
																	size="sm"
																	onClick={async () => {
																		if (
																			confirm(
																				"Tem certeza que deseja excluir este post?",
																			)
																		) {
																			try {
																				await postsService.deletePost(post.id);
																				loadPosts();
																			} catch (error) {
																				console.error(
																					"Erro ao excluir post:",
																					error,
																				);
																				alert("Erro ao excluir post");
																			}
																		}
																	}}
																>
																	Excluir
																</Button> */}
															</div>
														</TableCell>
													</TableRow>
												);
											})
										)}
									</TableBody>
								</Table>

								<div className="flex items-center justify-between mt-4">
									<div className="text-sm text-gray-500">
										Mostrando {posts?.length || 0} de {totalPosts} posts
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											disabled={filter.page === 1}
											onClick={() =>
												setFilter({ ...filter, page: filter.page! - 1 })
											}
										>
											Anterior
										</Button>
										<Button
											variant="outline"
											size="sm"
											disabled={!response?.nextPage}
											onClick={() =>
												setFilter({ ...filter, page: filter.page! + 1 })
											}
										>
											Próximo
										</Button>
									</div>
								</div>
							</>
						)}
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
