"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  WasteDetailsModal,
  DeleteWasteConfirmation,
  WastePageHeader,
  WasteListItem,
  WasteMobileCard,
  WastePagination,
  useWastes,
  useWasteActions,
} from "@/components/features/wastes";

export default function WastesPage() {
  const { wastes, loading, refreshing, pagination, refreshWastes, removeWaste, loadPage } = useWastes();
  const wasteActions = useWasteActions({ 
    onWasteDeleted: removeWaste
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2 space-y-6">
      <WastePageHeader 
        onRefresh={refreshWastes}
        refreshing={refreshing}
      />

      <div>
        {wastes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2m-14 0h2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum descarte encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Você ainda não cadastrou nenhum descarte de resíduo.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block space-y-4">
              {/* Header da Tabela */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 px-6 py-3">
                <div className="grid grid-cols-6 gap-4">
                  <div className="text-left text-sm font-semibold text-gray-900">
                    Tipo de Resíduo
                  </div>
                  <div className="text-left text-sm font-semibold text-gray-900">
                    Peso
                  </div>
                  <div className="text-left text-sm font-semibold text-gray-900">
                    Endereço
                  </div>
                  <div className="text-left text-sm font-semibold text-gray-900">
                    Data/Hora
                  </div>
                  <div className="text-left text-sm font-semibold text-gray-900">
                    Status
                  </div>
                  <div className="text-left text-sm font-semibold text-gray-900">
                    Ações
                  </div>
                </div>
              </div>
              
              {/* Items da Lista */}
              {wastes.map((waste) => (
                <div key={waste.id} className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-green-500 overflow-hidden">
                  <WasteListItem
                    waste={waste}
                    onViewDetails={wasteActions.handleViewDetails}
                    onDelete={wasteActions.handleDelete}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {wastes.map((waste) => (
                <WasteMobileCard
                  key={waste.id}
                  waste={waste}
                  onViewDetails={wasteActions.handleViewDetails}
                  onDelete={wasteActions.handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Paginação */}
      <WastePagination 
        pagination={pagination}
        onPageChange={loadPage}
        loading={loading || refreshing}
      />

      <WasteDetailsModal
        waste={wasteActions.selectedWaste}
        open={wasteActions.isModalOpen}
        onOpenChange={wasteActions.handleCloseModal}
      />
      
      <DeleteWasteConfirmation
        waste={wasteActions.wasteToDelete}
        open={wasteActions.isDeleteModalOpen}
        onOpenChange={wasteActions.handleCloseDeleteModal}
        onConfirm={wasteActions.handleConfirmDelete}
        isLoading={wasteActions.isDeleting}
      />
    </div>
  );
}
