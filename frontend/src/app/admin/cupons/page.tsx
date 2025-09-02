'use client'
import React, { useState } from 'react';

interface Cupom {
  id: number;
  codigo: string;
  desconto: number;
  tipoDesconto: 'percentual' | 'valor';
  dataExpiracao: string;
  limitesUso: number;
  usosAtuais: number;
  ativo: boolean;
}

const CuponsPage = () => {
  const [cupons, setCupons] = useState<Cupom[]>([
    {
      id: 1,
      codigo: 'PROMO10',
      desconto: 10,
      tipoDesconto: 'percentual',
      dataExpiracao: '2024-12-31',
      limitesUso: 100,
      usosAtuais: 25,
      ativo: true
    }
  ]);

  const [novoCupom, setNovoCupom] = useState({
    codigo: '',
    desconto: 0,
    tipoDesconto: 'percentual' as 'percentual' | 'valor',
    dataExpiracao: '',
    limitesUso: 0
  });

  const criarCupom = () => {
    const cupom: Cupom = {
      id: Date.now(),
      ...novoCupom,
      usosAtuais: 0,
      ativo: true
    };
    setCupons([...cupons, cupom]);
    setNovoCupom({
      codigo: '',
      desconto: 0,
      tipoDesconto: 'percentual',
      dataExpiracao: '',
      limitesUso: 0
    });
    alert('Cupom criado com sucesso!');
  };

  const toggleCupom = (id: number) => {
    setCupons(cupons.map(c => 
      c.id === id ? { ...c, ativo: !c.ativo } : c
    ));
  };

  const excluirCupom = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      setCupons(cupons.filter(c => c.id !== id));
      alert('Cupom excluído com sucesso!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Cupons</h1>
      
      {/* Formulário para criar cupom */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Criar Novo Cupom</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Código do Cupom</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={novoCupom.codigo}
              onChange={(e) => setNovoCupom({ ...novoCupom, codigo: e.target.value.toUpperCase() })}
              placeholder="Ex: PROMO20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Desconto</label>
            <select
              className="w-full p-2 border rounded"
              value={novoCupom.tipoDesconto}
              onChange={(e) => setNovoCupom({ ...novoCupom, tipoDesconto: e.target.value as 'percentual' | 'valor' })}
            >
              <option value="percentual">Percentual (%)</option>
              <option value="valor">Valor Fixo (R$)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Desconto ({novoCupom.tipoDesconto === 'percentual' ? '%' : 'R$'})
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={novoCupom.desconto}
              onChange={(e) => setNovoCupom({ ...novoCupom, desconto: Number(e.target.value) })}
              min="0"
              max={novoCupom.tipoDesconto === 'percentual' ? 100 : undefined}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Data de Expiração</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={novoCupom.dataExpiracao}
              onChange={(e) => setNovoCupom({ ...novoCupom, dataExpiracao: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Limite de Uso</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={novoCupom.limitesUso}
              onChange={(e) => setNovoCupom({ ...novoCupom, limitesUso: Number(e.target.value) })}
              min="1"
              placeholder="Quantas vezes pode ser usado"
            />
          </div>
        </div>
        
        <button
          onClick={criarCupom}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!novoCupom.codigo || !novoCupom.dataExpiracao || novoCupom.limitesUso <= 0}
        >
          Criar Cupom
        </button>
      </div>

      {/* Lista de cupons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Cupons Existentes</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Desconto</th>
                <th className="px-4 py-2 text-left">Expiração</th>
                <th className="px-4 py-2 text-left">Uso</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cupons.map((cupom) => (
                <tr key={cupom.id} className="border-t">
                  <td className="px-4 py-2 font-mono font-bold">{cupom.codigo}</td>
                  <td className="px-4 py-2">
                    {cupom.desconto}{cupom.tipoDesconto === 'percentual' ? '%' : ' R$'}
                  </td>
                  <td className="px-4 py-2">{cupom.dataExpiracao}</td>
                  <td className="px-4 py-2">
                    {cupom.usosAtuais}/{cupom.limitesUso}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(cupom.usosAtuais / cupom.limitesUso) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      cupom.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cupom.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleCupom(cupom.id)}
                        className={`px-3 py-1 text-xs rounded ${
                          cupom.ativo 
                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                      >
                        {cupom.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => excluirCupom(cupom.id)}
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

export default CuponsPage;

