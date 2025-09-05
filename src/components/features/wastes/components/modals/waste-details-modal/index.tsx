"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { WasteResponse } from "@/lib/waste-service";
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
                discardTime={waste.discardTime} 
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
        images={waste.images || []}
        selectedIndex={selectedImageIndex}
        onClose={handleImageViewerClose}
        onNavigate={handleImageNavigation}
      />
    </>
  );
}
