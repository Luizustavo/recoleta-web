"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Package, Search } from "lucide-react";
import { useWasteCollection } from "./hooks/use-waste-collection";
import FiltersCard from "./components/filters-card";
import WasteCard from "./components/waste-card";

export default function WasteCollectionPage() {
  const {
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
  } = useWasteCollection();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coletar Resíduos</h1>
          <p className="text-muted-foreground">
            Encontre resíduos disponíveis para coleta em sua região
            {userLocation && (
              <span className="text-green-600 ml-2">
                📍 Localização detectada
              </span>
            )}
          </p>
        </div>
        
        <div className="flex gap-2">
          {!userLocation && (
            <Button 
              onClick={getUserLocation} 
              variant="outline"
              size="sm"
            >
              📍 Usar Minha Localização
            </Button>
          )}
          
          <Button 
            onClick={() => loadAvailableWastes()} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com filtros */}
        <div className="lg:col-span-1">
          <FiltersCard
            filters={filters}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            loading={loading}
            hasLocation={!!userLocation}
          />
        </div>

        {/* Lista de resíduos */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : availableWastes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-muted rounded-full">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Nenhum resíduo encontrado</h3>
                  <p className="text-muted-foreground">
                    Não há resíduos disponíveis para coleta com os filtros aplicados.
                  </p>
                </div>
                <Button onClick={clearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cabeçalho dos resultados */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">
                      {availableWastes.length} resíduo{availableWastes.length !== 1 ? 's' : ''} disponível{availableWastes.length !== 1 ? 'eis' : ''}
                    </span>
                  </div>
                  
                  {Object.values(filters).some(value => 
                    value !== undefined && value !== "" && value !== 0
                  ) && (
                    <Badge variant="secondary">
                      Filtrado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Grid de resíduos */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.isArray(availableWastes) && availableWastes.map((waste) => (
                  <WasteCard
                    key={waste.id}
                    waste={waste}
                    onRequestCollection={requestCollection}
                    isCollecting={collectingId === waste.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
