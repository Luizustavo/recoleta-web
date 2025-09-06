"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { WasteResponse } from "@/types/waste-api";
import { translateWasteType } from "@/lib/waste-type-translator";
import { WasteTypeIcon } from "../../ui/waste-type-icon";

interface DeleteWasteConfirmationProps {
  waste: WasteResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteWasteConfirmation({
  waste,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteWasteConfirmationProps) {
  if (!waste) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-xl font-semibold">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir permanentemente este descarte?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <WasteTypeIcon wasteType={waste.wasteType} className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {translateWasteType(waste.wasteType)}
                </p>
                <p className="text-sm text-gray-500">
                  {waste.weight}kg • {formatDate(waste.discardDate)}
                </p>
                {waste.address && (
                  <p className="text-xs text-gray-400 truncate">
                    {waste.address.street}, {waste.address.number}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Esta ação não pode ser desfeita. Todos os dados relacionados a este descarte serão perdidos permanentemente.
              </p>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isLoading} className="flex-1">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Excluindo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Excluir Permanentemente
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
