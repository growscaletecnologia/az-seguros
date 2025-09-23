import { api } from '@/lib/api';

export interface PostCategory {
  id: string;
  name: string;
}

export interface PostTag {
  id: string;
  name: string;
}

export interface PostMedia {
  id: string;
  url: string;
  isMain: boolean;
}

export interface PostMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  resume: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  categories: PostCategory[];
  tags: PostTag[];
  media: PostMedia[];
  metadata: PostMetadata;
}

export interface CreatePostDTO {
  title: string;
  slug?: string;
  content: string;
  resume?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryIds?: string[];
  tagIds?: string[];
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export interface UpdatePostDTO extends Partial<CreatePostDTO> {
  id: string;
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
   * Busca todos os posts com filtros opcionais
   */
  async getPosts(filters: PostsFilter = {}) {
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
    const { data } = await api.post('/posts', post);
    return data;
  },

  /**
   * Atualiza um post existente
   */
  async updatePost(id: string, post: UpdatePostDTO) {
    const { data } = await api.patch(`/posts/${id}`, post);
    return data;
  },

  /**
   * Remove um post
   */
  async deletePost(id: string) {
    await api.delete(`/posts/${id}`);
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
    return data;
  },

  /**
   * Busca todas as tags de posts
   */
  async getTags() {
    const { data } = await api.get('/tags');
    return data;
  }
};

export default postsService;