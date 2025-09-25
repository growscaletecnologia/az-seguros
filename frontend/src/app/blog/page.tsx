"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { postsService, Post, PostsFilter } from "@/services/posts.service";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

/**
 * Página pública de listagem de posts do blog
 */
export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PostsFilter>({
    status: "PUBLISHED", // Apenas posts publicados na área pública
    page: 1,
    limit: 9,
  });
  const [search, setSearch] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Carrega os posts com base nos filtros
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsService.getPosts({
        ...filter,
        search: search.length > 2 ? search : undefined,
      });
      setPosts(response.posts);
      setTotalPosts(response.total || 0);
      setTotalPages(Math.ceil(response.total / filter.limit!));
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

  // Função para buscar posts
  const handleSearch = () => {
    setFilter({ ...filter, page: 1 });
  };

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  // Função para obter a URL da imagem principal do post
  const getMainImageUrl = (post: Post) => {
    const mainImage = post.media?.find(media => media.isMain);
    return mainImage?.url || "/images/blog-placeholder.jpg";
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Confira as últimas notícias, dicas e informações sobre seguros de viagem
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md flex gap-2">
          <Input
            placeholder="Pesquisar no blog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>Buscar</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-lg">Carregando posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg">Nenhum post encontrado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const mainImageUrl = getMainImageUrl(post);
              const categories = post.categories.map(pc => pc.category);
              
              return (
                <Link href={`/blog/${post.slug}`} key={post.id}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={mainImageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categories.slice(0, 3).map((category) => (
                          <Badge key={category.id} variant="outline">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.resume || post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4 text-sm text-muted-foreground">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination
                currentPage={filter.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}