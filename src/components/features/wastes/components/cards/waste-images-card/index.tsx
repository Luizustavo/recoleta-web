"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images, ZoomIn } from "lucide-react";
import { WasteResponse } from "@/lib/waste-service";
import Image from "next/image";

interface WasteImagesCardProps {
  waste: WasteResponse;
  onImageSelect: (index: number) => void;
}

export function WasteImagesCard({ waste, onImageSelect }: WasteImagesCardProps) {
  if (!waste.images || waste.images.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Images className="h-4 w-4" />
          Fotos do Resíduo ({waste.images.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {waste.images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg border border-border"
              onClick={() => onImageSelect(index)}
            >
              <Image
                src={`data:image/jpeg;base64,${image}`}
                alt={`Foto ${index + 1} do resíduo`}
                width={120}
                height={96}
                className="w-full h-24 object-cover transition-transform group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
