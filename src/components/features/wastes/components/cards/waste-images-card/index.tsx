"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WasteResponse } from "@/types/waste-api";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface WasteImagesCardProps {
  waste: WasteResponse;
  onImageSelect: (index: number) => void;
}

export function WasteImagesCard({ waste, onImageSelect }: WasteImagesCardProps) {
  const getFullImageUrls = () => {
    if (!waste.images || waste.images.length === 0) return [];
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return waste.images.map(image => {
      if (image.startsWith('http')) return image;
      return `${apiUrl}/api/waste-image/${image}`;
    });
  };

  const fullImageUrls = getFullImageUrls();

  console.log('WasteImagesCard - URLs:', fullImageUrls);

  if (!waste.images || waste.images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4" />
            Fotos do Resíduo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma foto disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ZoomIn className="h-4 w-4" />
          Fotos do Resíduo ({waste.images.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fullImageUrls.map((imageUrl, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity group"
              onClick={() => onImageSelect(index)}
            >
              <Image
                src={imageUrl}
                alt={`Foto ${index + 1} do resíduo`}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}