import React, { useEffect, useState } from 'react';
import { AvaliationService, type Avaliation } from '@/services/avaliation.service';
import { AvaliacaoCard } from './AvaliacaoCard';
import { Skeleton } from '@/components/ui/skeleton';

interface AvaliacoesListProps {
  limit?: number;
  showOnlyActive?: boolean;
}

/**
 * Componente que exibe uma lista de avaliações de usuários
 */
export function AvaliacoesList({ limit, showOnlyActive = true }: AvaliacoesListProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      try {
        setLoading(true);
        const data = await AvaliationService.getAll(showOnlyActive);
        
        // Aplicar limite se especificado
        const limitedData = limit ? data.slice(0, limit) : data;
        setAvaliacoes(limitedData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        setError('Não foi possível carregar as avaliações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvaliacoes();
  }, [limit, showOnlyActive]);

  // Renderiza esqueletos durante o carregamento
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(limit || 3).fill(0).map((_, index) => (
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

  // Renderiza a lista de avaliações
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {avaliacoes.map((avaliacao) => (
        <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} />
      ))}
    </div>
  );
}