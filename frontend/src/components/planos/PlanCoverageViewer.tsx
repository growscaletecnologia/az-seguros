"use client";

import { useEffect, useState, useRef } from "react";
import { PlanService } from "@/services/plan.service";

import { Info, Minus, Plus, X, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { PlanInfo } from "@/types/types";

interface PlanCoverageViewerProps {
  planId: number;
  destination: string;
  departure: string;
  arrival: string;
  onClose: () => void;
  onBuy:()=> void;
}

/** Linha de cobertura (acordeão) */
function AccordionRow({
  titulo,
  valor,
  extra,
}: {
  titulo: string;
  valor?: string;
  extra?: string | null;
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
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fechar clicando fora do modal
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
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
        const data = await PlanService.getInfo({
          destination,
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
              {destination} — {planInfo.days} dias
            </p>
            <p className="text-3xl font-extrabold text-green-700">
              {planInfo.totalPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: planInfo.currency,
              })}
            </p>
            <p className="text-sm text-gray-700">
              {planInfo.totalPriceWithPixDiscount.toLocaleString("pt-BR", {
                style: "currency",
                currency: planInfo.currency,
              })}{" "}
              no Pix (5% off)
            </p>
            <button
                className="mt-3 inline-flex items-center hover:cursor-pointer justify-center px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={onBuy}
                >
            Comprar
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-0 right- p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Info geral */}
        <div className="px-6 py-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{destination}</span>
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
            {planInfo.benefits.map((b) => (
              <AccordionRow
                key={b.id}
                titulo={b.name}
                valor={b.category_name}
                extra={b.long_description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
