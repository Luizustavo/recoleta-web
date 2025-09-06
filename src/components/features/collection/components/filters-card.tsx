"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { CollectionFilters } from "../types";
import { wasteTypes } from "../../discard/waste-form/utils";
import { WasteType } from "../../discard/waste-form/types";
import { useState, useEffect } from "react";

interface FiltersCardProps {
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

export default function FiltersCard({ 
  filters, 
  onApplyFilters, 
  onClearFilters, 
  loading,
  hasLocation = false
}: FiltersCardProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtrar Resíduos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="Ex: São Paulo"
              value={localFilters.city || ""}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Select 
              value={localFilters.state || ""} 
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, state: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
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

          <div className="space-y-2">
            <Label htmlFor="wasteType">Tipo de Resíduo</Label>
            <Select 
              value={localFilters.wasteType || ""} 
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, wasteType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
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

          <div className="space-y-2">
            <Label htmlFor="maxDistance">
              Distância Máxima (km)
              {!hasLocation && (
                <span className="text-muted-foreground text-xs ml-1">
                  (requer localização)
                </span>
              )}
            </Label>
            <Input
              id="maxDistance"
              type="number"
              placeholder="Ex: 10"
              value={localFilters.maxDistance || ""}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                maxDistance: e.target.value ? Number(e.target.value) : undefined 
              }))}
              disabled={!hasLocation}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleApply} 
            disabled={loading}
            className="flex-1"
          >
            <Filter className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
          
          {hasActiveFilters && (
            <Button 
              onClick={handleClear} 
              variant="outline" 
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
