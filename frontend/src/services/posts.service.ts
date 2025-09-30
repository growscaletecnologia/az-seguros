import { api } from '@/lib/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostCategory {
  postId: string;
  categoryId: string;
  createdAt: string;
  category: Category;
  slug?:string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostTag {
  postId: string;
  tagId: string;
  createdAt: string;
  tag: Tag;
}

export interface PostMedia {
  id: string;
  postId: string;
  url: string;
  type: string;
  title: string;
  alt: string;
  order: number;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface PostUser {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  resume: string;
  content: string;
  userId: string;
  metadata: PostMetadata;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fullUrl?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  publishedAt?: string;
  categories: PostCategory[];
  tags: PostTag[];
  media: PostMedia[];
  user: PostUser;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  nextPage: number | null;
}

export interface CreatePostDTO {
  title: string;
  slug?: string;
  content: string;
  resume?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryIds?: string[];
  tagIds?: string[];
  fullUrl?: string;
  coverImage?: string;
  // metadata?: {
  //   title?: string;
  //   description?: string;
  //   keywords?: string;
  // };
}

export interface UpdatePostDTO extends Partial<CreatePostDTO> {
  //id: string;
}

export interface PostsFilter {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Serviço para gerenciamento de posts
 */
export const postsService = {
  /**
   * Busca posts publicados (acesso público)
   */
  async getPublishedPosts(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const { data } = await api.get(`/posts/public?${params.toString()}`);
    return data;
  },

  /**
   * Busca posts por status (área administrativa)
   */
  async getPostsByStatus(status: string, page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const { data } = await api.get(`/posts/status/${status}?${params.toString()}`);
    return data;
  },

  /**
   * Busca todos os posts com filtros opcionais
   */
  async getPosts(filters: PostsFilter = {}): Promise<PostsResponse> {
    const { data } = await api.get('/posts', { params: filters });
    return data;
  },

  /**
   * Busca um post pelo ID
   */
  async getPostById(id: string) {
    const { data } = await api.get(`/posts/${id}`);
    return data;
  },

  /**
   * Busca um post pelo slug
   */
  async getPostBySlug(slug: string) {
    const { data } = await api.get(`/posts/slug/${slug}`);
    return data;
  },

  /**
   * Cria um novo post
   */
  async createPost(post: CreatePostDTO) {
    try {
      const { data } = await api.post('/posts', post);
      return data;
    } catch (error: any) {
      // Extrai a mensagem de erro da resposta da API
      const errorMessage = error.response?.data?.message || 
                          'Erro ao criar post. Verifique os dados e tente novamente.';
      
      // Adiciona informações de debug ao console
      console.error('Erro ao criar post:', {
        status: error.response?.status,
        message: errorMessage,
        details: error.response?.data
      });
      
      // Rejeita a promise com o erro tratado
      throw {
        message: errorMessage,
        status: error.response?.status || 500,
        response: error.response,
        originalError: error
      };
    }
  },

  /**
   * Atualiza um post existente
   */
  async updatePost(id: string, post: UpdatePostDTO) {
    const { data } = await api.put(`/posts/${id}`, post);
    return data;
  },

  /**
   * Remove um post
   */
  async deletePost(id: string) {
    await api.delete(`/posts/${id}`);
  },

  /**
   * Faz upload da imagem de capa do post
   */
  async uploadCoverImage(postId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post(`/posts/${postId}/upload-cover-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Faz upload da imagem principal do post
   */
  async uploadMainImage(postId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post(`/posts/${postId}/upload-main-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },

  /**
   * Faz upload de múltiplas imagens para a galeria do post
   */
  async uploadGallery(postId: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const { data } = await api.post(`/posts/${postId}/upload-gallery`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },

  /**
   * Remove uma mídia do post
   */
  async removeMedia(postId: string, mediaId: string) {
    await api.delete(`/posts/${postId}/media/${mediaId}`);
  },

  /**
   * Busca todas as categorias de posts
   */
  async getCategories() {
    const { data } = await api.get('/categories');
    return data || [];
  },

  /**
   * Busca todas as tags de posts
   */
  async getTags() {
    const { data } = await api.get('/tags/all-no-limit');
    return data || [];
  }
};

export default postsService;