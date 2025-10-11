"use client";

import { DateRangePicker } from "@/components/Inputs/CustomCalendar";
import DestinationSelect from "@/components/Inputs/DestinationSelect";
import { Button } from "@/components/ui/button";
import { usePreRegisterForm } from "@/hooks/useRegisterStore";
import {
    Activity,
    ArrowRight,
    BaggageClaim,
    Calendar,
    CheckCircle,
    Eye,
    EyeIcon,
    Filter as FilterIcon,
    GitCompare,
    Heart,
    Info,
    MapPin,
    Minus,
    Plane,
    Plus,
    Search,
    SearchCheck,
    SearchIcon,
    Shield,
    ShieldOff,
    Star,
    Users,
    Wallet,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

/* ============================== */
/*           MOCK DATA            */
/* ============================== */
type Plan = {
    id: number;
    seguradora: string;
    plano: string;
    preco: number;
    precoOriginal: number;
    precoCartao: number;
    coberturaMedica: number; // DMH
    coberturaBagagem: number;
    coberturaCancelamento: number;
    coberturaPandemia: boolean;
    coberturaPraticaEsportiva: boolean;
    avaliacoes: number;
    totalAvaliacoes: number;
    destaque: string;
    beneficios: string[];
    faixaEtaria?: string;
    aumentoIdade?: string;

    topCard?: boolean; // chave que vai separar destaque
};
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

const mockPlans: Plan[] = [
    {
        id: 1,
        seguradora: "Assist Card",
        plano: "AC 60 Europa",
        preco: 89.9,
        precoOriginal: 99.9,
        precoCartao: 127.6,
        coberturaMedica: 60000,
        coberturaBagagem: 1200,
        coberturaCancelamento: 5000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: true,
        avaliacoes: 4.8,
        totalAvaliacoes: 1247,
        destaque: "Mais Vendido",
        topCard: true,
        beneficios: [
            "Telemedicina 24h",
            "Cancelamento de viagem",
            "Prática de esportes",
            "Atendimento em português",
        ],
        faixaEtaria: "Faixa etária: 0 a 70 anos",
        aumentoIdade: "R$ 179,80 maiores de 64 anos",
    },
    {
        id: 2,
        seguradora: "Travel Ace",
        plano: "TA 40 Especial",
        preco: 67.5,
        precoOriginal: 75.0,
        precoCartao: 95.0,
        coberturaMedica: 40000,
        coberturaBagagem: 800,
        coberturaCancelamento: 3000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: false,
        avaliacoes: 4.6,
        totalAvaliacoes: 892,
        destaque: "Melhor Preço",
        topCard: true,
        beneficios: [
            "Atendimento em português",
            "Cancelamento de viagem",
            " Assistência jurídica",
            "Regresso sanitário",
            "Cobertura odontológica",
        ],
        faixaEtaria: "Faixa etária: 0 a 75 anos",
        aumentoIdade: "R$ 252,48 maiores de 64 anos",
    },
    {
        id: 3,
        seguradora: "GTA",
        plano: "GTA 75 Euromax",
        preco: 125.8,
        precoOriginal: 140.0,
        precoCartao: 149.0,
        coberturaMedica: 75000,
        coberturaBagagem: 1500,
        coberturaCancelamento: 8000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: true,
        avaliacoes: 4.9,
        totalAvaliacoes: 2156,
        destaque: "Premium",
        topCard: true,
        beneficios: [
            "Atendimento médico hospitalar",
            "Cancelamento de viagem",
            "Prática de esportes",
            "Cobertura odontológica",
        ],
        faixaEtaria: "Faixa etária: 0 a 80 anos",
        aumentoIdade: "R$ 251,60 maiores de 64 anos",
    },
    {
        id: 4,
        seguradora: "Vital Card",
        plano: "VC 30 Basic",
        preco: 45.9,
        precoOriginal: 52.0,
        precoCartao: 55.0,
        coberturaMedica: 30000,
        coberturaBagagem: 600,
        coberturaCancelamento: 2000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: false,
        avaliacoes: 4.4,
        totalAvaliacoes: 567,
        destaque: "Econômico",
        beneficios: [
            "Atendimento 24h",
            "Cancelamento de viagem",
            "Regresso sanitário",
        ],
        faixaEtaria: "Faixa etária: 0 a 70 anos",
        aumentoIdade: "R$ 137,70 maiores de 64 anos",
    },
    {
        id: 5,
        seguradora: "Intermac",
        plano: "I60 Europa",
        preco: 98.7,
        precoOriginal: 110.0,
        precoCartao: 115.0,
        coberturaMedica: 60000,
        coberturaBagagem: 1000,
        coberturaCancelamento: 6000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: true,
        avaliacoes: 4.7,
        totalAvaliacoes: 1034,
        destaque: "",
        beneficios: [
            "Telemedicina",
            "Cancelamento de viagem",
            "Prática de esportes",
            "Fisioterapia",
        ],
        faixaEtaria: "Faixa etária: 0 a 75 anos",
        aumentoIdade: "R$ 252,48 maiores de 64 anos",
    },
    {
        id: 6,
        seguradora: "Universal Assistance",
        plano: "UA 50 Classic",
        preco: 72.3,
        precoOriginal: 82.0,
        precoCartao: 89.9,
        coberturaMedica: 50000,
        coberturaBagagem: 900,
        coberturaCancelamento: 4000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: false,
        avaliacoes: 4.5,
        totalAvaliacoes: 678,
        destaque: "",
        beneficios: [
            "Atendimento 24h",
            "Transporte médico",
            "Regresso sanitário",
            "Cobertura odontológica",
        ],
        faixaEtaria: "Faixa etária: 0 a 75 anos",
        aumentoIdade: "R$ 199,90 maiores de 64 anos",
    },
    {
        id: 7,
        seguradora: "Omint",
        plano: "Omint Global",
        preco: 145.5,
        precoOriginal: 160.0,
        precoCartao: 170.0,
        coberturaMedica: 100000,
        coberturaBagagem: 2000,
        coberturaCancelamento: 10000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: true,
        avaliacoes: 4.9,
        totalAvaliacoes: 312,
        destaque: "",
        beneficios: [
            "Atendimento hospitalar premium",
            "Assistência jurídica",
            "Cancelamento de viagem",
            "Prática de esportes",
        ],
        faixaEtaria: "Faixa etária: 0 a 85 anos",
        aumentoIdade: "R$ 320,00 maiores de 70 anos",
    },
    {
        id: 8,
        seguradora: "SulAmérica",
        plano: "Prestige 100",
        preco: 199.9,
        precoOriginal: 220.0,
        precoCartao: 230.0,
        coberturaMedica: 100000,
        coberturaBagagem: 2500,
        coberturaCancelamento: 12000,
        coberturaPandemia: false,
        coberturaPraticaEsportiva: true,
        avaliacoes: 4.8,
        totalAvaliacoes: 980,
        destaque: "",
        beneficios: [
            "Atendimento hospitalar completo",
            "Cancelamento de viagem",
            "Prática de esportes",
            "Atendimento odontológico",
        ],
        faixaEtaria: "Faixa etária: 0 a 85 anos",
        aumentoIdade: "R$ 380,00 maiores de 70 anos",
    },
];

/* Benefícios detalhados por plano (mock configurável). */
type BenefitItem = { titulo: string; valor?: string; extra?: string };

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
};

