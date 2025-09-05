import { WasteResponse } from "@/lib/waste-service";

export interface WasteDetailsModalProps {
  waste: WasteResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface DeleteWasteConfirmationProps {
  waste: WasteResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export interface UseWasteActionsResult {
  // Estados
  selectedWaste: WasteResponse | null;
  isModalOpen: boolean;
  wasteToDelete: WasteResponse | null;
  isDeleteModalOpen: boolean;
  isDeleting: boolean;

  // Ações
  handleViewDetails: (waste: WasteResponse) => void;
  handleDelete: (waste: WasteResponse) => void;
  handleConfirmDelete: () => void;
  handleCloseModal: () => void;
  handleCloseDeleteModal: () => void;
}

export interface UseWastesResult {
  wastes: WasteResponse[];
  loading: boolean;
  refreshing: boolean;
  fetchWastes: (showRefreshToast?: boolean) => Promise<void>;
  refreshWastes: () => Promise<void>;
  removeWaste: (wasteId: string) => void;
}
