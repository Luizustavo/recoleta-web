"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { WasteResponse } from "@/lib/waste-service";

interface WasteAddressCardProps {
  waste: WasteResponse;
}

export function WasteAddressCard({ waste }: WasteAddressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Endereço de Coleta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm font-medium">
            {waste.address.street}, {waste.address.number}
          </div>
          {waste.address.complement && (
            <div className="text-sm text-muted-foreground">
              {waste.address.complement}
            </div>
          )}
        </div>

        <div className="text-sm">
          {waste.address.neighborhood} - {waste.address.city}/
          {waste.address.state}
        </div>

        <div className="text-sm text-muted-foreground">
          CEP: {waste.address.zipCode}
        </div>

        {waste.address.reference && (
          <div>
            <div className="text-sm font-medium text-muted-foreground">Referência</div>
            <div className="text-sm">{waste.address.reference}</div>
          </div>
        )}

        {waste.address.isMain && (
          <Badge variant="outline" className="text-xs">
            Endereço Principal
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
