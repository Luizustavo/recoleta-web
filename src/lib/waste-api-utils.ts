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

/**
 * ⭐ COORDENADAS - Utilitários para geolocalização
 */

/**
 * Obtém a localização atual do usuário usando a API de geolocalização
 */
export function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não é suportada pelo navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        let message = 'Erro ao obter localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permissão para acessar localização foi negada';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Localização não disponível';
            break;
          case error.TIMEOUT:
            message = 'Timeout ao obter localização';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
        ...options
      }
    );
  });
}

/**
 * Converte coordenadas numéricas para string no formato esperado pela API
 */
export function formatCoordinates(lat: number, lng: number): { latitude: string; longitude: string } {
  return {
    latitude: lat.toString(),
    longitude: lng.toString()
  };
}

/**
 * Valida se as coordenadas estão dentro dos limites válidos
 */
export function validateCoordinates(latitude: string, longitude: string): { isValid: boolean; errors: string[] } {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  const errors: string[] = [];
  
  if (isNaN(lat)) {
    errors.push('Latitude deve ser um número válido');
  } else if (lat < -90 || lat > 90) {
    errors.push('Latitude deve estar entre -90 e 90');
  }
  
  if (isNaN(lng)) {
    errors.push('Longitude deve ser um número válido');
  } else if (lng < -180 || lng > 180) {
    errors.push('Longitude deve estar entre -180 e 180');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Obtém coordenadas com fallback manual se a geolocalização falhar
 */
export async function getCoordinatesWithFallback(): Promise<{ latitude: string; longitude: string }> {
  try {
    // Tentar obter localização automaticamente
    const position = await getCurrentPosition();
    return formatCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
  } catch (error) {
    console.warn('Não foi possível obter localização automaticamente:', error);
    
    // Solicitar coordenadas manualmente
    const latitude = prompt('Digite a latitude (-90 a 90):');
    const longitude = prompt('Digite a longitude (-180 a 180):');
    
    if (!latitude || !longitude) {
      throw new Error('Coordenadas são obrigatórias');
    }
    
    // Validar coordenadas
    const validation = validateCoordinates(latitude, longitude);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    return { latitude, longitude };
  }
}

/**
 * Cria um resíduo com obtenção automática de coordenadas
 */
export async function createWasteWithLocation(
  wasteData: CreateWasteRequest['waste'], 
  addressData: Omit<CreateWasteRequest['address'], 'latitude' | 'longitude'>
): Promise<WasteResponse> {
  // Obter coordenadas
  const coordinates = await getCoordinatesWithFallback();
  
  // Criar payload completo
  const payload: CreateWasteRequest = {
    waste: wasteData,
    address: {
      ...addressData,
      ...coordinates
    }
  };
  
  return createWaste(payload);
}

/**
 * Calcula a distância aproximada entre duas coordenadas (em km)
 * Usando a fórmula de Haversine
 */
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

/**
 * Ordena resíduos por proximidade a uma coordenada de referência
 */
export function sortWastesByDistance(
  wastes: WasteResponse[],
  userLat: number,
  userLng: number
): (WasteResponse & { distance?: number })[] {
  return wastes
    .filter(waste => waste.address?.latitude && waste.address?.longitude)
    .map(waste => ({
      ...waste,
      distance: calculateDistance(
        userLat, userLng,
        waste.address!.latitude!,
        waste.address!.longitude!
      )
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}
