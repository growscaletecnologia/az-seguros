'use client';

import { useState } from 'react';
import { 
  Filter, 
  Search, 
  Star, 
  Shield, 
  Heart, 
  Plane, 
  MapPin, 
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  X,
  ArrowRight,
  Eye,
  GitCompare
} from 'lucide-react';

// Dados mock das seguradoras e planos
const mockPlans = [
  {
    id: 1,
    seguradora: 'Assist Card',
    plano: 'AC 60 Europa',
    preco: 89.90,
    precoOriginal: 99.90,
    coberturaMedica: 60000,
    coberturaBagagem: 1200,
    coberturaCancelamento: 5000,
    coberturaPandemia: true,
    coberturaPraticaEsportiva: true,
    avaliacoes: 4.8,
    totalAvaliacoes: 1247,
    destaque: 'Mais Vendido',
    beneficios: [
      'Cobertura COVID-19',
      'Telemedicina 24h',
      'Cancelamento de viagem',
      'Prática de esportes'
    ]
  },
  {
    id: 2,
    seguradora: 'Travel Ace',
    plano: 'TA 40 Especial',
    preco: 67.50,
    precoOriginal: 75.00,
    coberturaMedica: 40000,
    coberturaBagagem: 800,
    coberturaCancelamento: 3000,
    coberturaPandemia: true,
    coberturaPraticaEsportiva: false,
    avaliacoes: 4.6,
    totalAvaliacoes: 892,
    destaque: 'Melhor Preço',
    beneficios: [
      'Cobertura COVID-19',
      'Atendimento em português',
      'Cancelamento de viagem',
      'Regresso sanitário'
    ]
  },
  {
    id: 3,
    seguradora: 'GTA',
    plano: 'GTA 75 Euromax',
    preco: 125.80,
    precoOriginal: 140.00,
    coberturaMedica: 75000,
    coberturaBagagem: 1500,
    coberturaCancelamento: 8000,
    coberturaPandemia: true,
    coberturaPraticaEsportiva: true,
    avaliacoes: 4.9,
    totalAvaliacoes: 2156,
    destaque: 'Premium',
    beneficios: [
      'Cobertura COVID-19',
      'Telemedicina 24h',
      'Cancelamento de viagem',
      'Prática de esportes',
      'Cobertura odontológica'
    ]
  },
  {
    id: 4,
    seguradora: 'Vital Card',
    plano: 'VC 30 Basic',
    preco: 45.90,
    precoOriginal: 52.00,
    coberturaMedica: 30000,
    coberturaBagagem: 600,
    coberturaCancelamento: 2000,
    coberturaPandemia: true,
    coberturaPraticaEsportiva: false,
    avaliacoes: 4.4,
    totalAvaliacoes: 567,
    destaque: 'Econômico',
    beneficios: [
      'Cobertura COVID-19',
      'Atendimento 24h',
      'Cancelamento de viagem'
    ]
  },
  {
    id: 5,
    seguradora: 'Intermac',
    plano: 'I60 Europa',
    preco: 98.70,
    precoOriginal: 110.00,
    coberturaMedica: 60000,
    coberturaBagagem: 1000,
    coberturaCancelamento: 6000,
    coberturaPandemia: true,
    coberturaPraticaEsportiva: true,
    avaliacoes: 4.7,
    totalAvaliacoes: 1034,
    destaque: '',
    beneficios: [
      'Cobertura COVID-19',
      'Telemedicina',
      'Cancelamento de viagem',
      'Prática de esportes',
      'Fisioterapia'
    ]
  }
];

