"use client";

import {
	ArrowRight,
	Calendar,
	CheckCircle,
	Eye,
	Filter,
	GitCompare,
	Heart,
	Info,
	MapPin,
	Minus,
	Plane,
	Plus,
	Search,
	Shield,
	Star,
	Users,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ============================== */
/*           MOCK DATA            */
/* ============================== */
type Plan = {
	id: number;
	seguradora: string;
	plano: string;
	preco: number;
	precoOriginal: number;
	coberturaMedica: number;
	coberturaBagagem: number;
	coberturaCancelamento: number;
	coberturaPandemia: boolean;
	coberturaPraticaEsportiva: boolean;
	avaliacoes: number;
	totalAvaliacoes: number;
	destaque: string;
	beneficios: string[];
};

const mockPlans: Plan[] = [
	{
		id: 1,
		seguradora: "Assist Card",
		plano: "AC 60 Europa",
		preco: 89.9,
		precoOriginal: 99.9,
		coberturaMedica: 60000,
		coberturaBagagem: 1200,
		coberturaCancelamento: 5000,
		coberturaPandemia: true,
		coberturaPraticaEsportiva: true,
		avaliacoes: 4.8,
		totalAvaliacoes: 1247,
		destaque: "Mais Vendido",
		beneficios: [
			"Cobertura COVID-19",
			"Telemedicina 24h",
			"Cancelamento de viagem",
			"Prática de esportes",
		],
	},
	{
		id: 2,
		seguradora: "Travel Ace",
		plano: "TA 40 Especial",
		preco: 67.5,
		precoOriginal: 75.0,
		coberturaMedica: 40000,
		coberturaBagagem: 800,
		coberturaCancelamento: 3000,
		coberturaPandemia: true,
		coberturaPraticaEsportiva: false,
		avaliacoes: 4.6,
		totalAvaliacoes: 892,
		destaque: "Melhor Preço",
		beneficios: [
			"Cobertura COVID-19",
			"Atendimento em português",
			"Cancelamento de viagem",
			"Regresso sanitário",
		],
	},
	{
		id: 3,
		seguradora: "GTA",
		plano: "GTA 75 Euromax",
		preco: 125.8,
		precoOriginal: 140.0,
		coberturaMedica: 75000,
		coberturaBagagem: 1500,
		coberturaCancelamento: 8000,
		coberturaPandemia: true,
		coberturaPraticaEsportiva: true,
		avaliacoes: 4.9,
		totalAvaliacoes: 2156,
		destaque: "Premium",
		beneficios: [
			"Cobertura COVID-19",
			"Telemedicina 24h",
			"Cancelamento de viagem",
			"Prática de esportes",
			"Cobertura odontológica",
		],
	},
	{
		id: 4,
		seguradora: "Vital Card",
		plano: "VC 30 Basic",
		preco: 45.9,
		precoOriginal: 52.0,
		coberturaMedica: 30000,
		coberturaBagagem: 600,
		coberturaCancelamento: 2000,
		coberturaPandemia: true,
		coberturaPraticaEsportiva: false,
		avaliacoes: 4.4,
		totalAvaliacoes: 567,
		destaque: "Econômico",
		beneficios: ["Cobertura COVID-19", "Atendimento 24h", "Cancelamento de viagem"],
	},
	{
		id: 5,
		seguradora: "Intermac",
		plano: "I60 Europa",
		preco: 98.7,
		precoOriginal: 110.0,
		coberturaMedica: 60000,
		coberturaBagagem: 1000,
		coberturaCancelamento: 6000,
		coberturaPandemia: true,
		coberturaPraticaEsportiva: true,
		avaliacoes: 4.7,
		totalAvaliacoes: 1034,
		destaque: "",
		beneficios: [
			"Cobertura COVID-19",
			"Telemedicina",
			"Cancelamento de viagem",
			"Prática de esportes",
			"Fisioterapia",
		],
	},
];

/* Benefícios detalhados por plano (mock configurável).
   Use este shape para montar a tabela/accordion do modal. */
type BenefitItem = {
	titulo: string;
	valor?: string;
	extra?: string; // descrição/observação
};

const benefitsByPlan: Record<number, BenefitItem[]> = {
	1: [
		{ titulo: "Permite emissão em viagem?", valor: "NÃO" },
		{ titulo: "Validade Geográfica", valor: "EUROPA" },
		{ titulo: "Franquia de DMH", valor: "NÃO" },
		{
			titulo: "Despesa Médica Hospitalar Total",
			valor: "USD 60,000",
			extra: "Valor total de despesas médicas hospitalares.",
		},
		{ titulo: "Despesa Médica Hospitalar", valor: "USD 60,000" },
		{ titulo: "Cobertura Médica para Prática de Esportes", valor: "USD 10.000" },
		{ titulo: "Cobertura Médica para Gestante", valor: "USD 30.000" },
		{ titulo: "Telemedicina", valor: "SIM" },
		{ titulo: "Cobertura Odontológica", valor: "USD 1.000" },
	],
	2: [
		{ titulo: "Permite emissão em viagem?", valor: "SIM (verificar carência)" },
		{ titulo: "Validade Geográfica", valor: "INTERNACIONAL (exceto EUA e Canadá)" },
		{ titulo: "Franquia de DMH", valor: "NÃO" },
		{ titulo: "Despesa Médica Hospitalar Total", valor: "USD 40.000" },
		{ titulo: "Despesa Médica Hospitalar", valor: "USD 40.000" },
		{ titulo: "Telemedicina", valor: "SIM" },
	],
	3: [
		{ titulo: "Permite emissão em viagem?", valor: "NÃO" },
		{ titulo: "Validade Geográfica", valor: "EUROPA" },
		{ titulo: "Franquia de DMH", valor: "NÃO" },
		{
			titulo: "Despesa Médica Hospitalar Total",
			valor: "USD 75.000",
			extra: "Inclui atendimento ambulatorial e hospitalar.",
		},
		{ titulo: "Telemedicina", valor: "SIM" },
		{ titulo: "Cobertura Odontológica", valor: "USD 2.000" },
	],
	4: [
		{ titulo: "Permite emissão em viagem?", valor: "NÃO" },
		{ titulo: "Validade Geográfica", valor: "EUROPA" },
		{ titulo: "Despesa Médica Hospitalar Total", valor: "USD 30.000" },
	],
	5: [
		{ titulo: "Permite emissão em viagem?", valor: "NÃO" },
		{ titulo: "Validade Geográfica", valor: "EUROPA" },
		{ titulo: "Despesa Médica Hospitalar Total", valor: "USD 60,000" },
		{ titulo: "Prática de Esportes", valor: "DENTRO DMH" },
	],
};

/* ============================== */
/*       DETALHE (MODAL)         */
/* ============================== */
function PlanDetailsModal({
	plan,
	onClose,
}: {
	plan: Plan;
	onClose: () => void;
}) {
	const items = benefitsByPlan[plan.id] ?? [];

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50">
			<div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
				{/* Header */}
				<div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<h2 className="text-2xl font-bold text-gray-900">{plan.plano}</h2>
							{plan.destaque && (
								<span
									className={`px-2 py-1 text-xs font-medium rounded-full ${
										plan.destaque === "Mais Vendido"
											? "bg-green-100 text-green-800"
											: plan.destaque === "Melhor Preço"
												? "bg-blue-100 text-blue-800"
												: plan.destaque === "Premium"
													? "bg-purple-100 text-purple-800"
													: "bg-orange-100 text-orange-800"
									}`}
								>
									{plan.destaque}
								</span>
							)}
						</div>
						<p className="text-gray-700">{plan.seguradora}</p>
						<div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
							<MapPin className="h-4 w-4" />
							<span>Europa</span>
							<Calendar className="h-4 w-4 ml-3" />
							<span>4 Set – 20 Set</span>
							<Users className="h-4 w-4 ml-3" />
							<span>2 adultos</span>
						</div>
					</div>

					<div className="text-right">
						{plan.precoOriginal > plan.preco && (
							<p className="text-sm text-gray-500 line-through">
								{plan.precoOriginal.toLocaleString("pt-BR", {
									style: "currency",
									currency: "BRL",
								})}
							</p>
						)}
						<p className="text-3xl font-extrabold text-emerald-700">
							{plan.preco.toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL",
							})}
						</p>
						<button className="mt-3 inline-flex items-center justify-center px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
							Comprar
						</button>
					</div>

					<button
						onClick={onClose}
						className="absolute right-6 top-6 p-2 rounded-lg hover:bg-gray-100"
						aria-label="Fechar"
					>
						<X className="h-6 w-6 text-gray-700" />
					</button>
				</div>

				{/* Resumo “cards” */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
					<div className="text-center p-3 bg-gray-50 rounded-lg">
						<Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
						<p className="text-xs text-gray-600">Cobertura Médica</p>
						<p className="font-semibold text-sm">
							USD {plan.coberturaMedica.toLocaleString()}
						</p>
					</div>
					<div className="text-center p-3 bg-gray-50 rounded-lg">
						<Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
						<p className="text-xs text-gray-600">Bagagem</p>
						<p className="font-semibold text-sm">
							USD {plan.coberturaBagagem.toLocaleString()}
						</p>
					</div>
					<div className="text-center p-3 bg-gray-50 rounded-lg">
						<Plane className="h-5 w-5 text-green-500 mx-auto mb-1" />
						<p className="text-xs text-gray-600">Cancelamento</p>
						<p className="font-semibold text-sm">
							USD {plan.coberturaCancelamento.toLocaleString()}
						</p>
					</div>
					<div className="text-center p-3 bg-gray-50 rounded-lg">
						<CheckCircle className="h-5 w-5 text-purple-500 mx-auto mb-1" />
						<p className="text-xs text-gray-600">COVID-19</p>
						<p className="font-semibold text-sm">
							{plan.coberturaPandemia ? "Incluído" : "Não"}
						</p>
					</div>
				</div>

				{/* Lista de Coberturas (estilo acordeão) */}
				<div className="px-6 pb-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-3">Coberturas Médicas</h3>

					<div className="overflow-hidden rounded-lg border">
						{items.map((row, i) => (
							<AccordionRow
								key={i}
								titulo={row.titulo}
								valor={row.valor}
								extra={row.extra}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function AccordionRow({
	titulo,
	valor,
	extra,
}: {
	titulo: string;
	valor?: string;
	extra?: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-b last:border-b-0">
			<button
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
			>
				<span className="text-sm font-medium text-gray-800">{titulo}</span>
				<div className="flex items-center gap-3">
					{valor && <span className="text-sm text-gray-800">{valor}</span>}
					<span className="p-1 rounded-md bg-white shadow-sm">
						{open ? (
							<Minus className="h-4 w-4 text-gray-600" />
						) : (
							<Plus className="h-4 w-4 text-gray-600" />
						)}
					</span>
				</div>
			</button>

			{open && extra && (
				<div className="px-4 py-3 bg-white text-sm text-gray-700 flex items-start gap-2">
					<Info className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
					<p>{extra}</p>
				</div>
			)}
		</div>
	);
}

/* ============================== */
/*         LISTAGEM + MODAL       */
/* ============================== */
export default function PlanosPage() {
	const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
	const [showComparison, setShowComparison] = useState(false);
	const [filters, setFilters] = useState({ coberturaMedica: "", preco: "", seguradora: "" });

	// estado do modal de detalhes
	const [viewPlanId, setViewPlanId] = useState<number | null>(null);
	const viewPlan = useMemo(
		() => mockPlans.find((p) => p.id === viewPlanId) || null,
		[viewPlanId],
	);

	const handleSelectPlan = (planId: number) => {
		if (selectedPlans.includes(planId)) {
			setSelectedPlans(selectedPlans.filter((id) => id !== planId));
		} else if (selectedPlans.length < 3) {
			setSelectedPlans([...selectedPlans, planId]);
		}
	};

	const getSelectedPlans = () => mockPlans.filter((plan) => selectedPlans.includes(plan.id));
	const formatPrice = (price: number) =>
		price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Compare Planos de Seguro
							</h1>
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

			{/* Conteúdo */}
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
										onChange={(e) =>
											setFilters({
												...filters,
												coberturaMedica: e.target.value,
											})
										}
									>
										<option value="">Qualquer valor</option>
										<option value="30000">USD 30.000</option>
										<option value="40000">USD 40.000</option>
										<option value="60000">USD 60,000</option>
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
										onChange={(e) =>
											setFilters({ ...filters, preco: e.target.value })
										}
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
										onChange={(e) =>
											setFilters({ ...filters, seguradora: e.target.value })
										}
									>
										<option value="">Todas</option>
										<option value="Assist Card">Assist Card</option>
										<option value="Travel Ace">Travel Ace</option>
										<option value="GTA">GTA</option>
										<option value="Vital Card">Vital Card</option>
										<option value="Intermac">Intermac</option>
									</select>
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

							<select className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
								<option>Ordenar por: Melhor preço</option>
								<option>Ordenar por: Maior cobertura</option>
								<option>Ordenar por: Melhor avaliação</option>
							</select>
						</div>

						{/* Cards */}
						<div className="space-y-4">
							{mockPlans.map((plan) => (
								<div
									key={plan.id}
									className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
								>
									<div className="p-6">
										<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
											{/* Info */}
											<div className="flex-1">
												<div className="flex items-start justify-between mb-4">
													<div>
														<div className="flex items-center space-x-3 mb-2">
															<h3 className="text-xl font-bold text-gray-900">
																{plan.plano}
															</h3>
															{plan.destaque && (
																<span
																	className={`px-2 py-1 text-xs font-medium rounded-full ${
																		plan.destaque ===
																		"Mais Vendido"
																			? "bg-green-100 text-green-800"
																			: plan.destaque ===
																					"Melhor Preço"
																				? "bg-blue-100 text-blue-800"
																				: plan.destaque ===
																						"Premium"
																					? "bg-purple-100 text-purple-800"
																					: "bg-orange-100 text-orange-800"
																	}`}
																>
																	{plan.destaque}
																</span>
															)}
														</div>
														<p className="text-gray-600 font-medium">
															{plan.seguradora}
														</p>
														<div className="flex items-center space-x-1 mt-1">
															<div className="flex items-center">
																{[...Array(5)].map((_, i) => (
																	<Star
																		key={i}
																		className={`h-4 w-4 ${i < Math.floor(plan.avaliacoes) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
																	/>
																))}
															</div>
															<span className="text-sm text-gray-600">
																{plan.avaliacoes} (
																{plan.totalAvaliacoes} avaliações)
															</span>
														</div>
													</div>
												</div>

												{/* Highlights */}
												<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
													<div className="text-center p-3 bg-gray-50 rounded-lg">
														<Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
														<p className="text-xs text-gray-600">
															Cobertura Médica
														</p>
														<p className="font-semibold text-sm">
															USD{" "}
															{plan.coberturaMedica.toLocaleString()}
														</p>
													</div>
													<div className="text-center p-3 bg-gray-50 rounded-lg">
														<Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
														<p className="text-xs text-gray-600">
															Bagagem
														</p>
														<p className="font-semibold text-sm">
															USD{" "}
															{plan.coberturaBagagem.toLocaleString()}
														</p>
													</div>
													<div className="text-center p-3 bg-gray-50 rounded-lg">
														<Plane className="h-5 w-5 text-green-500 mx-auto mb-1" />
														<p className="text-xs text-gray-600">
															Cancelamento
														</p>
														<p className="font-semibold text-sm">
															USD{" "}
															{plan.coberturaCancelamento.toLocaleString()}
														</p>
													</div>
													<div className="text-center p-3 bg-gray-50 rounded-lg">
														<CheckCircle className="h-5 w-5 text-purple-500 mx-auto mb-1" />
														<p className="text-xs text-gray-600">
															COVID-19
														</p>
														<p className="font-semibold text-sm">
															{plan.coberturaPandemia
																? "Incluído"
																: "Não"}
														</p>
													</div>
												</div>

												{/* Chips */}
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

											{/* Preço/Ações */}
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
													<p className="text-sm text-gray-600">
														por pessoa
													</p>
												</div>

												<div className="space-y-3">
													<button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
														<span>Selecionar Plano</span>
														<ArrowRight className="h-4 w-4" />
													</button>

													<div className="flex space-x-2">
														<button
															onClick={() =>
																handleSelectPlan(plan.id)
															}
															className={`flex-1 py-2 px-4 rounded-lg border transition-colors flex items-center justify-center space-x-1 ${
																selectedPlans.includes(plan.id)
																	? "bg-blue-50 border-blue-500 text-blue-700"
																	: "border-gray-300 text-gray-700 hover:bg-gray-50"
															}`}
															disabled={
																!selectedPlans.includes(plan.id) &&
																selectedPlans.length >= 3
															}
														>
															<GitCompare className="h-4 w-4" />
															<span className="text-sm">
																{selectedPlans.includes(plan.id)
																	? "Selecionado"
																	: "Comparar"}
															</span>
														</button>

														{/* Eye abre o modal */}
														<button
															onClick={() => setViewPlanId(plan.id)}
															className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
															aria-label="Ver detalhes"
														>
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

						{/* Modal de Comparação */}
						{/* {showComparison && (
              <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Comparar Planos</h2>
                    <button onClick={() => setShowComparison(false)} className="p-2 hover:bg-gray-100 rounded-lg">
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
                            <p className="text-2xl font-bold text-blue-600 mt-2">{formatPrice(plan.preco)}</p>
                          </div>

                          <div className="space-y-3 text-black text-sm">
                            <div className="flex justify-between">
                              <span>Cobertura Médica:</span>
                              <p className="font-medium">USD {plan.coberturaMedica.toLocaleString()}</p>
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

                          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Selecionar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )} */}

						{/* Modal de Comparação – estilo tabela lado a lado */}
						{showComparison && (
							<div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
								<div className="bg-white rounded-lg w-full max-w-7xl max-h-[92vh] overflow-hidden">
									{/* Header */}
									<div className="p-6 border-b flex items-center justify-between">
										<div className="flex items-center gap-3">
											<button
												onClick={() => setShowComparison(false)}
												className="text-sm text-emerald-700 hover:underline"
											>
												Voltar à pesquisa
											</button>
											<span className="text-gray-400">•</span>
											<span className="text-sm text-gray-600">
												Compare os planos selecionados
											</span>
										</div>

										<button
											onClick={() => setShowComparison(false)}
											className="p-2 hover:bg-gray-100 rounded-lg"
										>
											<X className="h-6 w-6" />
										</button>
									</div>

									{/* Topo: cartões compactos de cada plano + Comprar */}
									<div className="px-6 pt-6 overflow-x-auto">
										<div
											className={`grid gap-4`}
											style={{
												gridTemplateColumns: `220px repeat(${getSelectedPlans().length}, minmax(260px,1fr))`,
											}}
										>
											{/* Coluna “voltar/enviar por e-mail” */}
											<div className="min-w-[220px]">
												<div className="border rounded-lg p-4">
													<p className="text-sm font-medium text-gray-700 mb-2">
														Você pesquisou por:
													</p>
													<div className="text-sm text-gray-600 space-y-1">
														<p>Europa</p>
														<p>
															Qui., 04 Set. 2025 - Sáb., 20 Set. 2025
														</p>
													</div>
												</div>

												<button
													className="mt-4 inline-flex items-center gap-2 border rounded-lg px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
													onClick={() =>
														alert("enviar comparação por e-mail")
													}
												>
													<svg
														viewBox="0 0 24 24"
														className="w-4 h-4 fill-current"
													>
														<path d="M2 6l10 7 10-7v12H2z" />
														<path
															d="M2 6l10 7 10-7H2z"
															className="fill-none"
														/>
													</svg>
													Enviar comparação por e-mail
												</button>
											</div>

											{/* Colunas dos planos */}
											{getSelectedPlans().map((plan) => (
												<div key={plan.id} className="border rounded-lg">
													<div className="p-4">
														<h3 className="text-sm font-bold text-gray-900 leading-5">
															{plan.plano}
														</h3>
														<p className="text-xs text-gray-600">
															{plan.seguradora}
														</p>

														<div className="mt-3">
															{plan.precoOriginal > plan.preco && (
																<p className="text-xs text-gray-500 line-through">
																	{formatPrice(
																		plan.precoOriginal,
																	)}
																</p>
															)}
															<div className="flex items-baseline gap-2">
																<p className="text-2xl font-extrabold text-emerald-700">
																	{formatPrice(plan.preco)}
																</p>
																<span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
																	5% off no PIX
																</span>
															</div>
														</div>

														<button
															className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-2 rounded-lg"
															onClick={() =>
																alert(`comprar ${plan.plano}`)
															}
														>
															Comprar
														</button>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Tabela de coberturas */}
									<div className="px-6 pb-6 mt-6 overflow-auto">
										{(() => {
											// monte as linhas a partir do seu benefitsByPlan
											const rowsSet = new Set<string>();
											getSelectedPlans().forEach((p) =>
												(benefitsByPlan[p.id] ?? []).forEach((b) =>
													rowsSet.add(b.titulo),
												),
											);
											const rows = Array.from(rowsSet);

											const getVal = (planId: number, titulo: string) => {
												const found = (benefitsByPlan[planId] ?? []).find(
													(b) => b.titulo === titulo,
												);
												return found?.valor ?? "—";
											};

											return (
												<div className="border rounded-lg overflow-hidden">
													{/* Cabeçalho “Coberturas Médicas” */}
													<div className="bg-gray-50 px-4 py-3 border-b text-sm font-semibold text-gray-800">
														Coberturas Médicas
													</div>

													{/* Linhas */}
													<div className="divide-y">
														{rows.map((titulo, idx) => (
															<div
																key={titulo}
																className={`grid items-center text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
																style={{
																	gridTemplateColumns: `220px repeat(${getSelectedPlans().length}, minmax(260px,1fr))`,
																}}
															>
																{/* célula título (esquerda fixa) */}
																<div className="px-4 py-3 font-medium text-gray-800">
																	{titulo}
																</div>

																{/* valores por plano */}
																{getSelectedPlans().map((plan) => (
																	<div
																		key={plan.id + "-" + titulo}
																		className="px-4 py-3 text-gray-900"
																	>
																		{getVal(plan.id, titulo)}
																	</div>
																))}
															</div>
														))}
													</div>
												</div>
											);
										})()}
									</div>
								</div>
							</div>
						)}

						{/* Modal de Detalhes (Eye) */}
						{viewPlan && (
							<PlanDetailsModal plan={viewPlan} onClose={() => setViewPlanId(null)} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
