"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Trash2, Calendar, MapPin } from "lucide-react";
import { WasteResponse } from "@/types/waste-api";
import { WasteStatusBadge } from "../../ui/waste-status-badge";
import { WasteTypeIcon } from "../../ui/waste-type-icon";
import { translateWasteType } from "@/lib/waste-type-translator";

interface WasteMobileCardProps {
  waste: WasteResponse;
  onViewDetails: (waste: WasteResponse) => void;
  onDelete: (waste: WasteResponse) => void;
}

export function WasteMobileCard({ waste, onViewDetails, onDelete }: WasteMobileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors border-l-4 border-l-green-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <WasteTypeIcon wasteType={waste.wasteType} className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {translateWasteType(waste.wasteType)}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <span>{waste.quantity} {waste.unit}</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <WasteStatusBadge discardDate={waste.discardDate} />
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar className="h-3 w-3" />
          <span className="font-medium">{formatDate(waste.discardDate)}</span>
          <span>às</span>
          <span>{formatTime(waste.discardDate)}</span>
          <span className="ml-2">•</span>
          <span className="font-medium">{waste.weight} kg</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="h-3 w-3" />
          {waste.address ? (
            `${waste.address.street}, ${waste.address.number} - ${waste.address.neighborhood}`
          ) : (
            'Endereço não disponível'
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(waste)}
            className="flex-1 text-blue-600 hover:text-blue-700 text-xs h-8"
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver Detalhes
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(waste)}
            className="text-destructive hover:text-destructive text-xs h-8"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
