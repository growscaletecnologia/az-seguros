// 'use client'
// import React, { useState } from 'react';

// const IntegrationsPage = () => {
//   const [seguradora, setSeguradora] = useState('');
//   const [token, setToken] = useState('');
//   const [markup, setMarkup] = useState('');
//   const [noMarkup, setNoMarkup] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log({
//       seguradora,
//       token,
//       markup: noMarkup ? 'Não configurado' : markup,
//     });
//     alert('Integração salva com sucesso!');
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">
//         Gerenciar Integrações
//       </h1>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Nome da Seguradora
//           </label>
//           <input
//             type="text"
//             value={seguradora}
//             onChange={(e) => setSeguradora(e.target.value)}
//             required
//             className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             placeholder="Ex: ITA Seguros"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Token de Acesso
//           </label>
//           <input
//             type="text"
//             value={token}
//             onChange={(e) => setToken(e.target.value)}
//             required
//             className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             placeholder="Insira o token de autenticação"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Markup
//           </label>
//           <input
//             type="number"
//             value={markup}
//             onChange={(e) => setMarkup(e.target.value)}
//             disabled={noMarkup}
//             className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
//             placeholder="Ex: 10%"
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             id="noMarkup"
//             type="checkbox"
//             checked={noMarkup}
//             onChange={(e) => setNoMarkup(e.target.checked)}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="noMarkup" className="text-sm text-gray-700">
//             Não configurar markup
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
//         >
//           Salvar Integração
//         </button>
//       </form>
//     </div>
//   );
// };

// export default IntegrationsPage;


'use client';
import React, { useMemo, useState } from 'react';
import { Plus, X, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

type Integracao = {
  id: string;
  seguradora: string;
  token: string;          // armazenado completo, exibido mascarado
  markup?: number | null; // null = “não configurar markup”
  ativa: boolean;
  criadaEm: string;       // ISO string
};

// helpers
const maskToken = (t: string) => (t ? `•••• ${t.slice(-4)}` : '—');
const formatMarkup = (m?: number | null) =>
  m === null ? 'Não configurado' : typeof m === 'number' ? `${m}%` : '—';

export default function IntegrationsPage() {
  // mocks iniciais
  const [integracoes, setIntegracoes] = useState<Integracao[]>([
    {
      id: 'ita-1',
      seguradora: 'ITA Seguros',
      token: 'ita_live_9f21a3c7ab44',
      markup: 8,
      ativa: true,
      criadaEm: new Date().toISOString(),
    },
    {
      id: 'intermac-1',
      seguradora: 'Intermac',
      token: 'int_live_c4f2b1aa9920',
      markup: null, // não configurar markup
      ativa: true,
      criadaEm: new Date().toISOString(),
    },
    {
      id: 'assist-1',
      seguradora: 'Assist Card',
      token: 'asc_live_71cc9a00ff13',
      markup: 12,
      ativa: false,
      criadaEm: new Date().toISOString(),
    },
  ]);

  // modal state
  const [open, setOpen] = useState(false);

  // form state
  const [seguradora, setSeguradora] = useState('');
  const [token, setToken] = useState('');
  const [markup, setMarkup] = useState<string>('');
  const [noMarkup, setNoMarkup] = useState(false);

  const resetForm = () => {
    setSeguradora('');
    setToken('');
    setMarkup('');
    setNoMarkup(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nova: Integracao = {
      id: `${seguradora.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      seguradora,
      token,
      markup: noMarkup ? null : markup === '' ? undefined : Number(markup),
      ativa: true,
      criadaEm: new Date().toISOString(),
    };

    setIntegracoes((prev) => [nova, ...prev]);
    resetForm();
    setOpen(false);
  };

  const handleDelete = (id: string) =>
    setIntegracoes((prev) => prev.filter((i) => i.id !== id));

  const toggleAtiva = (id: string) =>
    setIntegracoes((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ativa: !i.ativa } : i))
    );

  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return integracoes;
    return integracoes.filter(
      (i) =>
        i.seguradora.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
    );
  }, [integracoes, search]);

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integrações de Seguros</h1>
          <p className="text-sm text-gray-600">Gerencie plataformas de seguradoras, tokens e markup.</p>
        </div>

        <div className="flex gap-2">
          <input
            placeholder="Buscar por seguradora ou ID…"
            className="w-64 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Adicionar novo
          </button>
        </div>
      </div>

      {/* Tabela / Listagem */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-700">
          <div className="col-span-3">Seguradora</div>
          <div className="col-span-3">Token</div>
          <div className="col-span-2">Markup</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        <div className="divide-y">
          {filtered.map((i) => (
            <div key={i.id} className="grid grid-cols-12 items-center px-4 py-3">
              <div className="col-span-3">
                <div className="font-medium text-gray-900">{i.seguradora}</div>
                <div className="text-xs text-gray-500">{i.id}</div>
              </div>

              <div className="col-span-3 text-gray-900">{maskToken(i.token)}</div>

              <div className="col-span-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                    i.markup === null
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {formatMarkup(i.markup)}
                </span>
              </div>

              <div className="col-span-2">
                {i.ativa ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs">
                    <ToggleRight className="w-4 h-4" /> Ativa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                    <ToggleLeft className="w-4 h-4" /> Inativa
                  </span>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-2">
                <button
                  className="p-2 rounded hover:bg-gray-100"
                  title="Editar (mock)"
                  onClick={() => alert('Editar mock: em breve')}
                >
                  <Pencil className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  className="p-2 rounded hover:bg-gray-100"
                  title={i.ativa ? 'Desativar' : 'Ativar'}
                  onClick={() => toggleAtiva(i.id)}
                >
                  {i.ativa ? (
                    <ToggleRight className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <button
                  className="p-2 rounded hover:bg-red-50"
                  title="Remover"
                  onClick={() => handleDelete(i.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              Nenhuma integração encontrada.
            </div>
          )}
        </div>
      </div>

      {/* MODAL Adicionar novo */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Adicionar nova integração</h2>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Seguradora
                </label>
                <input
                  type="text"
                  value={seguradora}
                  onChange={(e) => setSeguradora(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: ITA Seguros"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token de Acesso
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Insira o token de autenticação"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Dica: salve tokens de produção e homologação em segredos do servidor. Aqui é apenas mock.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Markup (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value)}
                    disabled={noMarkup}
                    className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                    placeholder="Ex: 10"
                  />
                </div>

                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2">
                    <input
                      id="noMarkup"
                      type="checkbox"
                      checked={noMarkup}
                      onChange={(e) => setNoMarkup(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Não configurar markup</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Salvar integração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
