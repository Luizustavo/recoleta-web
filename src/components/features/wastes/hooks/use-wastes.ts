"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { WasteService, WasteResponse } from "@/lib/waste-service";
import { UseWastesResult } from "../types";

export function useWastes(): UseWastesResult {
  const [wastes, setWastes] = useState<WasteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWastes = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      const data = await WasteService.getUserWastes();
      setWastes(data);
      if (showRefreshToast) {
        toast.success("Lista atualizada!");
      }
    } catch (error) {
      console.error("Erro ao carregar descartes:", error);
      toast.error("Erro ao carregar descartes", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshWastes = async () => {
    await fetchWastes(true);
  };

  useEffect(() => {
    fetchWastes();
  }, []);

  const removeWaste = (wasteId: string) => {
    setWastes(prevWastes => prevWastes.filter(w => w.id !== wasteId));
  };

  return {
    wastes,
    loading,
    refreshing,
    fetchWastes,
    refreshWastes,
    removeWaste,
  };
}
