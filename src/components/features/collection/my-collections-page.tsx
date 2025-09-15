"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Package, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useMyCollections } from "./hooks/use-my-collections";
import MyCollectionCard from "./components/my-collection-card";
import { CollectionStatus } from "@/types/collection-api";
import { collectionStatusLabels } from "@/lib/collection-api-utils";

export default function MyCollectionsPage() {
  const {
    collections,
    loading,
    pagination,
    filters,
    applyFilters,
    changePage,
    clearFilters,
    refreshCollections,
  } = useMyCollections();

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      applyFilters({
        page: 1,
        limit: filters.limit
      });
    } else {
      applyFilters({
        ...filters,
        status: status as CollectionStatus,
        page: 1
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Coletas</h1>
          <p className="text-muted-foreground">
            Acompanhe as coletas de resíduos que você assinou
          </p>
        </div>
        
        <Button 
          onClick={refreshCollections} 
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(collectionStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filters.status && (
            <Button onClick={clearFilters} variant="outline" size="sm">
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Informações de paginação */}
        <div className="flex items-center gap-4">
          {pagination.totalItems > 0 && (
            <div className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages} 
               {' '}({pagination.totalItems} {pagination.totalItems === 1 ? 'coleta' : 'coletas'})
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-muted rounded-full">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {filters.status ? 'Nenhuma coleta encontrada' : 'Você ainda não assinou nenhuma coleta'}
                </h3>
                <p className="text-muted-foreground">
                  {filters.status 
                    ? 'Não há coletas com o status selecionado.'
                    : 'Quando você assinar para coletar resíduos, eles aparecerão aqui.'
                  }
                </p>
              </div>
              {filters.status ? (
                <Button onClick={clearFilters} variant="outline">
                  Ver Todas as Coletas
                </Button>
              ) : (
                <Button onClick={() => window.location.href = '/waste-collection'}>
                  <Package className="mr-2 h-4 w-4" />
                  Buscar Resíduos para Coletar
                </Button>
              )}
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
                    {collections.length} coleta{collections.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {filters.status && (
                  <Badge variant="secondary">
                    {collectionStatusLabels[filters.status]}
                  </Badge>
                )}
              </div>
            </div>

            {/* Grid de coletas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <MyCollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i;
                    if (pageNum > pagination.totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => changePage(pageNum)}
                        variant={pageNum === pagination.page ? "default" : "outline"}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
