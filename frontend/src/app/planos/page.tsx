
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreRegisterForm } from "@/hooks/useRegisterStore";

import { QuoteResponse, QuoteService } from "@/services/quote.service";
import { toast } from "sonner";
import { Activity, ArrowRight, BaggageClaim, Calendar, Eye, FilterIcon, GitCompare, MapPin, SearchIcon, ShieldOff, Star, Users, X } from "lucide-react";
import { FiltersModal, FilterState, initialFilters } from "@/components/planos/FilterModal";
import type { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/planos/Checkbox";
import DestinationSelect from "@/components/Inputs/DestinationSelect";
import { DateRangePicker } from "@/components/Inputs/CustomCalendar";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { mock } from "node:test";
import { PlanDetailsModal } from "@/components/planos/PlanDetialsModal";

/* ============================== */
/*           MOCK DATA            */
/* ============================== */

const coberturaDescriptions: Record<string, string> = {
	"Despesa Médica Hospitalar Total":
		"Valor máximo coberto em despesas médicas e hospitalares.",
	"Cobertura Médica para Prática de Esportes":
		"Atendimento para acidentes ocorridos durante a prática esportiva.",
	"Cobertura Médica para Gestante":
		"Custos relacionados a complicações durante a gestação.",
	"Cobertura Odontológica":
		"Tratamento odontológico emergencial durante a viagem.",
	Bagagem: "Indenização em caso de perda ou extravio de bagagem.",
};

const mockCoberturas = [
  {
    despesa: "USD 60.000",
    bagagem: "USD 1.000 (COMPLEMENTAR)",
  },
  {
    despesa: "USD 150.000",
    bagagem: "USD 1.200 (COMPLEMENTAR)",
  },
  {
    despesa: "USD 40.000",
    bagagem: "USD 800 (COMPLEMENTAR)",
  },
  {
    despesa: "USD 80.000",
    bagagem: "USD 1.200 (COMPLEMENTAR)",
  },
  {
    despesa: "USD 100.000",
    bagagem: "USD 1.000 (COMPLEMENTAR)",
  },
  {
    despesa: "USD 200.000",
    bagagem: "USD 1.500 (COMPLEMENTAR)",
  },
  {
    despesa: "USD 75.000",
    bagagem: "USD 900 (COMPLEMENTAR)",
  },
  {
    despesa: "USD 120.000",
    bagagem: "USD 1.300 (COMPLEMENTAR)",
  },
];
/* Benefícios detalhados por plano (mock configurável). */
export type BenefitItem = { titulo: string; valor?: string; extra?: string };

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
		{
			titulo: "Cobertura Médica para Prática de Esportes",
			valor: "USD 10.000",
		},
		{ titulo: "Cobertura Médica para Gestante", valor: "USD 30.000" },
		{ titulo: "Telemedicina", valor: "SIM" },
		{ titulo: "Cobertura Odontológica", valor: "USD 1.000" },
	],
	2: [
		{ titulo: "Permite emissão em viagem?", valor: "SIM (verificar carência)" },
		{
			titulo: "Validade Geográfica",
			valor: "INTERNACIONAL (exceto EUA e Canadá)",
		},
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
	6: [
		{ titulo: "Permite emissão em viagem?", valor: "NÃO" },
		{ titulo: "Validade Geográfica", valor: "EUROPA" },
		{ titulo: "Franquia de DMH", valor: "NÃO" },
		{
			titulo: "Despesa Médica Hospitalar Total",
			valor: "USD 60,000",
			extra: "Valor total de despesas médicas hospitalares.",
		},
		{ titulo: "Despesa Médica Hospitalar", valor: "USD 60,000" },
		{
			titulo: "Cobertura Médica para Prática de Esportes",
			valor: "USD 10.000",
		},
		{ titulo: "Cobertura Médica para Gestante", valor: "USD 30.000" },
		{ titulo: "Telemedicina", valor: "SIM" },
		{ titulo: "Cobertura Odontológica", valor: "USD 1.000" },
	],
	7: [
		{ titulo: "Permite emissão em viagem?", valor: "SIM (verificar carência)" },
		{
			titulo: "Validade Geográfica",
			valor: "INTERNACIONAL (exceto EUA e Canadá)",
		},
		{ titulo: "Franquia de DMH", valor: "NÃO" },
		{ titulo: "Despesa Médica Hospitalar Total", valor: "USD 40.000" },
		{ titulo: "Despesa Médica Hospitalar", valor: "USD 40.000" },
		{ titulo: "Telemedicina", valor: "SIM" },
	],
	8: [
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
	9: [
		{ titulo: "Permite emissão em viagem?", valor: "NÃO" },
		{ titulo: "Validade Geográfica", valor: "EUROPA" },
		{ titulo: "Despesa Médica Hospitalar Total", valor: "USD 30.000" },
	],
};

/* ============================== */
/*     FILTRO (MODAL CHECKBOX)    */
/* ============================== */

interface searchForm {
	destination: string | undefined;
	range: DateRange | undefined;
	passengers: string | number;
}

export default function PlanosPage() {
  const { formData } = usePreRegisterForm();
  const [plans, setPlans] = useState<QuoteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [viewPlanId, setViewPlanId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState<FilterState>(initialFilters);
	const [form, setForm] = useState<searchForm>({
			destination: formData?.destination ?? "europa", // se não vier destino, usa string vazia
			range: formData?.range ?? {
				from: new Date(), // hoje
				to: new Date(),   // hoje também (pelo menos válido)
			},
			passengers: formData?.passengers ?? 1,
			});

  
  /** Função principal — consulta cotações */
  const fetchQuotes = async () => {
	console.log("form", form, formData)
  if (!formData?.destination || !formData.range?.from || !formData.range?.to) {
    toast.error("Informe destino e datas antes de cotar");
    return;
  }
  let quoteDto;	
  try {
    setLoading(true);
	if(!form?.destination || !form?.range?.from || !form?.range?.to){
	const departure =
      formData.range.from instanceof Date
        ? formData.range.from
        : new Date(formData.range.from);

    const arrival =
      formData.range.to instanceof Date
        ? formData.range.to
        : new Date(formData.range.to);

     quoteDto = {
      slug: formData.destination,
      departureDate: departure.toISOString().split("T")[0],
      returnDate: arrival.toISOString().split("T")[0],
      passengers: [{ age: 30 }], /// IDADE TRAVADA POR ENQUANTO NÃO É VARIÁVEL
    };
	}else{
		 const departure =
      form.range.from instanceof Date
        ? form.range.from
        : new Date(form.range.from);

    const arrival =
      form.range.to instanceof Date
        ? form.range.to
        : new Date(form.range.to);

	quoteDto = {
      slug: form.destination,
      departureDate: departure.toISOString().split("T")[0],
      returnDate: arrival.toISOString().split("T")[0],
      passengers: [{ age: 30 }], /// IDADE TRAVADA POR ENQUANTO NÃO É VARIÁVEL
    };
	}
   


    const response = await QuoteService.calculate(quoteDto);
    setPlans(response);
  } catch (error) {
    console.error("Erro ao calcular cotação:", error);
    toast.error("Erro ao buscar cotações");
  } finally {
    setLoading(false);
  }
  };
   console.log(plans)
  /** ⚡ useEffect dispara só quando o formData está pronto */
  useEffect(() => {
    if (formData?.destination && formData?.range?.from && formData?.range?.to) {
      fetchQuotes();
    }
  }, [formData?.destination, formData?.range?.from, formData?.range?.to]);


	// const topPlans = plans.filter((p) => p.topCard);
	// const otherPlans = plans.filter((p) => !p.topCard);
	const minhaDataI = new Date(formData?.range?.from || "");

	const diaI = String(minhaDataI.getDate()).padStart(2, "0");
	const mesI = String(minhaDataI.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
	const anoI = minhaDataI.getFullYear();

	const dataI = `${diaI}/${mesI}/${anoI}`;

	const minhaDataF = new Date(form?.range?.to || "");
	minhaDataF.setDate(minhaDataF.getDate()); // Adiciona 16 dias

	const diaF = String(minhaDataF.getDate()).padStart(2, "0");
	const mesF = String(minhaDataF.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
	const anoF = minhaDataF.getFullYear();
	const dataF = `${diaF}/${mesF}/${anoF}`;
		useEffect(() => {
			setForm({
				destination: formData?.destination,
				range: formData?.range,
				passengers: formData?.passengers || 1,	
			});
		}, [formData]);
  /** ======= Loading State ======= */
   const labelAgeGroup = (g: { start: number; end: number }) => `${g.start}-${g.end}`;

const planHasCovid = (p: QuoteResponse) =>
  (p.benefits || []).some(b => /covid/i.test(b.name));

	const filteredPlans = useMemo(() => {
  return plans.filter((p) => {
    // Seguradoras
    if (filters.insurers.length && !filters.insurers.includes(p.provider_name)) {
      return false;
    }

    // Faixa etária (string "start-end") – OR: o plano deve cobrir pelo menos uma faixa escolhida
    if (
      filters.ageGroups.length &&
      !(p.ageGroups || []).some(g => filters.ageGroups.includes(labelAgeGroup(g)))
    ) {
      return false;
    }

    // Valor de cobertura médica (totalGroupValue) – OR
    if (
      filters.coverageValues.length &&
      !(p.ageGroups || []).some(g => filters.coverageValues.includes(g.totalGroupValue))
    ) {
      return false;
    }

    // Cobertura COVID (derivada dos benefícios)
    if (filters.covid.length) {
      const hasCovid = planHasCovid(p);
      const pediuCom = filters.covid.includes("com");
      const pediuSem = filters.covid.includes("sem");
      // Se só "com" estiver selecionado, precisa ter covid
      if (pediuCom && !pediuSem && !hasCovid) return false;
      // Se só "sem" estiver selecionado, não pode ter covid
      if (pediuSem && !pediuCom && hasCovid) return false;
      // Se ambos selecionados, não filtra por covid (cai aqui sem retornar)
    }

    // Benefícios – AND: o plano precisa conter todos os selecionados
    if (
      filters.benefits.length &&
      !filters.benefits.every(b => (p.benefits || []).some(pb => pb.name === b))
    ) {
      return false;
    }

    return true;
  });
}, [plans, filters]);


	const viewPlan = useMemo(
		() => plans.find((p) => p.code === viewPlanId) || null,
		[viewPlanId],
	);
	const handleSelectPlan = (planId: number) => {
		setSelectedPlans((cur) =>
			cur.includes(planId)
				? cur.filter((id) => id !== planId)
				: cur.length < 3
					? [...cur, planId]
					: cur,
		);
	};
	const getSelectedPlans = () => plans.filter((plan) => selectedPlans.includes(plan.code));
	const formatPrice = (price: number) =>
		price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
	
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

	const handleSearch = async () =>{
		await fetchQuotes()
	} 
     const options = useMemo(() => {
  const coverage = new Set<number>();
  const insurers = new Set<string>();
  const ageGroups = new Set<string>();
  const benefits = new Set<string>();

  for (const p of plans) {
    insurers.add(p.provider_name);
    for (const g of p.ageGroups || []) {
      if (typeof g.totalGroupValue === "number") coverage.add(g.totalGroupValue);
      ageGroups.add(`${g.start}-${g.end}`);
    }
    for (const b of p.benefits || []) {
      benefits.add(b.name);
    }
  }

  return {
    coverageValues: [...coverage].sort((a, b) => a - b),
    covid: ["com", "sem"] as ("com" | "sem")[],
    insurers: [...insurers].sort(),
    ageGroups: [...ageGroups],
    benefits: [...benefits].sort(),
  };
}, [plans]);
	return (
		<div className="bg-gray-50 min-h-screen">
			{/* Header */}
			 {loading ? (
        // 👇 Mantém o mesmo estilo, mas não dá return precoce
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          Carregando planos...
        </div>
      ) : (
			<div>
				<div className="bg-white shadow-sm border-b">
					<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
							<div className="text-center sm:text-left">
								<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
									Compare Planos de Seguro
								</h1>
								<p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
									Encontre o seguro de viagem perfeito para sua próxima aventura
								</p>
							</div>
							<div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 mt-3 sm:mt-0">
								<div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
									<MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
									<span className="truncate max-w-[120px] sm:max-w-none">{form ? form.destination : "Selecione um destino"}</span>
								</div>
								<div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
									<Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
									<span>
										{form ? `${dataI} - ${dataF}` : "Selecione as datas"}
									</span>
								</div>
								<div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
									<Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
									<span>
										{form
											? `${form?.passengers} passageiro${Number(form?.passengers) > 1 ? "s" : ""}`
											: "Passageiros"}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
					<div className="text-sm bg-blue-300 text-gray-700 flex items-center justify-center">
						<div className="w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4">
							<DestinationSelect
								data={form?.destination || ""}
								setData={(value) =>
									setForm((prev) => ({ ...prev, destination: value }))
								}
							/>
							<div className="col-span-1 md:col-span-2 lg:col-span-2">
								<DateRangePicker
									onChange={(value) => {
										setForm((prev) => ({ ...prev, range: value }));
									}}
									minDate={new Date()}
									months={1}
									range={form?.range}
								/>
							</div>
							<Button 
							onClick={()=>handleSearch()}
							className="inline-flex items-center justify-center h-[48px] sm:h-[52px] gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-sm sm:text-base">
								
								<SearchIcon className="h-3 w-3 sm:h-4 sm:w-4" />
								<span>Buscar</span>
							</Button>
						</div>
					</div>
				</div>
				{/* Conteúdo */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6  py-8">
					<div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
				
						<div className="flex flex-col gap-2 jusrify-center">
							<div className="flex items-center gap-2 justify-center w-full mb-4">
								<h1 className="text-3xl font-semibold">
									Encontre os melhores planos para sua viagem!
								</h1>
							</div>
							{/* TOP Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer mb-6">
							{currentPlans.slice(0, 3).map((plan) => (
								<div
								key={plan.code}
								className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col" // flex vertical
								>
								{/* Conteúdo do card */}
								<div>
									{/* Plano e Seguradora */}
									<div className="col-span-1 flex  rounded-lg bg-gradient-to-r from-blue-50 to-cyan-300 h-[84px] items-center justify-center gap-3 p-3">
									<img
										src={
										plan.provider_code === "hero"
											? "/seguradoras/hero.png"
											: "/seguradoras/my-travel-assist.png"
										}
										alt={plan.provider_name}
										className="w-24 h-auto object-contain"
									/>
									<h3 className="text-sm font-bold ">{plan.name}</h3>
									</div>

									<div className="mt-4">
									{plan.totalPrice > plan.totalPriceWithPixDiscount && (
										<p className="line-through text-gray-400 text-sm">
										{(plan.totalPrice*1.05).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
										</p>
									)}
									<div className="flex items-baseline space-x-1">
										<p className="text-2xl font-bold text-blue-600">
										{plan.totalPrice.toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
										</p>
										<p>/por pessoa no Pix</p>
									</div>
									<p className="text-sm text-gray-600">ou em até 12x no cartão</p>
									</div>

									{/* Benefícios */}
									<ul className="mt-4 space-y-1 text-sm text-gray-700">
									{plan.benefits.map((b, i) => (
										<li key={i}>• {b.name}</li>
									))}
									</ul>
								</div>

								{/* Ações (fixadas no rodapé) */}
								<div className="mt-auto pt-6 space-y-2">
									<button className="w-full bg-blue-600 hover:cursor-pointer hover:animate-pulse text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
									<span>Selecionar Plano</span>
									<ArrowRight className="h-4 w-4" />
									</button>
									<button
									onClick={() => {
										handleSelectPlan(plan.code);
										if (
										!selectedPlans.includes(plan.code) &&
										selectedPlans.length >= 5
										) {
										setShowComparison(true);
										}
									}}
									className={`flex-1 py-2 px-4 rounded-lg w-full hover:cursor-pointer border transition-colors flex items-center justify-center space-x-1 ${
										selectedPlans.includes(plan.code)
										? "bg-blue-50 border-blue-500 text-blue-700"
										: "border-gray-300 text-gray-700 hover:bg-gray-50"
									}`}
									disabled={
										!selectedPlans.includes(plan.code) && selectedPlans.length >= 4
									}
									>
									<GitCompare className="h-4 w-4" />
									<span className="text-sm">
										{selectedPlans.includes(plan.code) ? "Selecionado" : "Comparar"}
									</span>
									</button>
								</div>
								</div>
							))}
							</div>

							{/* Barra de ações */}
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
								<div className="flex items-center gap-3">
									<button
										onClick={() => setIsFilterOpen(true)}
										className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-blue-700 border-blue-700 hover:bg-blue-50"
									>
										<FilterIcon className="h-4 w-4" />
										Filtros
									</button>
									<span className="text-sm text-gray-600">
										{plans.length} planos encontrados
									</span>
								</div>
								<select className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
									<option>Ordenar por: Melhor preço</option>
									<option>Ordenar por: Maior cobertura</option>
									<option>Ordenar por: Melhor avaliação</option>
								</select>
							</div>


							{/* Filtros aplicados */}
{(filters.insurers.length > 0 ||
  filters.ageGroups.length > 0 ||
  filters.benefits.length > 0) && (
  <div className="flex flex-wrap items-center gap-2 mt-4">
    <span className="text-sm text-gray-600 font-medium">
      Filtros aplicados:
    </span>

    {/* Insurers */}
    {filters.insurers.map((insurer) => (
      <span
        key={insurer}
        className="flex items-center gap-1 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {insurer}
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              insurers: prev.insurers.filter((i) => i !== insurer),
            }))
          }
          className="ml-1 hover:text-red-300"
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    ))}

    {/* Faixa Etária */}
    {filters.ageGroups.map((age) => (
      <span
        key={age}
        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {age}
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              ageGroups: prev.ageGroups.filter((f) => f !== age),
            }))
          }
          className="ml-1 hover:text-red-300"
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    ))}

    {/* Benefícios */}
    {filters.benefits.map((benefit) => (
      <span
        key={benefit}
        className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {benefit}
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              benefits: prev.benefits.filter((b) => b !== benefit),
            }))
          }
          className="ml-1 hover:text-red-300"
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    ))}

    {/* Botão limpar tudo */}
    <button
      onClick={() => setFilters(initialFilters)}
      className="ml-2 text-xs text-blue-700 hover:underline"
    >
      Limpar todos os filtros
    </button>
  </div>
)}


							{/* Cards */}
							<div className="mt-6 border rounded-lg  space-y-6 overflow-hidden">
								{/* Cabeçalho estilo tabela */}
								<div className="grid grid-cols-8 bg-gray-600 text-gray-100 text-sm font-semibold border-b">
									<div className="col-span-1  p-3">Seguradora</div>
									<div className="col-span-3   p-3">Plano</div>
									<div className="col-span-2   p-3">Despesa médica e seguro bagagem</div>
									<div className="col-span-2  p-3 text-left">Total por segurado</div>
								</div>

								{/* Linhas de planos */}
								{currentPlans.map((plan, index) => (
									<div
									key={plan.code}
									className="grid grid-cols-8 items-center border-b bg-white hover:bg-gray-50 transition"
									>
									{/* Coluna Seguradora */}
									<div className="col-span-1 flex items-center justify-center gap-3 p-3">
										<img
										src={
											plan.provider_code === "hero"
											? "/seguradoras/hero.png"
											: "/seguradoras/my-travel-assist.png"
										}
										alt={plan.provider_name}
										className="w-24 h-auto object-contain"
										/>
										
									</div>

										{/* Coluna Plano */}
										<div className="col-span-3 p-3">
											<h3 className="font-semibold text-gray-900 text-lg mb-1">
											{plan.name}
											</h3>
											<p className="text-sm text-gray-600">
											Faixa etária: {plan.ageGroups?.[plan.ageGroups.length-1]?.start} a{" "}
											{plan.ageGroups?.[plan.ageGroups.length - 1]?.end} anos
											</p>
											<p className="text-sm text-gray-600">
											{plan.ageGroups?.[plan.ageGroups.length-1]?.price
												? `R$ ${
														(Number(plan.ageGroups[plan.ageGroups.length-1].price) * plan.dolar * plan.days).toFixed(2)
													
													}`
												: ""}
											</p>
											<button
											onClick={() => setViewPlanId(plan.code)}
											className="text-normal cursor-pointer text-blue-700 font-medium mt-1 hover:underline">
												Ver a cobertura completa
											</button>
										</div>

										{/* Coluna Despesa médica e bagagem */}
										<div className="col-span-2 p-3 text-sm text-gray-700">
											<p className="font-semibold">Despesa Médica Hospitalar</p>
											<p className="text-xs mb-2">{mockCoberturas?.[index].despesa}</p>
											<p className="font-semibold">Seguro bagagem</p>
											<p className="text-xs">{mockCoberturas?.[index].bagagem}</p>
										</div>

										{/* Coluna Total por segurado */}
										<div className="col-span-2 bg-gray-100  p-3 text-left">
											<div className="
											flex flex-auto">
												<span className="text-normal mr-1 line-through">
													{formatPrice(plan.totalPrice * 1.05)/*valor do pix*/} 
												</span>
												<p className="text-normal text-gray-700" >10x sem juros no cartão</p>
											</div>
											<div className="flex flex-row gap-2">
												<p className="text-2xl font-bold text-green-700">
												
								
												{formatPrice(plan.totalPrice)}
												</p>
													<div
														className="relative bg-no-repeat bg-cover 	h-[18px] mt-2 bg-center w-28"
														style={{ backgroundImage: `url(/images/icons/pixDiscount.svg)` }}
													>
															<span className="text-xs font-medium text-white relative left-6 bottom-1">5% off no PIX</span>
													</div>
											</div>
											<p className="text-xs text-gray-600 mb-2">/ preço por pessoa</p>
											<div className="flex flex-row items-end gap-2">
											<button
									onClick={() => {
										handleSelectPlan(plan.code);
										if (
										!selectedPlans.includes(plan.code) &&
										selectedPlans.length >= 5
										) {
										setShowComparison(true);
										}
									}}
									className={`flex-1 py-2 px-4 rounded-lg w-full hover:cursor-pointer border transition-colors flex items-center justify-center space-x-1 ${
										selectedPlans.includes(plan.code)
										? "bg-blue-50 border-blue-500 text-blue-700"
										: "border-gray-300 text-gray-700 hover:bg-gray-50"
									}`}
									disabled={
										!selectedPlans.includes(plan.code) && selectedPlans.length >= 4
									}
									>
									<GitCompare className="h-4 w-4" />
									<span className="text-sm">
										{selectedPlans.includes(plan.code) ? "Selecionado" : "Comparar"}
									</span>
									</button>
											<button className="px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 flex items-center gap-1">
												Selecionar seguro
											</button>
											</div>
										</div>
										</div>
								))}
								{totalPages > 1 && (
									<div className="mt-6 flex justify-center">
										<Pagination>
										<PaginationContent>
											<PaginationItem>
											<PaginationPrevious
											    
												onClick={() =>
												setCurrentPage((p) => Math.max(1, p - 1))
												}
												className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
											/>
											</PaginationItem>

											{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
											<PaginationItem key={page}>
												<PaginationLink
												onClick={() => setCurrentPage(page)}
												isActive={page === currentPage}
												>
												{page}
												</PaginationLink>
											</PaginationItem>
											))}

											<PaginationItem>
											<PaginationNext
												onClick={() =>
												setCurrentPage((p) => Math.min(totalPages, p + 1))
												}
												className={
												currentPage === totalPages ? "pointer-events-none opacity-50" : ""
												}
											/>
											</PaginationItem>
										</PaginationContent>
										</Pagination>
									</div>
									)}
							</div>

							{/* Barra flutuante de comparação */}
							{selectedPlans.length > 1 && (
								<div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
									<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
										{/* Planos selecionados */}
										<div className="flex flex-row justify-around h-auto py-1 items-center gap-4 overflow-x-auto w-full">
											{getSelectedPlans().map((plan) => (
												<div
													key={plan.code}
													className="relative bg-gray-200 h-16 w-48 border rounded-lg px-3 py-2 flex items-center gap-2"
													>
													<img
														src={
														plan.provider_code === "hero"
															? "/seguradoras/hero.png"
															: "/seguradoras/my-travel-assist.png"
														}
														alt={plan.provider_name}
														className="w-24 h-auto object-contain"
													/>

													{/* Botão remover no canto superior direito */}
													<button
														onClick={() =>
														setSelectedPlans((cur) => cur.filter((id) => id !== plan.code))
														}
														className="absolute top-1 right-1 cursor-pointer text-red-500 hover:text-red-700"
													>
														<X className="h-4 w-4" />
													</button>
													</div>

											))}
										</div>
										{/* Botão comparar */}
										<button
											onClick={() => setShowComparison(true)}
											className="flex-shrink-0 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg"
										>
											Comparar {selectedPlans.length} planos
										</button>
									</div>
								</div>
							)}
							{/* Modal de Comparação (mantido) */}
							{showComparison && (
								<div className="fixed inset-0 bg-black/50 z-99	 flex items-center justify-center p-4">
									<div className="bg-white rounded-lg w-full  max-w-7xl max-h-[92vh] pb-4 overflow-y-auto">
										<div className="p-6 border-b flex items-center justify-between">
											<div className="flex items-center gap-3">
												<button
													onClick={() => setShowComparison(false)}
													className="text-sm text-blue-700 hover:underline"
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
										<div className="px-6 pt-6 overflow-x-auto ">
											<div
												className={`grid gap-4`}
												style={{
													gridTemplateColumns: `220px repeat(${getSelectedPlans().length}, minmax(260px,1fr))`,
												}}
											>
												<div className="min-w-[220px]">
													<div className="border rounded-lg p-4">
														<p className="text-sm font-medium text-gray-700 mb-2">
															Você pesquisou por:
														</p>
														<div className="text-sm text-gray-600 space-y-1">
															<p>Europa</p>
															<p>Qui., 04 Set. 2025 - Sáb., 20 Set. 2025</p>
														</div>
													</div>
													<button
														className="mt-4 inline-flex items-center gap-2 border rounded-lg px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
														onClick={() => alert("enviar comparação por e-mail")}
													>
														<svg
															viewBox="0 0 24 24"
															className="w-4 h-4 fill-current"
														>
															<path d="M2 6l10 7 10-7v12H2z" />
															<path d="M2 6l10 7 10-7H2z" className="fill-none" />
														</svg>
														Enviar comparação por e-mail
													</button>
												</div>
												{getSelectedPlans().map((plan) => (
													<div key={plan.code} className="border rounded-lg">
														<div className="p-4">
															<h3 className="text-sm font-bold text-gray-900 leading-5">
																{plan.name}
															</h3>
															<p className="text-xs text-gray-600">
																{plan.provider_name}
															</p>
															<div className="mt-3">
																{/* {plan.totalPrice > plan.totalPrice && (
																	<p className="text-xs text-gray-500 line-through">
																		{formatPrice(plan.precoOriginal)}
																	</p>
																)} */}
																<div className="flex items-baseline gap-2">
																	<p className="text-2xl font-extrabold text-blue-700">
																		{formatPrice(plan?.totalPrice)}
																	</p>
																	<span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
																		5% off no PIX
																	</span>
																</div>
															</div>
															<button
																className="mt-3 w-full bg-blue-700 hover:cursor-pointer hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded-lg"
																onClick={() => alert(`comprar ${plan.name}`)}
															>
																Comprar
															</button>
														</div>
													</div>
												))}
											</div>
										</div>
										<div className="px-6 pb-6 mt-6 overflow-auto">
											{(() => {
												const rowsSet = new Set<string>();
												getSelectedPlans().forEach((p) =>
													(benefitsByPlan[p.code] ?? []).forEach((b) =>
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
													<div className="border rounded-lg overflow-visible">
														<div className="bg-gray-50 px-4 py-3 border-b text-sm font-semibold text-gray-800">
															Coberturas Médicas
														</div>
														<div className="divide-y">
															{rows.map((titulo, idx) => (
																<div
																	key={titulo}
																	className={`grid items-center text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
																	style={{
																		gridTemplateColumns: `220px repeat(${getSelectedPlans().length}, minmax(260px,1fr))`,
																	}}
																>
																	<div className="px-4 py-3 font-medium text-gray-800 relative group cursor-default">
																		{titulo}
																		{/* Tooltip */}
																		{coberturaDescriptions[titulo] && (
																			<div
																				className="absolute top-1/2 left-full ml-2 -translate-y-1/2
																		hidden group-hover:block bg-gray-300 text-gray-800 text-xs
																		px-3 py-1 rounded-lg  shadow-md whitespace-nowrap border z-[9999]"
																			>
																				{coberturaDescriptions[titulo]}
																			</div>
																		)}
																	</div>
																	{getSelectedPlans().map((plan) => (
																		<div
																			key={plan.code + "-" + titulo}
																			className="px-4 py-3 text-gray-900"
																		>
																			{getVal(plan.code, titulo)}
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
							 Modal de Detalhes
							{viewPlan && (
								<PlanDetailsModal
									plan={viewPlan}
									onClose={() => setViewPlanId(null)}
								/>
							)} 
						</div>
					</div>
				</div>
				{/* Modal de Filtros */}
				 <FiltersModal
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					onApply={() => setIsFilterOpen(false)}
					onClear={() => setFilters(initialFilters)}
					state={filters}
					setState={setFilters}
					options={options}
				/>
			</div>
	  )}
		</div>
	);
}
