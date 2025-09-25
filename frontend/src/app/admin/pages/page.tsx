"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Plus, Search, Trash } from "lucide-react";
import { pagesService, PagesFilter, PagesResponse } from "@/services/pages.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

export default function PagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [response, setResponse] = useState<PagesResponse | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<PagesFilter>({
    page: 1,
    limit: 10,
    search: "",
  });

  useEffect(() => {
    loadPages();
  }, [filter]);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await pagesService.getPages(filter);
      setPages(response.pages);
      setTotalItems(response.total);
      setTotalPages(Math.ceil(response.total / filter.limit));
      setResponse(response);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar páginas:", error);
      toast.error("Erro ao carregar páginas");
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ ...filter, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta página?")) {
      try {
        await pagesService.deletePage(id);
        toast.success("Página excluída com sucesso");
        loadPages();
      } catch (error) {
        console.error("Erro ao excluir página:", error);
        toast.error("Erro ao excluir página");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Páginas</h1>
        <Link href="/admin/pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Página
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Páginas</CardTitle>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Buscar
              </Label>
              <Input
                id="search"
                placeholder="Buscar páginas..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4 mr-2" /> Buscar
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.length > 0 ? (
                    pages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell>{page.slug}</TableCell>
                        <TableCell>
                          <Badge variant={page.status?.name === "Publicado" ? "default" : "outline"}>
                            {page.status?.name || "Rascunho"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {page.updated_at
                            ? format(new Date(page.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/pages/${page.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                              <Link href={`/admin/pages/${page.id}`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(page.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhuma página encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {pages.length} de {totalItems} páginas
                  </p>
                  <Pagination>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(filter.page - 1)}
                      disabled={filter.page === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center mx-2">
                      <span className="text-sm">
                        Página {filter.page} de {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(filter.page + 1)}
                      disabled={!response?.nextPage}
                    >
                      Próximo
                    </Button>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}