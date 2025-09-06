import { WasteFormData } from "@/components/features/discard/waste-form/types";
import { AddressData } from "@/components/features/discard/address-form/types";
import { AvailableWasteResponse, CollectionFilters, CollectionRequestData, CollectionRequestResult } from "@/components/features/collection/types";
import { WasteResponse } from "@/types/waste-api";

export interface WasteSubmissionData {
  waste: WasteFormData;
  address: AddressData;
}

export class WasteService {
  static async submitWaste(data: WasteSubmissionData): Promise<WasteResponse> {
    const response = await fetch("/api/waste", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Erro ao cadastrar resíduo: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  static async getUserWastes(): Promise<WasteResponse[]> {
    const response = await fetch("/api/waste", {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          `Erro ao buscar resíduos: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
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
    
    // Garantir que retorna um array
    return Array.isArray(data) ? data : [];
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
