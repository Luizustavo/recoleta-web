import { 
  CreateWasteRequest,
  UpdateWasteRequest, 
  WasteResponse, 
  ApiResponse,
  WasteFilters,
  WasteType,
  UnitType,
  ConditionType
} from "@/types/waste-api";

/**
 * Utilitários para trabalhar com a API de Waste conforme documentação
 */

/**
 * Cria um novo resíduo
 */
export async function createWaste(data: CreateWasteRequest): Promise<WasteResponse> {
  const response = await fetch('/api/waste', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result: ApiResponse<WasteResponse> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || `Erro ao criar resíduo: ${response.status}`);
  }

  return result.data;
}

/**
 * Busca resíduos disponíveis (não requer autenticação)
 */
export async function getAvailableWastes(filters?: WasteFilters): Promise<WasteResponse[]> {
  const searchParams = new URLSearchParams();
  
  if (filters?.wasteType) searchParams.append('wasteType', filters.wasteType);
  if (filters?.condition) searchParams.append('condition', filters.condition);
  if (filters?.location) searchParams.append('location', filters.location);
  if (filters?.page) searchParams.append('page', filters.page.toString());
  if (filters?.limit) searchParams.append('limit', filters.limit.toString());

  const response = await fetch(`/api/waste/available?${searchParams.toString()}`);
  const result: ApiResponse<WasteResponse[]> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || `Erro ao buscar resíduos disponíveis: ${response.status}`);
  }

  return result.data;
}

/**
 * Busca um resíduo por ID (não requer autenticação)
 */
export async function getWasteById(id: string): Promise<WasteResponse> {
  const response = await fetch(`/api/waste/${id}`);
  const result: ApiResponse<WasteResponse> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || `Erro ao buscar resíduo: ${response.status}`);
  }

  return result.data;
}

/**
 * Atualiza um resíduo (requer autenticação)
 */
export async function updateWaste(id: string, updateData: UpdateWasteRequest): Promise<WasteResponse> {
  const response = await fetch(`/api/waste/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  const result: ApiResponse<WasteResponse> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || `Erro ao atualizar resíduo: ${response.status}`);
  }

  return result.data;
}

/**
 * Deleta um resíduo (requer autenticação)
 */
export async function deleteWaste(id: string): Promise<void> {
  const response = await fetch(`/api/waste/${id}`, {
    method: 'DELETE'
  });

  const result: ApiResponse = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || `Erro ao deletar resíduo: ${response.status}`);
  }
}

/**
 * Converte os enums da API para strings legíveis em português
 */
export const wasteTypeLabels: Record<WasteType, string> = {
  [WasteType.ELECTRONICS]: 'Eletrônicos',
  [WasteType.ORGANIC]: 'Orgânicos',
  [WasteType.PLASTIC]: 'Plásticos',
  [WasteType.PAPER]: 'Papel',
  [WasteType.GLASS]: 'Vidro',
  [WasteType.METAL]: 'Metal',
  [WasteType.WOOD]: 'Madeira',
  [WasteType.TEXTILE]: 'Têxtil',
  [WasteType.MISCELLANEOUS]: 'Diversos'
};

export const unitTypeLabels: Record<UnitType, string> = {
  [UnitType.KG]: 'Kg',
  [UnitType.LITERS]: 'Litros',
  [UnitType.UNITS]: 'Unidades'
};

export const conditionLabels: Record<ConditionType, string> = {
  [ConditionType.NEW]: 'Novo',
  [ConditionType.USED]: 'Usado',
  [ConditionType.DAMAGED]: 'Danificado'
};

/**
 * Converte uma data/hora para formato ISO 8601 esperado pela API
 */
export function formatDiscardDate(date: string, time?: string): string {
  const dateObj = new Date(date);
  
  if (time) {
    const [hours, minutes] = time.split(':');
    dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  }
  
  return dateObj.toISOString();
}

/**
 * Valida se um arquivo é uma imagem válida para base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Converte array de arquivos para array de strings base64
 */
export async function filesToBase64Array(files: File[]): Promise<string[]> {
  const promises = files.map(file => fileToBase64(file));
  return Promise.all(promises);
}
