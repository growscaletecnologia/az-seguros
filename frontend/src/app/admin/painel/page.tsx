// 'use client';

// import { useState } from 'react';
// import { 
//   User, 
//   FileText, 
//   Download, 
//   Calendar, 
//   MapPin, 
//   Shield, 
//   Phone, 
//   Mail,
//   CreditCard,
//   AlertCircle,
//   CheckCircle,
//   X,
//   Eye,
//   Settings,
//   LogOut,
//   Plus
// } from 'lucide-react';

// // Dados mock do usuário
// const userData = {
//   nome: 'João Silva',
//   email: 'joao@email.com',
//   telefone: '(11) 99999-9999',
//   cpf: '123.456.789-00',
//   dataNascimento: '15/05/1985'
// };

// // Dados mock das apólices
// const policies = [
//   {
//     id: 1,
//     numero: 'AP-2024-001234',
//     seguradora: 'Assist Card',
//     plano: 'AC 60 Europa',
//     destino: 'Europa',
//     dataIda: '15/03/2024',
//     dataVolta: '25/03/2024',
//     viajantes: ['João Silva', 'Maria Silva'],
//     status: 'Ativa',
//     valor: 179.80,
//     coberturaMedica: 60000,
//     coberturaBagagem: 1200,
//     dataCompra: '10/03/2024'
//   },
//   {
//     id: 2,
//     numero: 'AP-2023-005678',
//     seguradora: 'Travel Ace',
//     plano: 'TA 40 Especial',
//     destino: 'Estados Unidos',
//     dataIda: '20/12/2023',
//     dataVolta: '05/01/2024',
//     viajantes: ['João Silva'],
//     status: 'Finalizada',
//     valor: 135.50,
//     coberturaMedica: 40000,
//     coberturaBagagem: 800,
//     dataCompra: '15/12/2023'
//   },
//   {
//     id: 3,
//     numero: 'AP-2023-003456',
//     seguradora: 'GTA',
//     plano: 'GTA 75 Euromax',
//     destino: 'França',
//     dataIda: '10/08/2023',
//     dataVolta: '25/08/2023',
//     viajantes: ['João Silva', 'Maria Silva', 'Pedro Silva'],
//     status: 'Cancelada',
//     valor: 377.40,
//     coberturaMedica: 75000,
//     coberturaBagagem: 1500,
//     dataCompra: '05/08/2023'
//   }
// ];

// export default function ClientePage() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [selectedPolicy, setSelectedPolicy] = useState<typeof policies[0] | null>(null);
//   const [showCancelModal, setShowCancelModal] = useState(false);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Ativa':
//         return 'bg-green-100 text-green-800';
//       case 'Finalizada':
//         return 'bg-blue-100 text-blue-800';
//       case 'Cancelada':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const downloadVoucher = (policyId: number) => {
//     // Simular download do voucher
//     alert(`Download do voucher da apólice ${policyId} iniciado!`);
//   };

//   const cancelPolicy = (policyId: number) => {
//     // Simular cancelamento
//     alert(`Solicitação de cancelamento da apólice ${policyId} enviada!`);
//     setShowCancelModal(false);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Área do Cliente</h1>
//               <p className="text-gray-600 mt-1">Bem-vindo, {userData.nome}</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                 <Plus className="h-4 w-4" />
//                 <span>Nova Cotação</span>
//               </button>
//               <button className="p-2 text-gray-600 hover:text-gray-900">
//                 <Settings className="h-5 w-5" />
//               </button>
//               <button className="p-2 text-gray-600 hover:text-gray-900">
//                 <LogOut className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                   <User className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900">{userData.nome}</p>
//                   <p className="text-sm text-gray-600">{userData.email}</p>
//                 </div>
//               </div>

//               <nav className="space-y-2">
//                 <button
//                   onClick={() => setActiveTab('dashboard')}
//                   className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
//                     activeTab === 'dashboard' 
//                       ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   Dashboard
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('policies')}
//                   className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
//                     activeTab === 'policies' 
//                       ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   Minhas Apólices
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('profile')}
//                   className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
//                     activeTab === 'profile' 
//                       ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   Meu Perfil
//                 </button>
//               </nav>
//             </div>
//           </div>

