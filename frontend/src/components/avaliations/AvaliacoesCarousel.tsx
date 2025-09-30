"use client";

import { useEffect, useState } from 'react';
import { AvaliationService, type Avaliation } from '@/services/avaliation.service';
import { AvaliacaoCard } from './AvaliacaoCard';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AvaliacoesCarouselProps {
  limit?: number;
  showOnlyActive?: boolean;
  autoplay?: boolean;
  delayMs?: number;
}

/**
 * Componente de carrossel para exibir avaliações de clientes
 */
export function AvaliacoesCarousel({ 
  limit = 9, 
  showOnlyActive = true,
  autoplay = true,
  delayMs = 4000
}: AvaliacoesCarouselProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Configuração do carrossel com autoplay opcional
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 }
      }
    },
    autoplay ? [
      Autoplay({
        delay: delayMs,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      })
    ] : []
  );

  // Estados para controle dos botões de navegação
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  // Funções para navegação do carrossel
  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // Atualiza o estado dos botões quando o carrossel muda
  const onSelect = () => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      try {
        setLoading(true);
        const data = await AvaliationService.getAll(true); // Forçando showOnlyActive como true
        
        // Garantir que data é um array antes de aplicar o slice
        const avaliacoesArray = Array.isArray(data) ? data : [];
        
        // Filtrar apenas avaliações ativas (garantia dupla)
        const activeAvaliacoes = avaliacoesArray.filter(avaliacao => avaliacao.active === true);
        
        // Aplicar limite se especificado
        const limitedData = limit ? activeAvaliacoes.slice(0, limit) : activeAvaliacoes;
        setAvaliacoes(limitedData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        //setError('Não foi possível carregar as avaliações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvaliacoes();
  }, [limit]);

  // Renderiza esqueletos durante o carregamento
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex space-x-1">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Exibe mensagem de erro se houver
  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  // Exibe mensagem se não houver avaliações
  if (avaliacoes.length === 0) {
    return <div className="text-gray-500 text-center py-4">Nenhuma avaliação disponível.</div>;
  }

  // Renderiza o carrossel de avaliações
  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
              <AvaliacaoCard avaliacao={avaliacao} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Botões de navegação */}
      <div className="flex justify-center mt-6 gap-4">
        <button 
          onClick={scrollPrev} 
          disabled={prevBtnDisabled}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={scrollNext} 
          disabled={nextBtnDisabled}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Próximo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}