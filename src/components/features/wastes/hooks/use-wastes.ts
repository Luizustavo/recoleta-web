"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WasteService, PaginatedWasteResult } from "@/lib/waste-service";
import { WasteResponse } from "@/types/waste-api";
import { UseWastesResult, PaginationInfo } from "../types";

export function useWastes(): UseWastesResult {
  const [wastes, setWastes] = useState<WasteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(50);

  const fetchWastes = useCallback(async (showRefreshToast = false, page = currentPage, limit = pageSize) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      
      console.log("🔍 useWastes.fetchWastes - Buscando página:", { page, limit });
      
      const result: PaginatedWasteResult = await WasteService.getUserWastes(page, limit);
      
      console.log("📦 useWastes.fetchWastes - Dados recebidos:", result);
      
      // Usar a nova estrutura de dados
      setWastes(result.items);
      setPagination({
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.totalItems,
        totalPages: result.pagination.totalPages
      });
      
      if (showRefreshToast) {
        toast.success("Lista atualizada!");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar descartes:", error);
      toast.error("Erro ao carregar descartes", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
      setWastes([]);
      setPagination(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, pageSize]);

  const refreshWastes = async () => {
    await fetchWastes(true, currentPage, pageSize);
  };

  const loadPage = async (page: number) => {
    setCurrentPage(page);
    await fetchWastes(false, page, pageSize);
  };

  const setPageSize = async (limit: number) => {
    setPageSizeState(limit);
    setCurrentPage(1); // Reset para primeira página ao mudar o tamanho
    await fetchWastes(false, 1, limit);
  };

  useEffect(() => {
    fetchWastes();
  }, [fetchWastes]);

  const removeWaste = (wasteId: string) => {
    setWastes(prevWastes => prevWastes.filter(w => w.id !== wasteId));
    
    // Atualizar informações de paginação
    if (pagination) {
      const newTotal = Math.max(0, pagination.total - 1);
      setPagination({
        ...pagination,
        total: newTotal,
        totalPages: Math.ceil(newTotal / pagination.limit)
      });
    }
  };

  return {
    wastes,
    loading,
    refreshing,
    pagination,
    fetchWastes,
    refreshWastes,
    removeWaste,
    loadPage,
    setPageSize,
  };
}
