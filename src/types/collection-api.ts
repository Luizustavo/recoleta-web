// Tipos baseados na documentação da API de Collection

// Enums
export enum CollectionStatus {
  SIGNED = 'SIGNED',
  COLLECTED = 'COLLECTED', 
  CANCELLED = 'CANCELLED'
}

// Interfaces para requisições
export interface SignCollectionRequest {
  wasteId: string;
}

// Interfaces para consulta
export interface MyCollectionsFilters {
  status?: CollectionStatus;
  page?: number;
  limit?: number;
}

// Interfaces para respostas 
export interface CollectorResponse {
  id: string;
  name: string;
  email: string;
}

export interface WasteInCollectionResponse {
  id: string;
  wasteType: string;
  weight: number;
  quantity: number;
  unit: string;
  condition: string;
  hasPackaging: boolean;
  discardDate: string; // ISO 8601 string
  status: string;
  additionalDescription?: string;
  images?: string[];
  address: {
    id?: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    reference?: string;
    main?: boolean;
    latitude?: number;
    longitude?: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface CollectionResponse {
  id: string;
  collectorId: string;
  wasteId: string;
  status: CollectionStatus;
  signedAt: string; // ISO 8601 string
  collectedAt?: string | null; // ISO 8601 string
  collector?: CollectorResponse;
  waste?: WasteInCollectionResponse;
  createdAt: string;
  updatedAt: string;
}

export interface MyCollectionsResponse {
  items: CollectionResponse[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

// Resposta padrão da API
export interface CollectionApiResponse<T = unknown> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
}

// Tipos de resposta específicos
export type SignCollectionApiResponse = CollectionApiResponse<CollectionResponse>;
export type MyCollectionsApiResponse = CollectionApiResponse<MyCollectionsResponse>;

// Códigos de erro específicos para Collection
export enum CollectionErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED', 
  WASTE_NOT_FOUND = 'WASTE_NOT_FOUND',
  WASTE_NOT_AVAILABLE = 'WASTE_NOT_AVAILABLE',
  USER_IS_OWNER = 'USER_IS_OWNER',
  ALREADY_SIGNED = 'ALREADY_SIGNED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface CollectionApiError {
  success: false;
  message: string;
  code: CollectionErrorCode;
}