export default function PlanosPage() {
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({
    coberturaMedica: '',
    preco: '',
    seguradora: ''
  });

  const handleSelectPlan = (planId: number) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter(id => id !== planId));
    } else if (selectedPlans.length < 3) {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  const getSelectedPlans = () => {
    return mockPlans.filter(plan => selectedPlans.includes(plan.id));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header da página */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compare Planos de Seguro</h1>
              <p className="text-gray-600 mt-2">
                Encontre o seguro de viagem perfeito para sua próxima aventura
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Europa</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>15/03 - 25/03</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>2 adultos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1 text-black">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cobertura Médica Mínima
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.coberturaMedica}
                    onChange={(e) => setFilters({...filters, coberturaMedica: e.target.value})}
                  >
                    <option value="">Qualquer valor</option>
                    <option value="30000">USD 30.000</option>
                    <option value="40000">USD 40.000</option>
                    <option value="60000">USD 60.000</option>
                    <option value="75000">USD 75.000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faixa de Preço
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.preco}
                    onChange={(e) => setFilters({...filters, preco: e.target.value})}
                  >
                    <option value="">Qualquer preço</option>
                    <option value="0-50">Até R$ 50</option>
                    <option value="50-100">R$ 50 - R$ 100</option>
                    <option value="100-150">R$ 100 - R$ 150</option>
                    <option value="150+">Acima de R$ 150</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seguradora
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.seguradora}
                    onChange={(e) => setFilters({...filters, seguradora: e.target.value})}
                  >
                    <option value="">Todas</option>
                    <option value="Assist Card">Assist Card</option>
                    <option value="Travel Ace">Travel Ace</option>
                    <option value="GTA">GTA</option>
                    <option value="Vital Card">Vital Card</option>
                    <option value="Intermac">Intermac</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Coberturas Especiais</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">COVID-19</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Prática de Esportes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Gestantes</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Planos */}
          <div className="lg:col-span-3">
            {/* Barra de ações */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {mockPlans.length} planos encontrados
                </span>
                {selectedPlans.length > 0 && (
                  <button
                    onClick={() => setShowComparison(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <GitCompare className="h-4 w-4" />
                    <span>Comparar ({selectedPlans.length})</span>
                  </button>
                )}
              </div>
              
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Ordenar por: Melhor preço</option>
                <option>Ordenar por: Maior cobertura</option>
                <option>Ordenar por: Melhor avaliação</option>
              </select>
            </div>

            {/* Cards dos Planos */}
            <div className="space-y-4">
              {mockPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Informações do Plano */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{plan.plano}</h3>
                              {plan.destaque && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  plan.destaque === 'Mais Vendido' ? 'bg-green-100 text-green-800' :
                                  plan.destaque === 'Melhor Preço' ? 'bg-blue-100 text-blue-800' :
                                  plan.destaque === 'Premium' ? 'bg-purple-100 text-purple-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {plan.destaque}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 font-medium">{plan.seguradora}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < Math.floor(plan.avaliacoes) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {plan.avaliacoes} ({plan.totalAvaliacoes} avaliações)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Coberturas */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Cobertura Médica</p>
                            <p className="font-semibold text-sm">USD {plan.coberturaMedica.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Bagagem</p>
                            <p className="font-semibold text-sm">USD {plan.coberturaBagagem.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Plane className="h-5 w-5 text-green-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Cancelamento</p>
                            <p className="font-semibold text-sm">USD {plan.coberturaCancelamento.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">COVID-19</p>
                            <p className="font-semibold text-sm">{plan.coberturaPandemia ? 'Incluído' : 'Não'}</p>
                          </div>
                        </div>

                        {/* Benefícios */}
                        <div className="flex flex-wrap gap-2">
                          {plan.beneficios.map((beneficio, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {beneficio}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Preço e Ações */}
                      <div className="lg:w-64 text-center lg:text-right">
                        <div className="mb-4">
                          {plan.precoOriginal > plan.preco && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(plan.precoOriginal)}
                            </p>
                          )}
                          <p className="text-3xl font-bold text-gray-900">
                            {formatPrice(plan.preco)}
                          </p>
                          <p className="text-sm text-gray-600">por pessoa</p>
                          {plan.precoOriginal > plan.preco && (
                            <p className="text-sm text-green-600 font-medium">
                              Economia de {formatPrice(plan.precoOriginal - plan.preco)}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                            <span>Selecionar Plano</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleSelectPlan(plan.id)}
                              className={`flex-1 py-2 px-4 rounded-lg border transition-colors flex items-center justify-center space-x-1 ${
                                selectedPlans.includes(plan.id)
                                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              disabled={!selectedPlans.includes(plan.id) && selectedPlans.length >= 3}
                            >
                              <GitCompare className="h-4 w-4" />
                              <span className="text-sm">
                                {selectedPlans.includes(plan.id) ? 'Selecionado' : 'Comparar'}
                              </span>
                            </button>
                            
                            <button className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Comparação */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Comparar Planos</h2>
              <button 
                onClick={() => setShowComparison(false)}
                className="p-2 text-black hover:bg-gray-100 hover:cursor-pointer rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getSelectedPlans().map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <div className="text-center text-black mb-4">
                      <h3 className="font-bold text-lg">{plan.plano}</h3>
                      <p className="text-gray-900">{plan.seguradora}</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {formatPrice(plan.preco)}
                      </p>
                    </div>
                    
                    <div className="space-y-3 text-black text-sm">
                      <div className="flex justify-between">
                        <span>Cobertura Médica:</span>
                        <span className="font-medium">USD {plan.coberturaMedica.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bagagem:</span>
                        <span className="font-medium">USD {plan.coberturaBagagem.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancelamento:</span>
                        <span className="font-medium">USD {plan.coberturaCancelamento.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>COVID-19:</span>
                        <span className={`font-medium ${plan.coberturaPandemia ? 'text-green-600' : 'text-red-600'}`}>
                          {plan.coberturaPandemia ? 'Sim' : 'Não'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prática de Esportes:</span>
                        <span className={`font-medium ${plan.coberturaPraticaEsportiva ? 'text-green-600' : 'text-red-600'}`}>
                          {plan.coberturaPraticaEsportiva ? 'Sim' : 'Não'}
                        </span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:cursor-pointer hover:bg-blue-700 transition-colors">
                      Selecionar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

