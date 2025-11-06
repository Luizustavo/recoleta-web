"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface WasteImageViewerProps {
  images: string[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function WasteImageViewer({
  images,
  selectedIndex,
  onClose,
  onNavigate,
}: WasteImageViewerProps) {
  if (selectedIndex === null || !images.length) {
    return null;
  }

  const handlePrevious = () => {
    const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    onNavigate(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    onNavigate(nextIndex);
  };

  return (
    <Dialog open={selectedIndex !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            Visualização de Imagem {selectedIndex + 1} de {images.length}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <div className="relative w-full h-[70vh]">
            <Image
              src={images[selectedIndex]}
              alt={`Foto ${selectedIndex + 1} do resíduo`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