/* ============================== */
/*     FILTRO (MODAL CHECKBOX)    */
/* ============================== */

type FilterState = {
    medicalMin: number[]; // DMH mín.
    covid: ("com" | "sem")[]; // Cobertura COVID
    insurers: string[]; // Seguradoras
    faixaEtaria: string[]; // Faixa etária (string do mock)
    benefits: string[]; // Benefícios (do array do plano)
};

const initialFilters: FilterState = {
    medicalMin: [],
    covid: [],
    insurers: [],
    faixaEtaria: [],
    benefits: [],
};

function uniq<T>(arr: T[]) {
    return Array.from(new Set(arr));
}

function Checkbox({
    checked,
    onChange,
    label,
    id,
}: {
    checked: boolean;
    onChange: () => void;
    label: string;
    id: string;
}) {
    return (
        <label
            htmlFor={id}
            className="flex items-center gap-2 cursor-pointer select-none py-1.5"
        >
            <input
                id={id}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                checked={checked}
                onChange={onChange}
            />
            <span className="text-sm text-gray-800">{label}</span>
        </label>
    );
}

function FiltersModal({
    isOpen,
    onClose,
    onApply,
    onClear,
    state,
    setState,
    options,
}: {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    onClear: () => void;
    state: FilterState;
    setState: React.Dispatch<React.SetStateAction<FilterState>>;
    options: {
        medicalMins: number[];
        covid: ("com" | "sem")[];
        insurers: string[];
        faixaEtaria: string[];
        benefits: string[];
    };
}) {
    if (!isOpen) return null;

    // helpers toggle
    const toggleNumber = (key: keyof FilterState, value: number) => {
        setState((s) => {
            const arr = s[key] as number[];
            return {
                ...s,
                [key]: arr.includes(value)
                    ? arr.filter((v) => v !== value)
                    : [...arr, value],
            };
        });
    };
    const toggleString = <K extends keyof FilterState>(key: K, value: string) => {
        setState((s) => {
            const arr = s[key] as string[];
            return {
                ...s,
                [key]: arr.includes(value)
                    ? arr.filter((v) => v !== value)
                    : [...arr, value],
            };
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Topbar */}
                <div className="bg-blue-700 text-white px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold">
                        <FilterIcon className="w-5 h-5" />
                        <span>Filtros</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-blue-600/40"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Grid opções */}
                <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Valor de Cobertura Médica
                        </h4>
                        <div>
                            {options.medicalMins.map((v) => (
                                <Checkbox
                                    key={v}
                                    id={`med-${v}`}
                                    checked={state.medicalMin.includes(v)}
                                    onChange={() => toggleNumber("medicalMin", v)}
                                    label={`DMH mín. $${v.toLocaleString("en-US")}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Faixa Etária</h4>
                        <div>
                            {options.faixaEtaria.map((f) => (
                                <Checkbox
                                    key={f}
                                    id={`faixa-${f}`}
                                    checked={state.faixaEtaria.includes(f)}
                                    onChange={() => toggleString("faixaEtaria", f)}
                                    label={f}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Seguradoras</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            {options.insurers.map((s) => (
                                <Checkbox
                                    key={s}
                                    id={`seg-${s}`}
                                    checked={state.insurers.includes(s)}
                                    onChange={() => toggleString("insurers", s)}
                                    label={s}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                            Valor de Cobertura COVID
                        </h4>
                        {/* Nosso mock tem apenas boolean (com/sem) */}
                        {options.covid.map((c) => (
                            <Checkbox
                                key={c}
                                id={`covid-${c}`}
                                checked={state.covid.includes(c)}
                                onChange={() => toggleString("covid", c)}
                                label={c === "com" ? "Com cobertura" : "Sem cobertura"}
                            />
                        ))}
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-2">Benefícios</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            {options.benefits.map((b) => (
                                <Checkbox
                                    key={b}
                                    id={`ben-${b}`}
                                    checked={state.benefits.includes(b)}
                                    onChange={() => toggleString("benefits", b)}
                                    label={b}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer ações */}
                <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
                    <button
                        onClick={onClear}
                        className="px-4 py-2 rounded-lg border text-blue-700 border-blue-700 hover:bg-blue-50 text-sm font-medium"
                    >
                        Limpar filtros
                    </button>
                    <button
                        onClick={onApply}
                        className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-sm font-semibold"
                    >
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}

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
                <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">{plan.plano}</h2>
                            {plan.destaque && (
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        plan.destaque === "Mais Vendido"
                                            ? "bg-blue-100 text-blue-800"
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
                        <p className="text-3xl font-extrabold text-blue-700">
                            {plan.preco.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </p>
                        <button className="mt-3 inline-flex items-center hover:cursor-pointer justify-center px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                            Comprar
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Fechar"
                    >
                        <X className="h-6 w-6 text-gray-700" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Activity className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Cobertura Médica</p>
                        <p className="font-semibold text-sm">
                            USD {plan.coberturaMedica.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <BaggageClaim className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Bagagem</p>
                        <p className="font-semibold text-sm">
                            USD {plan.coberturaBagagem.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <ShieldOff className="h-5 w-5 text-red-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Cancelamento</p>
                        <p className="font-semibold text-sm">
                            USD {plan.coberturaCancelamento.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Coberturas Médicas
                    </h3>
                    <div className="overflow-hidden rounded-lg border">
                        {(benefitsByPlan[plan.id] ?? []).map((row, i) => (
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
                <div className="flex items-center gap-3">
                    <span className="p-1 rounded-md bg-white shadow-sm">
                        {open ? (
                            <Minus className="h-4 w-4 text-gray-600" />
                        ) : (
                            <Plus className="h-4 w-4 text-gray-600" />
                        )}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{titulo}</span>
                </div>
                <div className="flex items-center gap-3">
                    {valor && <span className="text-sm text-gray-800">{valor}</span>}
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
interface searchForm {
    destination: string | undefined;
    range: DateRange | undefined;
}
export default function PlanosPage() {
    const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
    const [showComparison, setShowComparison] = useState(false);
    const [viewPlanId, setViewPlanId] = useState<number | null>(null);
    const { formData } = usePreRegisterForm();
    const data = formData;
    const topPlans = mockPlans.filter((p) => p.topCard);
    const otherPlans = mockPlans.filter((p) => !p.topCard);
    const minhaDataI = new Date(formData?.range?.from || "");

    const diaI = String(minhaDataI.getDate()).padStart(2, "0");
    const mesI = String(minhaDataI.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
    const anoI = minhaDataI.getFullYear();

    const dataI = `${diaI}/${mesI}/${anoI}`;

    const minhaDataF = new Date(formData?.range?.to || "");
    minhaDataF.setDate(minhaDataF.getDate() + 16); // Adiciona 16 dias

    const diaF = String(minhaDataF.getDate()).padStart(2, "0");
    const mesF = String(minhaDataF.getMonth() + 1).padStart(2, "0"); // Mês é 0-indexado
    const anoF = minhaDataF.getFullYear();

    const dataF = `${diaF}/${mesF}/${anoF}`;
    // NOVO: estado do modal de filtros
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [form, setForm] = useState<searchForm>({
        destination: formData?.destination,
        range: formData?.range,
    });

    useEffect(() => {
        setForm({
            destination: formData?.destination,
            range: formData?.range,
        });
    }, [formData]);

    // Opções dinâmicas a partir do mock
    const options = useMemo(() => {
        const medicalMins = uniq(mockPlans.map((p) => p.coberturaMedica)).sort(
            (a, b) => a - b,
        );
        const faixaEtaria = uniq(
            mockPlans.map((p) => p.faixaEtaria || "").filter(Boolean),
        ).sort();
        const insurers = uniq(mockPlans.map((p) => p.seguradora)).sort();
        const benefits = uniq(mockPlans.flatMap((p) => p.beneficios)).sort();
        const covid: ("com" | "sem")[] = ["com", "sem"];
        return { medicalMins, faixaEtaria, insurers, benefits, covid };
    }, []);

    // Filtragem aplicada na listagem
    const filteredPlans = useMemo(() => {
        return mockPlans.filter((p) => {
            // DMH mínima: usa o maior valor selecionado como requisito mínimo
            if (filters.medicalMin.length) {
                const minReq = Math.max(...filters.medicalMin);
                if (p.coberturaMedica < minReq) return false;
            }
            // COVID
            if (filters.covid.length) {
                const wantCom = filters.covid.includes("com");
                const wantSem = filters.covid.includes("sem");
                if (wantCom && wantSem) {
                    // ambos = ignora filtro
                } else if (wantCom && !p.coberturaPandemia) return false;
                else if (wantSem && p.coberturaPandemia) return false;
            }
            // Seguradoras
            if (filters.insurers.length && !filters.insurers.includes(p.seguradora))
                return false;
            // Faixa etária (string)
            if (
                filters.faixaEtaria.length &&
                !filters.faixaEtaria.includes(p.faixaEtaria || "")
            )
                return false;
            // Benefícios: exige TODOS os selecionados
            if (
                filters.benefits.length &&
                !filters.benefits.every((b) => p.beneficios.includes(b))
            )
                return false;

            return true;
        });
    }, [filters]);

    const viewPlan = useMemo(
        () => mockPlans.find((p) => p.id === viewPlanId) || null,
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
    const getSelectedPlans = () =>
        mockPlans.filter((plan) => selectedPlans.includes(plan.id));
    const formatPrice = (price: number) =>
        price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    console.log("seletectedPlans", selectedPlans);
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
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
                                <span className="truncate max-w-[120px] sm:max-w-none">{data ? data.destination : "Selecione um destino"}</span>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span>
                                    {data ? `${dataI} - ${dataF}` : "Selecione as datas"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                                <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span>
                                    {data
                                        ? `${data.passengers} passageiro${Number(data?.passengers) > 1 ? "s" : ""}`
                                        : "Passageiros"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="text-sm bg-blue-300 text-gray-700 flex items-center justify-center">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4">
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
                                range={form.range}
                            />
                        </div>

                        <Button className="inline-flex items-center justify-center h-[48px] sm:h-[52px] gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-sm sm:text-base">
                            <SearchIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Buscar</span>
                        </Button>
                    </div>
                </div>
            </div>
            {/* Conteúdo */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6  py-8">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Coluna lateral antiga pode permanecer ou ser removida; deixei só a listagem principal. */}
                    <div className="flex flex-col gap-2 jusrify-center">
                        <div className="flex items-center gap-2 justify-center w-full mb-4">
                            <h1 className="text-3xl font-semibold">
                                Encontre os melhores planos para sua viagem!
                            </h1>
                        </div>

                        {/* TOP Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {topPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200  transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    {/* Plano e Seguradora */}
                                    <h3 className="text-lg font-bold mb-2">{plan.plano}</h3>
                                    <p className="text-sm text-gray-600">{plan.seguradora}</p>

                                    {/* Preço */}
                                    <div className="mt-4">
                                        {plan.precoOriginal > plan.preco && (
                                            <p className="line-through text-gray-400 text-sm">
                                                {plan.precoOriginal.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </p>
                                        )}
                                        <div className="flex items-baseline space-x-1">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {plan.preco.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </p>
                                            <p>/por pessoa no Pix</p>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            ou em até 12x no cartão
                                        </p>
                                    </div>

                                    {/* Benefícios */}
                                    <ul className="mt-4 space-y-1 text-sm text-gray-700">
                                        {plan.beneficios.map((b, i) => (
                                            <li key={i}>• {b}</li>
                                        ))}
                                    </ul>

                                    {/* Ações */}
                                    <div className="mt-6 space-y-2">
                                        <button className="w-full bg-blue-600  hover:cursor-pointer hover:animate-pulse text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                                            <span>Selecionar Plano</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                handleSelectPlan(plan.id);
                                                if (
                                                    !selectedPlans.includes(plan.id) &&
                                                    selectedPlans.length >= 5
                                                ) {
                                                    setShowComparison(true);
                                                }
                                            }}
                                            className={`flex-1 py-2 px-4 rounded-lg w-full hover:cursor-pointer border transition-colors flex items-center justify-center space-x-1 ${
                                                selectedPlans.includes(plan.id)
                                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                            disabled={
                                                !selectedPlans.includes(plan.id) &&
                                                selectedPlans.length >= 4
                                            }
                                        >
                                            <GitCompare className="h-4 w-4" />
                                            <span className="text-sm">
                                                {selectedPlans.includes(plan.id)
                                                    ? "Selecionado"
                                                    : "Comparar"}
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
                                    {filteredPlans.length} planos encontrados
                                </span>
                            </div>

                            <select className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Ordenar por: Melhor preço</option>
                                <option>Ordenar por: Maior cobertura</option>
                                <option>Ordenar por: Melhor avaliação</option>
                            </select>
                        </div>

                        {/* Cards */}
                        <div className="space-y-4">
                            {filteredPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                                >
                                    <div className="p-3 sm:p-4">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                                {plan.plano}
                                                            </h3>
                                                            {plan.destaque && (
                                                                <span
                                                                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                                        plan.destaque === "Mais Vendido"
                                                                            ? "bg-blue-100 text-blue-800"
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
                                                        <p className="text-sm text-gray-600">
                                                            {plan.seguradora}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-1 mt-1">
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${
                                                                            i < Math.floor(plan.avaliacoes)
                                                                                ? "text-yellow-400 fill-current"
                                                                                : "text-gray-300"
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-600">
                                                                {plan.avaliacoes} ({plan.totalAvaliacoes})
                                                            </span>
                                                            <div className="flex flex-col ml-2 sm:ml-4">
                                                                <span className="text-xs text-gray-500">
                                                                    {plan.faixaEtaria}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {plan.aumentoIdade}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Highlights - Versão compacta */}
                                                <div className="flex items-center justify-start gap-3 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Activity className="h-4 w-4 text-blue-500" />
                                                        <p className="text-xs">
                                                            <span className="font-medium">USD {plan.coberturaMedica.toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <BaggageClaim className="h-4 w-4 text-blue-500" />
                                                        <p className="text-xs">
                                                            <span className="font-medium">USD {plan.coberturaBagagem.toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ShieldOff className="h-4 w-4 text-red-500" />
                                                        <p className="text-xs">
                                                            <span className="font-medium">USD {plan.coberturaCancelamento.toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Preço/Ações */}
                                            <div className="lg:w-56 text-center lg:text-right">
                                                <div className="mb-2 px-2">
                                                    {plan.precoOriginal > plan.preco && (
                                                        <p className="text-xs text-gray-500 line-through">
                                                            {plan.precoOriginal.toLocaleString("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            })}
                                                        </p>
                                                    )}

                                                    <div className="flex flex-row gap-1 items-end justify-end">
                                                        <p className="text-2xl font-bold text-blue-600">
                                                            {plan.preco.toLocaleString("pt-BR", {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            })}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-600">
                                                        Por pessoa no PIX
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <button className="w-full bg-blue-600 hover:cursor-pointer text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                                                        <span>Selecionar</span>
                                                        <ArrowRight className="h-3 w-3" />
                                                    </button>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                handleSelectPlan(plan.id);
                                                                if (
                                                                    !selectedPlans.includes(plan.id) &&
                                                                    selectedPlans.length >= 5
                                                                ) {
                                                                    setShowComparison(true);
                                                                }
                                                            }}
                                                            className={`flex-1 py-1 px-2 rounded-lg hover:cursor-pointer border transition-colors flex items-center justify-center ${
                                                                selectedPlans.includes(plan.id)
                                                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                            }`}
                                                            disabled={
                                                                !selectedPlans.includes(plan.id) &&
                                                                selectedPlans.length >= 4
                                                            }
                                                        >
                                                            <GitCompare className="h-3 w-3 mr-1" />
                                                            <span className="text-xs">
                                                                {selectedPlans.includes(plan.id)
                                                                    ? "Selecionado"
                                                                    : "Comparar"}
                                                            </span>
                                                        </button>

                                                        <button
                                                            onClick={() => setViewPlanId(plan.id)}
                                                            className="flex-1 py-1 px-2 rounded-lg hover:cursor-pointer border transition-colors flex items-center justify-center"
                                                            aria-label="Ver detalhes"
                                                        >
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            <span className="text-xs">Detalhes</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Barra flutuante de comparação */}
                        {selectedPlans.length > 1 && (
                            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
                                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                                    {/* Planos selecionados */}
                                    <div className="flex items-center gap-4 overflow-x-auto">
                                        {getSelectedPlans().map((plan) => (
                                            <div
                                                key={plan.id}
                                                className="flex items-center gap-2 border rounded-lg px-3 py-2"
                                            >
                                                <span className="text-sm font-medium">
                                                    {plan.seguradora}
                                                </span>
                                                <span className="text-xs text-gray-500 truncate">
                                                    {plan.plano}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setSelectedPlans((cur) =>
                                                            cur.filter((id) => id !== plan.id),
                                                        )
                                                    }
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Botão comparar */}
                                    <button
                                        onClick={() => setShowComparison(true)}
                                        className="flex-shrink-0 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg"
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
                                                                    {formatPrice(plan.precoOriginal)}
                                                                </p>
                                                            )}
                                                            <div className="flex items-baseline gap-2">
                                                                <p className="text-2xl font-extrabold text-blue-700">
                                                                    {formatPrice(plan.preco)}
                                                                </p>
                                                                <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                                                                    5% off no PIX
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="mt-3 w-full bg-blue-700 hover:cursor-pointer hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded-lg"
                                                            onClick={() => alert(`comprar ${plan.plano}`)}
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

                        {/* Modal de Detalhes */}
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
    );
}
