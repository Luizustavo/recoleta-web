"use client";

import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { WasteResponse } from "@/lib/waste-service";
import { WasteStatusBadge } from "../../ui/waste-status-badge";
import { WasteTypeIcon } from "../../ui/waste-type-icon";
import { translateWasteType } from "@/lib/waste-type-translator";

interface WasteListItemProps {
  waste: WasteResponse;
  onViewDetails: (waste: WasteResponse) => void;
  onDelete: (waste: WasteResponse) => void;
}

export function WasteListItem({ waste, onViewDetails, onDelete }: WasteListItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
      <div className="grid grid-cols-6 gap-4 items-center">
        {/* Tipo de Resíduo */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <WasteTypeIcon wasteType={waste.wasteType} className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">
              {translateWasteType(waste.wasteType)}
            </p>
          </div>
        </div>

        {/* Peso */}
        <div className="text-gray-700">
          <span className="font-medium text-sm">{waste.weight} kg</span>
        </div>

        {/* Endereço */}
        <div className="text-gray-700">
          <div className="max-w-xs">
            <p className="font-medium text-sm truncate">
              {waste.address.street}, {waste.address.number}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {waste.address.neighborhood}, {waste.address.city}
            </p>
          </div>
        </div>

        {/* Data/Hora */}
        <div className="text-gray-700">
          <div>
            <p className="font-medium text-sm">
              {formatDate(waste.discardDate)}
            </p>
            <p className="text-xs text-gray-500">
              {formatTime(waste.discardTime)}
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="w-fit">
            <WasteStatusBadge discardDate={waste.discardDate} discardTime={waste.discardTime} />
          </div>
        </div>

        {/* Ações */}
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(waste)}
              className="text-blue-600 hover:text-blue-700 text-xs h-8"
            >
              <Eye className="h-3 w-3" />
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
        </div>
      </div>
    </div>
  );
}
