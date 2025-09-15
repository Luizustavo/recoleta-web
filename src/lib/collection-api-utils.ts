import {
  SignCollectionRequest,
  CollectionResponse,
  MyCollectionsFilters,
  MyCollectionsResponse,
  SignCollectionApiResponse,
  MyCollectionsApiResponse,
  CollectionStatus
} from "@/types/collection-api";

/**
 * Utilitários para trabalhar com a API de Collection conforme documentação
 */

/**
 * Assina uma coleta para um resíduo específico
 */
export async function signCollection(wasteId: string): Promise<CollectionResponse> {
  const request: SignCollectionRequest = {
    wasteId
  };

  const response = await fetch('/api/collection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  const result: SignCollectionApiResponse = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || `Erro ao assinar coleta: ${response.status}`);
  }

  return result.data;
}

/**
 * Lista todas as coletas assinadas pelo usuário logado
 */
export async function getMyCollections(filters?: MyCollectionsFilters): Promise<MyCollectionsResponse> {
  const searchParams = new URLSearchParams();
  
  if (filters?.status) searchParams.append('status', filters.status);
  if (filters?.page) searchParams.append('page', filters.page.toString());
  if (filters?.limit) searchParams.append('limit', filters.limit.toString());

  const response = await fetch(`/api/collection/my?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const result: MyCollectionsApiResponse = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.message || `Erro ao buscar minhas coletas: ${response.status}`);
  }

  return result.data;
}

/**
 * Converte os enums da API para strings legíveis em português
 */
export const collectionStatusLabels: Record<CollectionStatus, string> = {
  [CollectionStatus.SIGNED]: 'Assinada',
  [CollectionStatus.COLLECTED]: 'Coletada', 
  [CollectionStatus.CANCELLED]: 'Cancelada'
};

/**
 * Retorna a cor apropriada para cada status de coleta
 */
export const collectionStatusColors: Record<CollectionStatus, string> = {
  [CollectionStatus.SIGNED]: 'bg-blue-100 text-blue-800 border-blue-200',
  [CollectionStatus.COLLECTED]: 'bg-green-100 text-green-800 border-green-200',
  [CollectionStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200'
};

/**
 * Verifica se uma coleta pode ser cancelada
 */
export function canCancelCollection(status: CollectionStatus): boolean {
  return status === CollectionStatus.SIGNED;
}

/**
 * Verifica se uma coleta pode ser marcada como coletada
 */
export function canMarkAsCollected(status: CollectionStatus): boolean {
  return status === CollectionStatus.SIGNED;
}

/**
 * Formata a data de uma coleta para exibição
 */
export function formatCollectionDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

/**
 * Calcula há quanto tempo uma coleta foi assinada
 */
export function getTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `há ${Math.max(1, diffInMinutes)} minuto${diffInMinutes > 1 ? 's' : ''}`;
    }
  } catch {
    return 'Data inválida';
  }
}

/**
 * Gera uma descrição resumida do resíduo para exibição em listas
 */
export function getWasteSummary(waste: {
  wasteType: string;
  weight: number;
  unit: string;
  condition: string;
}): string {
  const typeLabels: Record<string, string> = {
    'ELECTRONICS': 'Eletrônicos',
    'ORGANIC': 'Orgânicos', 
    'PLASTIC': 'Plásticos',
    'PAPER': 'Papel',
    'GLASS': 'Vidro',
    'METAL': 'Metal',
    'WOOD': 'Madeira',
    'TEXTILE': 'Têxtil',
    'MISCELLANEOUS': 'Diversos'
  };

  const conditionLabels: Record<string, string> = {
    'NEW': 'Novo',
    'USED': 'Usado',
    'DAMAGED': 'Danificado'
  };

  const type = typeLabels[waste.wasteType] || waste.wasteType;
  const condition = conditionLabels[waste.condition] || waste.condition;
  
  return `${type} • ${waste.weight} ${waste.unit} • ${condition}`;
}

/**
 * Gera o endereço resumido para exibição
 */
export function getAddressSummary(address: {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}): string {
  return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`;
}
