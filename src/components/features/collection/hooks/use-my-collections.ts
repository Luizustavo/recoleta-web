import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  CollectionResponse,
  MyCollectionsResponse,
  MyCollectionsFilters
} from "@/types/collection-api";
import { getMyCollections } from "@/lib/collection-api-utils";

export function useMyCollections() {
  const [collections, setCollections] = useState<CollectionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFilters] = useState<MyCollectionsFilters>({
    page: 1,
    limit: 10
  });

  const loadCollections = useCallback(async (currentFilters: MyCollectionsFilters = filters) => {
    setLoading(true);
    try {
      console.log("Carregando minhas coletas com filtros:", currentFilters);
      
      const response: MyCollectionsResponse = await getMyCollections(currentFilters);
      
      console.log("Resposta das minhas coletas:", response);
      
      setCollections(response.items);
      setPagination({
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalItems: response.totalItems
      });
    } catch (error) {
      console.error("Erro ao carregar minhas coletas:", error);
      toast.error("Erro ao carregar suas coletas");
      setCollections([]);
      setPagination({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 0
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const applyFilters = useCallback((newFilters: MyCollectionsFilters) => {
    const updatedFilters = {
      ...newFilters,
      page: 1 // Reset para primeira página ao aplicar filtros
    };
    setFilters(updatedFilters);
    loadCollections(updatedFilters);
  }, [loadCollections]);

  const changePage = useCallback((newPage: number) => {
    const updatedFilters = {
      ...filters,
      page: newPage
    };
    setFilters(updatedFilters);
    loadCollections(updatedFilters);
  }, [filters, loadCollections]);

  const clearFilters = useCallback(() => {
    const emptyFilters: MyCollectionsFilters = {
      page: 1,
      limit: 10
    };
    setFilters(emptyFilters);
    loadCollections(emptyFilters);
  }, [loadCollections]);

  const refreshCollections = useCallback(() => {
    loadCollections(filters);
  }, [loadCollections, filters]);

  // Carregar dados iniciais
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return {
    collections,
    loading,
    pagination,
    filters,
    loadCollections,
    applyFilters,
    changePage,
    clearFilters,
    refreshCollections,
  };
}
