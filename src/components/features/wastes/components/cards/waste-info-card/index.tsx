"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Weight, FileText } from "lucide-react";
import { WasteResponse } from "@/types/waste-api";
import { WasteTypeIcon } from "../../ui/waste-type-icon";
import { translateWasteType } from "@/lib/waste-type-translator";

interface WasteInfoCardProps {
  waste: WasteResponse;
}

export function WasteInfoCard({ waste }: WasteInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <WasteTypeIcon wasteType={waste.wasteType} className="h-4 w-4 text-black" />
          Informações do Resíduo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Tipo</div>
            <div className="text-sm">{translateWasteType(waste.wasteType)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Condição</div>
            <div className="text-sm">{waste.condition}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Peso</div>
            <div className="text-sm flex items-center gap-1">
              <Weight className="h-3 w-3" />
              {waste.weight} {waste.unit}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Quantidade</div>
            <div className="text-sm">
              {waste.quantity} {waste.quantity > 1 ? "unidades" : "unidade"}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Embalagem</div>
          <Badge variant={waste.hasPackaging ? "default" : "outline"}>
            {waste.hasPackaging ? "Com Embalagem" : "Sem Embalagem"}
          </Badge>
        </div>

        {waste.additionalDescription && (
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Descrição Adicional
            </div>
            <div className="text-sm p-3 bg-muted rounded-md">
              {waste.additionalDescription}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
