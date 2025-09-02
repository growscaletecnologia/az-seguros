'use client'
import React, { useState } from 'react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'cliente' | 'gerente';
  permissoes: {
    ver: boolean;
    editar: boolean;
    criar: boolean;
    excluir: boolean;
  };
  ativo: boolean;
  dataCriacao: string;
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: 'Admin Principal',
      email: 'admin@example.com',
      role: 'admin',
      permissoes: { ver: true, editar: true, criar: true, excluir: true },
      ativo: true,
      dataCriacao: '2024-01-01'
    },
    {
      id: 2,
      nome: 'João Cliente',
      email: 'cliente@example.com',
      role: 'cliente',
      permissoes: { ver: true, editar: false, criar: false, excluir: false },
      ativo: true,
      dataCriacao: '2024-01-15'
    },
    {
      id: 3,
      nome: 'Maria Gerente',
      email: 'gerente@example.com',
      role: 'gerente',
      permissoes: { ver: true, editar: true, criar: true, excluir: false },
      ativo: true,
      dataCriacao: '2024-01-10'
    }
  ]);

  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    role: 'cliente' as 'admin' | 'cliente' | 'gerente',
    permissoes: { ver: true, editar: false, criar: false, excluir: false }
  });

  const permissoesPadrao = {
    admin: { ver: true, editar: true, criar: true, excluir: true },
    gerente: { ver: true, editar: true, criar: true, excluir: false },
    cliente: { ver: true, editar: false, criar: false, excluir: false }
  };

  const criarUsuario = () => {
    const usuario: Usuario = {
      id: Date.now(),
      ...novoUsuario,
      ativo: true,
      dataCriacao: new Date().toISOString().split('T')[0]
    };
    setUsuarios([...usuarios, usuario]);
    setNovoUsuario({
      nome: '',
      email: '',
      role: 'cliente',
      permissoes: { ver: true, editar: false, criar: false, excluir: false }
    });
    alert('Usuário criado com sucesso!');
  };

  const editarUsuario = (usuario: Usuario) => {
    setEditandoUsuario({ ...usuario });
  };

  const salvarEdicao = () => {
    if (editandoUsuario) {
      setUsuarios(usuarios.map(u => u.id === editandoUsuario.id ? editandoUsuario : u));
      setEditandoUsuario(null);
      alert('Usuário atualizado com sucesso!');
    }
  };

  const toggleUsuario = (id: number) => {
    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, ativo: !u.ativo } : u
    ));
  };

  const excluirUsuario = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert('Usuário excluído com sucesso!');
    }
  };

  const atualizarRole = (role: 'admin' | 'cliente' | 'gerente', isEditing: boolean = false) => {
    const permissoes = permissoesPadrao[role];
    if (isEditing && editandoUsuario) {
      setEditandoUsuario({ ...editandoUsuario, role, permissoes });
    } else {
      setNovoUsuario({ ...novoUsuario, role, permissoes });
    }
  };

  const atualizarPermissao = (permissao: keyof Usuario['permissoes'], valor: boolean, isEditing: boolean = false) => {
    if (isEditing && editandoUsuario) {
      setEditandoUsuario({
        ...editandoUsuario,
        permissoes: { ...editandoUsuario.permissoes, [permissao]: valor }
      });
    } else {
      setNovoUsuario({
        ...novoUsuario,
        permissoes: { ...novoUsuario.permissoes, [permissao]: valor }
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
      
      {/* Formulário para criar/editar usuário */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editandoUsuario ? 'Editar Usuário' : 'Criar Novo Usuário'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editandoUsuario ? editandoUsuario.nome : novoUsuario.nome}
              onChange={(e) => {
                if (editandoUsuario) {
                  setEditandoUsuario({ ...editandoUsuario, nome: e.target.value });
                } else {
                  setNovoUsuario({ ...novoUsuario, nome: e.target.value });
                }
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={editandoUsuario ? editandoUsuario.email : novoUsuario.email}
              onChange={(e) => {
                if (editandoUsuario) {
                  setEditandoUsuario({ ...editandoUsuario, email: e.target.value });
                } else {
                  setNovoUsuario({ ...novoUsuario, email: e.target.value });
                }
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <div className="flex space-x-4">
            {(['admin', 'gerente', 'cliente'] as const).map((role) => (
              <label key={role} className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={(editandoUsuario ? editandoUsuario.role : novoUsuario.role) === role}
                  onChange={() => atualizarRole(role, !!editandoUsuario)}
                  className="mr-2"
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Permissões CRUD</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['ver', 'editar', 'criar', 'excluir'] as const).map((permissao) => (
              <label key={permissao} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(editandoUsuario ? editandoUsuario.permissoes : novoUsuario.permissoes)[permissao]}
                  onChange={(e) => atualizarPermissao(permissao, e.target.checked, !!editandoUsuario)}
                  className="mr-2"
                />
                {permissao.charAt(0).toUpperCase() + permissao.slice(1)}
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={editandoUsuario ? salvarEdicao : criarUsuario}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editandoUsuario ? 'Salvar Alterações' : 'Criar Usuário'}
          </button>
          
          {editandoUsuario && (
            <button
              onClick={() => setEditandoUsuario(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Usuários Existentes</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Permissões</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t">
                  <td className="px-4 py-2">{usuario.nome}</td>
                  <td className="px-4 py-2">{usuario.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      usuario.role === 'admin' ? 'bg-red-100 text-red-800' :
                      usuario.role === 'gerente' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {usuario.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-1">
                      {Object.entries(usuario.permissoes).map(([perm, ativo]) => (
                        <span
                          key={perm}
                          className={`px-1 py-0.5 text-xs rounded ${
                            ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {perm.charAt(0).toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      usuario.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editarUsuario(usuario)}
                        className="bg-yellow-500 text-white px-3 py-1 text-xs rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleUsuario(usuario.id)}
                        className={`px-3 py-1 text-xs rounded ${
                          usuario.ativo 
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                      >
                        {usuario.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => excluirUsuario(usuario.id)}
                        className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;

