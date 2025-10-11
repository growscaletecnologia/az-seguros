    

import { BenefitItem } from "@/app/planos/page";
import { QuoteResponse } from "@/services/quote.service";
import { Activity, BaggageClaim, Calendar, Info, MapPin, Minus, Plus, ShieldOff, Users, X } from "lucide-react";
import { useState } from "react";
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
    console.log("chegoiu aqui ", titulo, valor, extra)
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

export function PlanDetailsModal({
        plan,
        onClose,
    }: {
        plan: QuoteResponse;
        onClose: () => void;
    }) {
        const items = benefitsByPlan[plan.code] ?? [];
        const position = plan.code

        console.log("benefitsByPlan", benefitsByPlan,1 , plan.code)
        return (
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50">
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                                {/* {plan.destaque && (
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
                                )} */}
                            </div>
                            <p className="text-gray-700">{plan.provider_name}</p>
                            {/* <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>Europa</span>
                                <Calendar className="h-4 w-4 ml-3" />
                                <span>4 Set – 20 Set</span>
                                <Users className="h-4 w-4 ml-3" />
                                <span>2 adultos</span>
                            </div> */}
                        </div>

                        <div className="text-right">
                            {plan.totalPriceWithPixDiscount > plan.totalPrice && (
                                <p className="text-sm text-gray-500 line-through">
                                    {plan.totalPriceWithPixDiscount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            )}
                            <p className="text-3xl font-extrabold text-blue-700">
                                {plan.totalPrice.toLocaleString("pt-BR", {
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
                            className=" relative bottom-12  rounded-lg hover:bg-gray-100"
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
                                USD 1.200
                            </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <BaggageClaim  className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Bagagem</p>
                            <p className="font-semibold text-sm">
                                USD 800
                            </p>
                        </div>
                        {/* <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <ShieldOff className="h-5 w-5 text-red-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Cancelamento</p>
                            <p className="font-semibold text-sm">
                                USD {plan.coberturaCancelamento.toLocaleString()}
                            </p>
                        </div> */}
                    </div>

                    <div className="px-6 pb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Coberturas Médicas
                        </h3>
                        <div className="overflow-hidden rounded-lg border">
                            {(benefitsByPlan?.[plan?.code] ?? []).map((row, i) => (
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