//           {/* Conteúdo Principal */}
//           <div className="lg:col-span-3">
//             {/* Dashboard */}
//             {activeTab === 'dashboard' && (
//               <div className="space-y-6">
//                 {/* Cards de Resumo */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Apólices Ativas</p>
//                         <p className="text-2xl font-bold text-gray-900">
//                           {policies.filter(p => p.status === 'Ativa').length}
//                         </p>
//                       </div>
//                       <Shield className="h-8 w-8 text-green-600" />
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Total Gasto</p>
//                         <p className="text-2xl font-bold text-gray-900">
//                           R$ {policies.reduce((sum, p) => sum + p.valor, 0).toFixed(2)}
//                         </p>
//                       </div>
//                       <CreditCard className="h-8 w-8 text-blue-600" />
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Próxima Viagem</p>
//                         <p className="text-lg font-bold text-gray-900">15/03/2024</p>
//                         <p className="text-sm text-gray-600">Europa</p>
//                       </div>
//                       <Calendar className="h-8 w-8 text-purple-600" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Apólices Recentes */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Apólices Recentes</h3>
//                   <div className="space-y-4">
//                     {policies.slice(0, 2).map((policy) => (
//                       <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
//                         <div className="flex items-center space-x-4">
//                           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <Shield className="h-5 w-5 text-blue-600" />
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">{policy.plano}</p>
//                             <p className="text-sm text-gray-600">{policy.destino} • {policy.dataIda} - {policy.dataVolta}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(policy.status)}`}>
//                             {policy.status}
//                           </span>
//                           <p className="text-sm text-gray-600 mt-1">R$ {policy.valor.toFixed(2)}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Minhas Apólices */}
//             {activeTab === 'policies' && (
//               <div className="space-y-6">
//                 <div className="bg-white rounded-lg shadow-sm">
//                   <div className="p-6 border-b">
//                     <h3 className="text-lg font-semibold text-gray-900">Minhas Apólices</h3>
//                   </div>
//                   <div className="divide-y">
//                     {policies.map((policy) => (
//                       <div key={policy.id} className="p-6">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <div className="flex items-center space-x-3 mb-2">
//                               <h4 className="text-lg font-medium text-gray-900">{policy.plano}</h4>
//                               <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(policy.status)}`}>
//                                 {policy.status}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 mb-2">{policy.seguradora} • Nº {policy.numero}</p>
                            
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                               <div>
//                                 <p className="text-sm text-gray-600">Destino</p>
//                                 <p className="font-medium">{policy.destino}</p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-gray-600">Período</p>
//                                 <p className="font-medium">{policy.dataIda} - {policy.dataVolta}</p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-gray-600">Viajantes</p>
//                                 <p className="font-medium">{policy.viajantes.length} pessoa(s)</p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-gray-600">Valor Pago</p>
//                                 <p className="font-medium">R$ {policy.valor.toFixed(2)}</p>
//                               </div>
//                             </div>

//                             <div className="flex flex-wrap gap-2 mb-4">
//                               {policy.viajantes.map((viajante, index) => (
//                                 <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
//                                   {viajante}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>

//                           <div className="flex flex-col space-y-2 ml-4">
//                             <button
//                               onClick={() => downloadVoucher(policy.id)}
//                               className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
//                             >
//                               <Download className="h-4 w-4" />
//                               <span>Voucher</span>
//                             </button>
                            
//                             <button
//                               onClick={() => setSelectedPolicy(policy)}
//                               className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//                             >
//                               <Eye className="h-4 w-4" />
//                               <span>Detalhes</span>
//                             </button>

//                             {policy.status === 'Ativa' && (
//                               <button
//                                 onClick={() => {
//                                   setSelectedPolicy(policy);
//                                   setShowCancelModal(true);
//                                 }}
//                                 className="flex items-center space-x-2 px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
//                               >
//                                 <X className="h-4 w-4" />
//                                 <span>Cancelar</span>
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Meu Perfil */}
//             {activeTab === 'profile' && (
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-6">Meus Dados</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
//                     <input
//                       type="text"
//                       value={userData.nome}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       readOnly
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
//                     <input
//                       type="email"
//                       value={userData.email}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       readOnly
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
//                     <input
//                       type="tel"
//                       value={userData.telefone}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       readOnly
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
//                     <input
//                       type="text"
//                       value={userData.cpf}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       readOnly
//                     />
//                   </div>
//                 </div>
                
//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                   <div className="flex items-start space-x-3">
//                     <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
//                     <div>
//                       <p className="text-sm text-blue-800">
//                         Para alterar seus dados pessoais, entre em contato com nosso suporte através do telefone 
//                         <strong> 0800 123 4567</strong> ou email <strong>suporte@seguroviagem.com</strong>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal de Cancelamento */}
//       {showCancelModal && selectedPolicy && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancelar Apólice</h3>
//             <p className="text-gray-600 mb-6">
//               Tem certeza que deseja cancelar a apólice <strong>{selectedPolicy.numero}</strong>?
//               Esta ação não pode ser desfeita.
//             </p>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Voltar
//               </button>
//               <button
//                 onClick={() => cancelPolicy(selectedPolicy.id)}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Confirmar Cancelamento
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';


import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Role {
  id: number;
  name: '';
  viewing_permission_level: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: null;
  createdBy: {
    name: string;
  };
}

export default function Profile() {
  // const { data } = useApi.authGet<Role[]>({
  //   url: 'roles/all',
  //   keys: ['roles'],
  // });

  return (
    <section className="mx-10 my-5">
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="flex flex-row justify-between px-7">
          <div>
            <CardTitle>Perfis</CardTitle>
            <CardDescription>
              Perfis que possuem permissões específicas no sistema
            </CardDescription>
          </div>

          <Link href={'/admin/profiles/create'}>
            <Button title="Criar usuário">
              <Plus size={18} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perfil</TableHead>
                <TableHead className="hidden md:table-cell">
                  Atualizado em
                </TableHead>

                <TableHead className="hidden sm:table-cell">
                  Atualizado por
                </TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="w-full h-[40px]" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="w-full h-[40px]" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="w-full h-[40px]" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              
          
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton className="w-full h-[40px]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton className="w-full h-[40px]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton className="w-full h-[40px]" />
                  </TableCell>
                </TableRow>
              </TableBody>
           
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
