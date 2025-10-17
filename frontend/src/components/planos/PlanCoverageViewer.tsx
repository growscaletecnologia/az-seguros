"use client";

import { useEffect, useState, useRef } from "react";
import { PlanService } from "@/services/plan.service";

import { Info, Minus, Plus, X, MapPin, Calendar, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { PlanInfo } from "@/types/types";
import { formatPrice } from "@/lib/utils";
import { DESTINIES } from "@/types/destination";

interface PlanCoverageViewerProps {
  planId: number;
  destination: string;
  departure: string;
  arrival: string;
  onClose?: () => void;
  onBuy?:()=> void;
}


function AccordionRow({
    titulo,
    valor,
    extra,
    isFirstInCategory // Novo prop para borda superior
}: {
    titulo: string;
    valor?: string;
    extra?: string | null;
    isFirstInCategory: boolean;
}) {
    // 💡 A imagem sugere que as linhas não são sempre expansíveis, mas vamos manter a funcionalidade do Acordeão.
    // O valor do benefício (USD 60.000) fica à direita.
    const [open, setOpen] = useState(false);

    return (
        <div 
            className={`border-b border-gray-200 last:border-b-0 ${
                isFirstInCategory ? 'border-t-0' : 'border-t'
            } bg-white`}
        >
            <button
                onClick={() => setOpen((v) => !v)}
                // Estilo ajustado: fundo branco, sem hover visível, padding sutil
                className="w-full flex items-center justify-between px-0 py-3 transition" 
                aria-expanded={open}
            >
                {/* Título (Esquerda) */}
                <div className="flex items-center gap-3">
                    {/* Checkmark ou Icone de Expansão na esquerda (opcional, dependendo do design final) */}
                    {/* Mantendo o título simples como na imagem */}
                    <span className="text-sm font-normal text-gray-800">{titulo}</span>
                </div>
                
                {/* Valor e Toggle (Direita) */}
                <div className="flex items-center gap-3 text-right">
                    {valor && <span className="text-sm font-semibold text-gray-800">{valor}</span>}
                    
                    {/* Ícone de Expansão na Direita, discreto */}
                    <span className="ml-2 p-0.5">
                        {open ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                    </span>
                </div>
            </button>
            
            {/* Conteúdo Extra (Descrição Longa) */}
            {open && extra && (
                <div className="pb-3 pt-1 bg-white text-xs text-gray-600 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
                    <p>{extra}</p>
                </div>
            )}
        </div>
    );
}

/** Modal principal */
export function PlanCoverageViewer({
  planId,
  destination,
  departure,
  arrival,
  onClose,
  onBuy
}: PlanCoverageViewerProps) {
  const [loading, setLoading] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
      
          onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fechar clicando fora do modal
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
    
        onClose?.();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  // Buscar informações do plano
  useEffect(() => {
    async function loadInfo() {
      try {
        setLoading(true);
        console.log("planId", planId, destination)
        const data = await PlanService.getInfo({
          destination: DESTINIES.filter((d)=>d.id === Number(destination))[0].slug,
          departure,
          arrival,
          id: planId,
        });
        setPlanInfo(data);
      } catch (error) {
        console.error("Erro ao buscar plano:", error);
        toast.error("Erro ao buscar informações do plano");
      } finally {
        setLoading(false);
      }
    }
    if (planId) loadInfo();
  }, [planId, destination, departure, arrival]);

  if (loading)
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md">
          Carregando informações do plano...
        </div>
      </div>
    );

  if (!planInfo) return null;
  console.log("planInfo", planInfo)
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={
                planInfo.provider_code === "hero"
                  ? "/seguradoras/hero.png"
                  : "/seguradoras/my-travel-assist.png"
              }
              alt={planInfo.provider_name}
              className="w-24 h-auto object-contain"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{planInfo.name}</h2>
              <p className="text-gray-700">{planInfo.provider_name}</p>
              {planInfo.provider_terms_url && (
                <a
                  href={planInfo.provider_terms_url}
                  target="_blank"
                  className="text-blue-700 hover:underline text-sm"
                >
                  Ver condições gerais
                </a>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-600">
              {DESTINIES.filter((d)=>d.id === Number(destination))[0].name} — {planInfo.days} dias
            </p>
            <p className="text-3xl font-extrabold text-green-700">
              {formatPrice(planInfo?.totalPrice || 0)}
            </p>
            <p className="text-sm text-gray-700">
              {formatPrice(planInfo?.totalPriceWithPixDiscount || 0)}{" "}
              no Pix (5% off)
            </p>
            <button
                className="mt-3 inline-flex items-center hover:cursor-pointer justify-center px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => onBuy?.()}
                >
            Comprar
            </button>
          </div>

          
            <button
              onClick={() => onClose?.()}
              className="absolute top-0 right-1 p-2 rounded-lg cursor-pointer"
            >
              <X className="size-5 text-red-700" />
            </button>

        </div>

        {/* Info geral */}
        <div className="px-6 py-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{DESTINIES.filter((d)=>d.id === Number(destination))[0].name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {departure} - {arrival}
            </span>
          </div>
        </div>

        {/* Lista de coberturas */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Coberturas Médicas
          </h3>
          <div className="overflow-hidden rounded-lg border">
            {planInfo.benefits.map((b, index) => (
              <AccordionRow
                key={b.id}
                titulo={b.name}
                valor={b.category_name}
                extra={b.long_description}
                isFirstInCategory = {index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

