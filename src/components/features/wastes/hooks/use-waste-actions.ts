"use client";

import { useState } from "react";
import { toast } from "sonner";
import { WasteService, WasteResponse } from "@/lib/waste-service";
import { UseWasteActionsResult } from "../types";

interface UseWasteActionsProps {
  onWasteDeleted: (wasteId: string) => void;
}

export function useWasteActions({ onWasteDeleted }: UseWasteActionsProps): UseWasteActionsResult {
  const [selectedWaste, setSelectedWaste] = useState<WasteResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasteToDelete, setWasteToDelete] = useState<WasteResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetails = (waste: WasteResponse) => {
    setSelectedWaste(waste);
    setIsModalOpen(true);
  };

  const handleDelete = (waste: WasteResponse) => {
    setWasteToDelete(waste);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!wasteToDelete) return;

    setIsDeleting(true);
    try {
      await WasteService.deleteWaste(wasteToDelete.id);
      onWasteDeleted(wasteToDelete.id);
      toast.success("Descarte excluído com sucesso!");
      setIsDeleteModalOpen(false);
      setWasteToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir descarte:", error);
      toast.error("Erro ao excluir descarte", {
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWaste(null);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setWasteToDelete(null);
  };

  return {
    selectedWaste,
    isModalOpen,
    wasteToDelete,
    isDeleteModalOpen,
    isDeleting,
    handleViewDetails,
    handleDelete,
    handleConfirmDelete,
    handleCloseModal,
    handleCloseDeleteModal,
  };
}
