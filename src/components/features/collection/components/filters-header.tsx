"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { CollectionFilters } from "../types";
import { wasteTypes } from "../../discard/waste-form/utils";
import { WasteType } from "../../discard/waste-form/types";
import { useState, useEffect } from "react";

interface FiltersHeaderProps {
  filters: CollectionFilters;
  onApplyFilters: (filters: CollectionFilters) => void;
  onClearFilters: () => void;
  loading: boolean;
  hasLocation?: boolean;
}

const BRAZILIAN_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

export default function FiltersHeader({ 
  filters, 
  onApplyFilters, 
  onClearFilters, 
  loading,
  hasLocation = false
}: FiltersHeaderProps) {
  const [localFilters, setLocalFilters] = useState<CollectionFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && value !== 0
  );

  return (
    <div className="bg-background border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-5 w-5" />
        <span className="font-medium">Filtrar Resíduos</span>
      </div>
      
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label htmlFor="city" className="text-sm font-medium text-muted-foreground">
            Cidade
          </label>
          <Input
            id="city"
            placeholder="Ex: São Paulo"
            value={localFilters.city || ""}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, city: e.target.value }))}
            className="h-9"
          />
        </div>

        <div className="flex-1 min-w-[180px] space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            Estado
          </label>
          <Select 
            value={localFilters.state || ""} 
            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, state: value }))}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {BRAZILIAN_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            Tipo de Resíduo
          </label>
          <Select 
            value={localFilters.wasteType || ""} 
            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, wasteType: value }))}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {wasteTypes.map((type: WasteType) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-2">
                    <type.icon className={`h-4 w-4 ${type.color}`} />
                    {type.nome}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[150px] space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            Distância (km)
            {!hasLocation && (
              <span className="text-xs text-muted-foreground/70 ml-1">
                (localização)
              </span>
            )}
          </label>
          <Input
            type="number"
            placeholder="Ex: 10"
            value={localFilters.maxDistance || ""}
            onChange={(e) => setLocalFilters(prev => ({ 
              ...prev, 
              maxDistance: e.target.value ? Number(e.target.value) : undefined 
            }))}
            disabled={!hasLocation}
            className="h-9"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleApply} 
            disabled={loading}
            size="sm"
            className="h-9"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          
          {hasActiveFilters && (
            <Button 
              onClick={handleClear} 
              variant="outline" 
              disabled={loading}
              size="sm"
              className="h-9"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
