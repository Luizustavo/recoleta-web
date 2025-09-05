import { WasteFormData } from "@/components/features/discard/waste-form/types";
import { AddressData } from "@/components/features/discard/address-form/types";

export interface WasteSubmissionData {
  waste: WasteFormData;
  address: AddressData;
}

export interface WasteResponse {
  id: string;
  userId: string;
  addressId: string;
  wasteType: string;
  weight: number;
  quantity: number;
  unit: string;
  condition: string;
  hasPackaging: boolean;
  discardDate: string;
  discardTime: string;
  additionalDescription?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  address: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    reference?: string;
    isMain: boolean;
    createdAt: string;
    updatedAt: string;
  };
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
      method: "PATCH",
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
}
