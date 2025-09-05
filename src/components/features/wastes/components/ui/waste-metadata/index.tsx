"use client";

import { WasteResponse } from "@/lib/waste-service";

interface WasteMetadataProps {
  waste: WasteResponse;
}

export function WasteMetadata({ waste }: WasteMetadataProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <div>ID do Descarte: {waste.id}</div>
      <div>Criado em: {formatDateTime(waste.createdAt)}</div>
      <div>Última atualização: {formatDateTime(waste.updatedAt)}</div>
    </div>
  );
}
