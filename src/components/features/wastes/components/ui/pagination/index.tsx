"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationInfo } from "../../../types";

interface WastePaginationProps {
  pagination: PaginationInfo | null;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function WastePagination({ pagination, onPageChange, loading = false }: WastePaginationProps) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { page: currentPage, totalPages, total, limit } = pagination;
  
  // Calcular range de itens sendo exibidos
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  // Calcular páginas a serem exibidas
  const getVisiblePages = () => {
    const visiblePages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Se temos poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Lógica para mostrar páginas ao redor da atual
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - half);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }
    
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 border-t border-gray-200">
      {/* Informações */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-medium">{startItem}</span> a{" "}
        <span className="font-medium">{endItem}</span> de{" "}
        <span className="font-medium">{total}</span> resíduos
      </div>

      {/* Controles de Paginação */}
      <div className="flex items-center gap-2">
        {/* Botão Anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {/* Números das Páginas */}
        <div className="flex items-center gap-1">
          {/* Primeira página se não estiver visível */}
          {visiblePages[0] > 1 && (
            <>
              <Button
                variant={1 === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={loading}
                className="w-8 h-8 p-0"
              >
                1
              </Button>
              {visiblePages[0] > 2 && (
                <span className="text-gray-400 px-2">...</span>
              )}
            </>
          )}

          {/* Páginas visíveis */}
          {visiblePages.map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={loading}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}

          {/* Última página se não estiver visível */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className="text-gray-400 px-2">...</span>
              )}
              <Button
                variant={totalPages === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={loading}
                className="w-8 h-8 p-0"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* Botão Próximo */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center gap-1"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
