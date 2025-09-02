'use client'
import React from 'react';
import { 
  Users, 
  FileText, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Bell,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  // Dados mock para o dashboard
  const stats = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 45.678',
      change: '+8%',
      changeType: 'positive',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      title: 'Pedidos Ativos',
      value: '89',
      change: '-3%',
      changeType: 'negative',
      icon: <ShoppingCart className="h-6 w-6" />
    },
    {
      title: 'Taxa de Conversão',
      value: '3.2%',
      change: '+0.5%',
      changeType: 'positive',
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Novo usuário cadastrado', user: 'João Silva', time: '2 min atrás' },
    { id: 2, action: 'Pedido finalizado', user: 'Maria Santos', time: '5 min atrás' },
    { id: 3, action: 'Cupom criado', user: 'Admin', time: '10 min atrás' },
    { id: 4, action: 'Post publicado no blog', user: 'Editor', time: '15 min atrás' },
    { id: 5, action: 'Integração configurada', user: 'Admin', time: '30 min atrás' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao painel de controle</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600">{stat.icon}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 ml-1">vs mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">por {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Novo Usuário</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Novo Post</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Ver Pedidos</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Relatórios</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Módulos Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">5.2GB</div>
            <div className="text-sm text-gray-600">Armazenamento Usado</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


