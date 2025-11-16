"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { WasteResponse } from "@/types/waste-api";
import { translateWasteType } from "@/lib/waste-type-translator";
import { WasteStatusBadge } from "../../ui/waste-status-badge";
import { WasteTypeIcon } from "../../ui/waste-type-icon";
import { useState } from "react";
import {
  WasteInfoCard,
  WasteScheduleCard,
  WasteAddressCard,
  WasteUserCard,
  WasteImagesCard,
  WasteImageViewer,
  WasteMetadata,
} from "../..";

interface WasteDetailsModalProps {
  waste: WasteResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WasteDetailsModal({
  waste,
  open,
  onOpenChange,
}: WasteDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  if (!waste) return null;

  const getFullImageUrls = () => {
    if (!waste.images || waste.images.length === 0) return [];
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return waste.images.map(image => {
      if (image.startsWith('http')) return image;
      return `${apiUrl}/api/waste-image/${image}`;
    });
  };

  const fullImageUrls = getFullImageUrls();


  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleImageViewerClose = () => {
    setSelectedImageIndex(null);
  };

  const handleImageNavigation = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <WasteTypeIcon wasteType={waste.wasteType} className="h-4 w-4 text-black" />
                {translateWasteType(waste.wasteType)}
              </DialogTitle>
              <WasteStatusBadge 
                discardDate={waste.discardDate}
              />
            </div>
            <DialogDescription>
              Detalhes completos do descarte cadastrado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <WasteInfoCard waste={waste} />
            <WasteScheduleCard waste={waste} />
            <WasteAddressCard waste={waste} />
            <WasteImagesCard 
              waste={waste} 
              onImageSelect={handleImageSelect}
            />
            <WasteUserCard waste={waste} />
            
            <Separator />
            
            <WasteMetadata waste={waste} />
          </div>
        </DialogContent>
      </Dialog>

    
      <WasteImageViewer
        images={fullImageUrls}
        selectedIndex={selectedImageIndex}
        onClose={handleImageViewerClose}
        onNavigate={handleImageNavigation}
      />
    </>
  );
}