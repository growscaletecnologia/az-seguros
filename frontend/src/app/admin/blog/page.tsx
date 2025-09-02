'use client'
import React, { useState } from 'react';

interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  autor: string;
  dataPublicacao: string;
  status: 'publicado' | 'rascunho';
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      titulo: 'Como escolher o melhor seguro viagem',
      conteudo: 'Conteúdo do post sobre seguro viagem...',
      autor: 'Admin',
      dataPublicacao: '2024-01-15',
      status: 'publicado'
    }
  ]);

  const [novoPost, setNovoPost] = useState({
    titulo: '',
    conteudo: '',
    autor: 'Admin',
    status: 'rascunho' as 'publicado' | 'rascunho'
  });

  const [editandoPost, setEditandoPost] = useState<BlogPost | null>(null);

  const criarPost = () => {
    const post: BlogPost = {
      id: Date.now(),
      ...novoPost,
      dataPublicacao: new Date().toISOString().split('T')[0]
    };
    setPosts([...posts, post]);
    setNovoPost({ titulo: '', conteudo: '', autor: 'Admin', status: 'rascunho' });
    alert('Post criado com sucesso!');
  };

  const editarPost = (post: BlogPost) => {
    setEditandoPost(post);
  };

  const salvarEdicao = () => {
    if (editandoPost) {
      setPosts(posts.map(p => p.id === editandoPost.id ? editandoPost : p));
      setEditandoPost(null);
      alert('Post atualizado com sucesso!');
    }
  };

  const excluirPost = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter(p => p.id !== id));
      alert('Post excluído com sucesso!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Blog</h1>
      
      {/* Formulário para criar/editar post */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editandoPost ? 'Editar Post' : 'Criar Novo Post'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editandoPost ? editandoPost.titulo : novoPost.titulo}
              onChange={(e) => {
                if (editandoPost) {
                  setEditandoPost({ ...editandoPost, titulo: e.target.value });
                } else {
                  setNovoPost({ ...novoPost, titulo: e.target.value });
                }
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Conteúdo</label>
            <textarea
              className="w-full p-2 border rounded h-32"
              value={editandoPost ? editandoPost.conteudo : novoPost.conteudo}
              onChange={(e) => {
                if (editandoPost) {
                  setEditandoPost({ ...editandoPost, conteudo: e.target.value });
                } else {
                  setNovoPost({ ...novoPost, conteudo: e.target.value });
                }
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full p-2 border rounded"
              value={editandoPost ? editandoPost.status : novoPost.status}
              onChange={(e) => {
                const status = e.target.value as 'publicado' | 'rascunho';
                if (editandoPost) {
                  setEditandoPost({ ...editandoPost, status });
                } else {
                  setNovoPost({ ...novoPost, status });
                }
              }}
            >
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={editandoPost ? salvarEdicao : criarPost}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editandoPost ? 'Salvar Alterações' : 'Criar Post'}
            </button>
            
            {editandoPost && (
              <button
                onClick={() => setEditandoPost(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de posts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Posts Existentes</h2>
        
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{post.titulo}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Por {post.autor} em {post.dataPublicacao}
                  </p>
                  <p className="text-gray-700 mt-2">{post.conteudo.substring(0, 100)}...</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                    post.status === 'publicado' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => editarPost(post)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirPost(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

