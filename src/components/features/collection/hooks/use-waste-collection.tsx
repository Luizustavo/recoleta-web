import { useState, useEffect, useCallback } from "react";
import { WasteService } from "@/lib/waste-service";
import { CollectionFilters, AvailableWasteResponse, CollectionRequestData } from "../types";
import { toast } from "sonner";

export function useWasteCollection() {
  const [availableWastes, setAvailableWastes] = useState<AvailableWasteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<CollectionFilters>({});
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Obter localização do usuário
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocalização não é suportada neste navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        console.log("Localização obtida:", { latitude, longitude });
        
        // Atualizar filtros com localização automaticamente se não houver cidade/estado definidos
        if (!filters.city && !filters.state) {
          setFilters(prev => ({ 
            ...prev, 
            latitude, 
            longitude,
            maxDistance: prev.maxDistance || 10 // 10km por padrão
          }));
        }
      },
      (error) => {
        console.warn("Erro ao obter localização:", error);
        
        // Diferentes tipos de erro
        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.log("Usuário negou o pedido de geolocalização");
            // Não mostrar toast para negação, é uma escolha do usuário
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Informações de localização indisponíveis");
            toast.error("Localização indisponível. Use os filtros de cidade/estado.");
            break;
          case error.TIMEOUT:
            console.log("Tempo limite para obter localização excedido");
            toast.error("Tempo limite para obter localização. Use os filtros manuais.");
            break;
          default:
            console.log("Erro desconhecido ao obter localização");
            break;
        }
      },
      {
        enableHighAccuracy: false, // Mais rápido, menos preciso
        timeout: 10000, // 10 segundos
        maximumAge: 300000 // 5 minutos de cache
      }
    );
  }, [filters.city, filters.state]);

  const loadAvailableWastes = useCallback(async (currentFilters: CollectionFilters = filters) => {
    setLoading(true);
    try {
      // Incluir localização nos filtros se disponível e não há filtros de cidade/estado
      const filtersWithLocation = {
        ...currentFilters,
        ...(userLocation && !currentFilters.city && !currentFilters.state && currentFilters.maxDistance ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        } : {})
      };

      console.log("Filtros sendo enviados:", filtersWithLocation);

      const wastes = await WasteService.getAvailableWastes(filtersWithLocation);
      
      console.log("Dados recebidos no hook:", {
        wastes,
        type: typeof wastes,
        isArray: Array.isArray(wastes)
      });
      
      // Garantir que wastes seja sempre um array
      let wastesArray: AvailableWasteResponse[] = [];
      
      if (Array.isArray(wastes)) {
        wastesArray = wastes;
      } else if (wastes && typeof wastes === 'object') {
        // Se for um objeto, talvez tenha uma propriedade com o array
        const wastesObj = wastes as Record<string, unknown>;
        if ('data' in wastesObj && Array.isArray(wastesObj.data)) {
          wastesArray = wastesObj.data;
        } else if ('wastes' in wastesObj && Array.isArray(wastesObj.wastes)) {
          wastesArray = wastesObj.wastes;
        } else if ('results' in wastesObj && Array.isArray(wastesObj.results)) {
          wastesArray = wastesObj.results;
        }
      }
      
      setAvailableWastes(wastesArray);
    } catch (error) {
      console.error("Erro ao carregar resíduos:", error);
      toast.error("Erro ao carregar resíduos disponíveis");
      setAvailableWastes([]);
    } finally {
      setLoading(false);
    }
  }, [filters, userLocation]);

  const requestCollection = useCallback(async (wasteId: string, data?: CollectionRequestData) => {
    setCollectingId(wasteId);
    try {
      const result = await WasteService.requestCollection(wasteId, data);
      
      if (result.success) {
        toast.success(result.message || "Solicitação de coleta enviada com sucesso!");
        // Remove o resíduo da lista após solicitar coleta
        setAvailableWastes(prev => prev.filter(waste => waste.id !== wasteId));
      } else {
        toast.error(result.message || "Erro ao solicitar coleta");
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao solicitar coleta:", error);
      toast.error("Erro ao solicitar coleta");
      throw error;
    } finally {
      setCollectingId(null);
    }
  }, []);

  const applyFilters = useCallback((newFilters: CollectionFilters) => {
    setFilters(newFilters);
    loadAvailableWastes(newFilters);
  }, [loadAvailableWastes]);

  const clearFilters = useCallback(() => {
    const emptyFilters: CollectionFilters = {};
    setFilters(emptyFilters);
    loadAvailableWastes(emptyFilters);
  }, [loadAvailableWastes]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    // Carregar dados iniciais imediatamente, sem esperar localização
    loadAvailableWastes();
  }, [loadAvailableWastes]);

  return {
    availableWastes,
    loading,
    collectingId,
    filters,
    userLocation,
    loadAvailableWastes,
    requestCollection,
    applyFilters,
    clearFilters,
    getUserLocation,
  };
}
