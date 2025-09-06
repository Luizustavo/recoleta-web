import { WasteFormData } from "@/components/features/discard/waste-form/types";
import { AddressData } from "@/components/features/discard/address-form/types";
import { AvailableWasteResponse, CollectionFilters, CollectionRequestData, CollectionRequestResult } from "@/components/features/collection/types";
import { WasteResponse } from "@/types/waste-api";
import { handleFormSubmission } from "@/lib/waste-form-adapter";
import { fetchWrapper } from "@/lib/fetch-wrapper";

export interface WasteSubmissionData {
  waste: WasteFormData;
  address: AddressData;
}

export interface PaginatedWasteResult {
  items: WasteResponse[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export class WasteService {
  static async submitWaste(data: WasteSubmissionData): Promise<WasteResponse> {
    console.log("🗑️ WasteService.submitWaste - Dados de entrada:", data);
    
    try {
      // Usar o adapter para converter dados e obter coordenadas automaticamente
      const result = await handleFormSubmission(data.waste, data.address);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      console.log("✅ WasteService.submitWaste - Sucesso:", result.data);
      return result.data!;
      
    } catch (error) {
      console.error("❌ WasteService.submitWaste - Erro:", error);
      throw error;
    }
  }

  static async getUserWastes(page: number = 1, limit: number = 12): Promise<PaginatedWasteResult> {
    try {
      console.log('WasteService.getUserWastes - Iniciando busca com:', { page, limit });
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetchWrapper(`/api/waste?${params.toString()}`);
      
      console.log('WasteService.getUserWastes - Resposta da API:', response);

      // Handle different possible response structures
      let items: WasteResponse[] = [];
      let pagination = {
        page: page,
        limit: limit,
        totalItems: 0,
        totalPages: 1
      };

      const data = response.data;

      // Check for nested structure {success: true, data: {items: [...], ...}}
      if (data && typeof data === 'object' && 'success' in data && data.success && 'data' in data) {
        const nestedData = (data as { data: unknown }).data;
        
        if (nestedData && typeof nestedData === 'object' && 'items' in nestedData && Array.isArray((nestedData as { items: unknown }).items)) {
          items = (nestedData as { items: WasteResponse[] }).items;
          const paginationData = nestedData as { page?: number; limit?: number; totalItems?: number; totalPages?: number };
          pagination = {
            page: paginationData.page || page,
            limit: paginationData.limit || limit,
            totalItems: paginationData.totalItems || 0,
            totalPages: paginationData.totalPages || 1
          };
        } else if (Array.isArray(nestedData)) {
          // Fallback if nested data is direct array
          items = nestedData as WasteResponse[];
        }
      } else if (Array.isArray(data)) {
        // Direct array response
        items = data as WasteResponse[];
      } else {
        console.warn('WasteService.getUserWastes - Resposta em formato inesperado:', data);
      }

      console.log('WasteService.getUserWastes - Dados processados:', { itemsCount: items.length, pagination });
      
      return {
        items,
        pagination
      };
    } catch (error) {
      console.error('Erro ao buscar resíduos do usuário:', error);
      return {
        items: [],
        pagination: {
          page: 1,
          limit: limit,
          totalItems: 0,
          totalPages: 1
        }
      };
    }
  }

  static async getWasteById(id: string): Promise<WasteResponse> {
    const response = await fetch(`/api/waste/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Erro ao buscar resíduo: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  static async updateWaste(
    id: string,
    updateData: Partial<WasteSubmissionData>
  ): Promise<WasteResponse> {
    const response = await fetch(`/api/waste/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Erro ao atualizar resíduo: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  static async deleteWaste(id: string): Promise<void> {
    const response = await fetch(`/api/waste/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Erro ao deletar resíduo: ${response.status} ${response.statusText}`
      );
    }
  }

  static async getAvailableWastes(filters?: CollectionFilters): Promise<AvailableWasteResponse[]> {
    const searchParams = new URLSearchParams();
    
    if (filters?.city) searchParams.append("city", filters.city);
    if (filters?.state) searchParams.append("state", filters.state);
    if (filters?.wasteType) searchParams.append("wasteType", filters.wasteType);
    if (filters?.maxDistance) searchParams.append("maxDistance", filters.maxDistance.toString());
    if (filters?.latitude) searchParams.append("latitude", filters.latitude.toString());
    if (filters?.longitude) searchParams.append("longitude", filters.longitude.toString());
    if (filters?.page) searchParams.append("page", filters.page.toString());
    if (filters?.limit) searchParams.append("limit", filters.limit.toString());

    const response = await fetch(`/api/waste/available?${searchParams.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro na API getAvailableWastes:", {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(
        errorData.error ||
          `Erro ao buscar resíduos disponíveis: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Resposta da API getAvailableWastes:", data);
    
    // Handle different possible response structures
    let items: AvailableWasteResponse[] = [];

    // Check for nested structure {success: true, data: {items: [...], ...}}
    if (data && typeof data === 'object' && 'success' in data && data.success && 'data' in data) {
      const nestedData = (data as { data: unknown }).data;
      
      if (nestedData && typeof nestedData === 'object' && 'items' in nestedData && Array.isArray((nestedData as { items: unknown }).items)) {
        items = (nestedData as { items: AvailableWasteResponse[] }).items;
      } else if (Array.isArray(nestedData)) {
        // Fallback if nested data is direct array
        items = nestedData as AvailableWasteResponse[];
      }
    } else if (Array.isArray(data)) {
      // Direct array response
      items = data as AvailableWasteResponse[];
    } else {
      console.warn('WasteService.getAvailableWastes - Resposta em formato inesperado:', data);
    }

    console.log('WasteService.getAvailableWastes - Dados processados:', items.length, 'items encontrados');
    
    return items;
  }

  static async requestCollection(wasteId: string, data?: CollectionRequestData): Promise<CollectionRequestResult> {
    const response = await fetch(`/api/waste/${wasteId}/collect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Erro ao solicitar coleta: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }
}
