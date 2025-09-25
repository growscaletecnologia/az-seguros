"use client";

import { type Post, postsService } from "@/services/posts.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";

/**
 * Página pública de visualização de post individual por slug
 */
export default function BlogPostPage({ params }: { params: { slug: string } }) {
	const router = useRouter();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Carrega o post pelo slug
	useEffect(() => {
		const loadPost = async () => {
			try {
				setLoading(true);
				const data = await postsService.getPostBySlug(params.slug);
				setPost(data);
			} catch (error) {
				console.error("Erro ao carregar post:", error);
				setError("Post não encontrado ou indisponível.");
			} finally {
				setLoading(false);
			}
		};

		loadPost();
	}, [params.slug]);

	// Função para obter a URL da imagem principal do post
	const getMainImageUrl = (post: Post) => {
		const mainImage = post.media?.find((media) => media.isMain);
		return mainImage?.url || "/images/blog-placeholder.jpg";
	};

	// Função para formatar a data
	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
			locale: ptBR,
		});
	};

	if (loading) {
		return (
			<div className="container mx-auto py-12">
				<div className="flex justify-center items-center min-h-[50vh]">
					<p className="text-lg">Carregando post...</p>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="container mx-auto py-12">
				<div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
					<h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
					<p className="text-muted-foreground mb-6">
						{error ||
							"O post que você está procurando não existe ou foi removido."}
					</p>
					<Button onClick={() => router.push("/blog")}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para o Blog
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-12">
			<div className="mb-6">
				<Button variant="ghost" onClick={() => router.push("/blog")}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Voltar para o Blog
				</Button>
			</div>

			<article className="max-w-4xl mx-auto">
				<header className="mb-8">
					<div className="flex flex-wrap gap-2 mb-4">
						{post.categories.map((pc) => (
							<Badge key={pc.category.id} variant="outline">
								{pc.category.name}
							</Badge>
						))}
					</div>

					<h1 className="text-4xl font-bold mb-4">{post.title}</h1>

					<div className="flex items-center text-muted-foreground mb-6">
						<div className="flex items-center mr-6">
							<User className="mr-2 h-4 w-4" />
							<span>{post.user?.name || "Autor"}</span>
						</div>
						<div className="flex items-center">
							<Calendar className="mr-2 h-4 w-4" />
							<span>{formatDate(post.publishedAt || post.createdAt)}</span>
						</div>
					</div>
				</header>

				{post.media && post.media.some((m) => m.isMain) && (
					<div className="mb-8">
						<img
							src={getMainImageUrl(post)}
							alt={post.title}
							className="w-full h-auto rounded-lg"
						/>
					</div>
				)}

				<div
					className="prose prose-lg max-w-none"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				<footer className="mt-12 pt-6 border-t">
					<div className="flex flex-wrap gap-2">
						{post.tags.map((pt) => (
							<Badge key={pt.tag.id} variant="secondary">
								{pt.tag.name}
							</Badge>
						))}
					</div>
				</footer>
			</article>
		</div>
	);
}
