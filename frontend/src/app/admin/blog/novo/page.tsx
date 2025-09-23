"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TinyMCEEditor } from "@/components/Inputs/TinyMCEEditor";
import { postsService, CreatePostDTO, PostCategory, PostTag } from "@/services/posts.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

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
      keywords: ""
    }
  });

  // Carrega categorias e tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          postsService.getCategories(),
          postsService.getTags()
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
    setPost(prev => ({ ...prev, [field]: value }));
  };

  // Atualiza os metadados do post
  const handleMetadataChange = (field: string, value: string) => {
    setPost(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata!,
        [field]: value
      }
    }));
  };

  // Gera um slug a partir do título
  const generateSlug = () => {
    if (!post.title) return;
    
    const slug = post.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    handleChange('slug', slug);
  };

  // Salva o post
  const handleSave = async (status: 'DRAFT' | 'PUBLISHED' = 'DRAFT') => {
    try {
      setLoading(true);
      
      // Atualiza o status antes de salvar
      const postToSave: CreatePostDTO = {
        ...post,
        status,
        categoryIds: selectedCategories,
        tagIds: selectedTags
      };
      
      const savedPost = await postsService.createPost(postToSave);
      
      alert("Post salvo com sucesso!");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      alert("Erro ao salvar post. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Novo Post</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push("/admin/blog")}
          >
            Cancelar
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSave('DRAFT')}
            disabled={loading}
          >
            Salvar como Rascunho
          </Button>
          <Button 
            onClick={() => handleSave('PUBLISHED')}
            disabled={loading}
          >
            Publicar
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
                  onChange={(e) => handleChange('title', e.target.value)}
                  onBlur={generateSlug}
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="resume">Resumo</Label>
                <Textarea
                  id="resume"
                  value={post.resume || ''}
                  onChange={(e) => handleChange('resume', e.target.value)}
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
            <TinyMCEEditor
              value={post.content}
              onChange={(value) => handleChange('content', value)}
              height={500}
              label="Conteúdo do Post"
            />
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
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                      />
                      <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
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
                            setSelectedTags(selectedTags.filter(id => id !== tag.id));
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
                      value={post.metadata?.title || ''}
                      onChange={(e) => handleMetadataChange('title', e.target.value)}
                      placeholder="Título para SEO (recomendado: até 60 caracteres)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meta-description">Descrição SEO</Label>
                    <Textarea
                      id="meta-description"
                      value={post.metadata?.description || ''}
                      onChange={(e) => handleMetadataChange('description', e.target.value)}
                      placeholder="Descrição para SEO (recomendado: até 160 caracteres)"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meta-keywords">Palavras-chave</Label>
                    <Input
                      id="meta-keywords"
                      value={post.metadata?.keywords || ''}
                      onChange={(e) => handleMetadataChange('keywords', e.target.value)}
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