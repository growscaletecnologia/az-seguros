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
    <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Blog</h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Confira as últimas notícias, dicas e informações sobre seguros de viagem
        </p>
      </div>

      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-full max-w-md flex gap-2">
          <Input
            placeholder="Pesquisar no blog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} className="h-10">Buscar</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6 sm:py-8 md:py-12">
          <p className="text-base sm:text-lg">Carregando posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-6 sm:py-8 md:py-12">
          <p className="text-base sm:text-lg">Nenhum post encontrado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
                        {categories.slice(0, 2).map((category) => (
                          <Badge key={category.id} variant="outline" className="text-xs sm:text-sm">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2 text-base sm:text-lg md:text-xl">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm">
                        {post.resume || post.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-2 sm:pt-4 p-3 sm:p-4 md:p-6 text-xs sm:text-sm text-muted-foreground">
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