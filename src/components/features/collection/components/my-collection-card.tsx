"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Package, Weight, Clock, Eye } from "lucide-react";
import { CollectionResponse } from "@/types/collection-api";
import {
  collectionStatusLabels,
  collectionStatusColors,
  formatCollectionDate,
  getTimeAgo,
  getWasteSummary,
  getAddressSummary
} from "@/lib/collection-api-utils";
import { translateWasteType } from "@/lib/waste-type-translator";

interface MyCollectionCardProps {
  collection: CollectionResponse;
  onViewDetails?: (collection: CollectionResponse) => void;
}

export default function MyCollectionCard({ 
  collection, 
  onViewDetails 
}: MyCollectionCardProps) {
  const waste = collection.waste;
  if (!waste) return null;

  const statusLabel = collectionStatusLabels[collection.status];
  const statusColor = collectionStatusColors[collection.status];
  const wasteSummary = getWasteSummary(waste);
  const addressSummary = getAddressSummary(waste.address);
  const timeAgo = getTimeAgo(collection.signedAt);
  const formattedDate = formatCollectionDate(collection.signedAt);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-4">
        {/* Status e Data */}
        <div className="flex items-center justify-between">
          <Badge className={statusColor}>
            {statusLabel}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Resumo do Resíduo */}
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {translateWasteType(waste.wasteType)}
            </h3>
            <p className="text-sm text-muted-foreground">{wasteSummary}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Descrição do resíduo se disponível */}
        {waste.additionalDescription && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Descrição:</p>
            <p className="text-sm line-clamp-2">{waste.additionalDescription}</p>
          </div>
        )}

        {/* Detalhes técnicos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{waste.weight} {waste.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{waste.quantity} unid.</span>
          </div>
        </div>

        {/* Localização */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Localização</span>
          </div>
          <div className="pl-6">
            <p className="text-sm">{addressSummary}</p>
          </div>
        </div>

        {/* Data de coleta agendada */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Data de Descarte</span>
          </div>
          <div className="pl-6">
            <p className="text-sm">{formatCollectionDate(waste.discardDate)}</p>
          </div>
        </div>

        {/* Data de assinatura */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Assinada em</span>
          </div>
          <div className="pl-6">
            <p className="text-sm">{formattedDate}</p>
          </div>
        </div>

        {/* Imagens se disponíveis */}
        {waste.images && waste.images.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Fotos ({waste.images.length})
            </p>
            <div className="grid grid-cols-4 gap-2">
              {waste.images.slice(0, 4).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Foto ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-16 object-cover rounded border"
                />
              ))}
              {waste.images.length > 4 && (
                <div className="w-full h-16 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{waste.images.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informação sobre coleta realizada se aplicável */}
        {collection.collectedAt && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Coleta Realizada
              </span>
            </div>
            <div className="pl-6 mt-1">
              <p className="text-sm text-green-700">
                {formatCollectionDate(collection.collectedAt)}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer com ações se necessário */}
      {onViewDetails && (
        <div className="px-6 pb-4">
          <Button
            onClick={() => onViewDetails(collection)}
            variant="outline"
            className="w-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Button>
        </div>
      )}
    </Card>
  );
}
