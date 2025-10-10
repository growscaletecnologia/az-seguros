// import { Plan } from "@/services/plan.service";
// import { Activity, BaggageClaim, Calendar, MapPin, ShieldOff, Users, X } from "lucide-react";

// function PlanDetailsModal({
//     plan,
//     onClose,
// }: {
//     plan: Plan;
//     onClose: () => void;
// }) {
//     const items = benefitsByPlan[plan.id] ?? [];
//     return (
//         <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50">
//             <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
//                 <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <div className="flex-1">
//                         <div className="flex items-center gap-3">
//                             <h2 className="text-2xl font-bold text-gray-900">{plan.plano}</h2>
//                             {plan.destaque && (
//                                 <span
//                                     className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                         plan.destaque === "Mais Vendido"
//                                             ? "bg-blue-100 text-blue-800"
//                                             : plan.destaque === "Melhor Preço"
//                                                 ? "bg-blue-100 text-blue-800"
//                                                 : plan.destaque === "Premium"
//                                                     ? "bg-purple-100 text-purple-800"
//                                                     : "bg-orange-100 text-orange-800"
//                                     }`}
//                                 >
//                                     {plan.destaque}
//                                 </span>
//                             )}
//                         </div>
//                         <p className="text-gray-700">{plan.seguradora}</p>
//                         <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
//                             <MapPin className="h-4 w-4" />
//                             <span>Europa</span>
//                             <Calendar className="h-4 w-4 ml-3" />
//                             <span>4 Set – 20 Set</span>
//                             <Users className="h-4 w-4 ml-3" />
//                             <span>2 adultos</span>
//                         </div>
//                     </div>

//                     <div className="text-right">
//                         {plan.precoOriginal > plan.preco && (
//                             <p className="text-sm text-gray-500 line-through">
//                                 {plan.precoOriginal.toLocaleString("pt-BR", {
//                                     style: "currency",
//                                     currency: "BRL",
//                                 })}
//                             </p>
//                         )}
//                         <p className="text-3xl font-extrabold text-blue-700">
//                             {plan.preco.toLocaleString("pt-BR", {
//                                 style: "currency",
//                                 currency: "BRL",
//                             })}
//                         </p>
//                         <button className="mt-3 inline-flex items-center hover:cursor-pointer justify-center px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
//                             Comprar
//                         </button>
//                     </div>

//                     <button
//                         onClick={onClose}
//                         className="p-2 rounded-lg hover:bg-gray-100"
//                         aria-label="Fechar"
//                     >
//                         <X className="h-6 w-6 text-gray-700" />
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
//                     <div className="text-center p-3 bg-gray-50 rounded-lg">
//                         <Activity className="h-5 w-5 text-blue-500 mx-auto mb-1" />
//                         <p className="text-xs text-gray-600">Cobertura Médica</p>
//                         <p className="font-semibold text-sm">
//                             USD {plan.coberturaMedica.toLocaleString()}
//                         </p>
//                     </div>
//                     <div className="text-center p-3 bg-gray-50 rounded-lg">
//                         <BaggageClaim  className="h-5 w-5 text-blue-500 mx-auto mb-1" />
//                         <p className="text-xs text-gray-600">Bagagem</p>
//                         <p className="font-semibold text-sm">
//                             USD {plan.coberturaBagagem.toLocaleString()}
//                         </p>
//                     </div>
//                     <div className="text-center p-3 bg-gray-50 rounded-lg">
//                         <ShieldOff className="h-5 w-5 text-red-500 mx-auto mb-1" />
//                         <p className="text-xs text-gray-600">Cancelamento</p>
//                         <p className="font-semibold text-sm">
//                             USD {plan.coberturaCancelamento.toLocaleString()}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="px-6 pb-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                         Coberturas Médicas
//                     </h3>
//                     <div className="overflow-hidden rounded-lg border">
//                         {(benefitsByPlan[plan.id] ?? []).map((row, i) => (
//                             <AccordionRow
//                                 key={i}
//                                 titulo={row.titulo}
//                                 valor={row.valor}
//                                 extra={row.extra}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }