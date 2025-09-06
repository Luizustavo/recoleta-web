// Tipos baseados na documentação da API de waste

// Enums
export enum WasteType {
  ELECTRONICS = 'ELECTRONICS',
  ORGANIC = 'ORGANIC',
  PLASTIC = 'PLASTIC',
  PAPER = 'PAPER',
  GLASS = 'GLASS',
  METAL = 'METAL',
  WOOD = 'WOOD',
  TEXTILE = 'TEXTILE',
  MISCELLANEOUS = 'MISCELLANEOUS'
}

export enum UnitType {
  KG = 'KG',
  LITERS = 'LITERS',
  UNITS = 'UNITS'
}

export enum ConditionType {
  NEW = 'NEW',
  USED = 'USED',
  DAMAGED = 'DAMAGED'
}

export enum WasteStatus {
  AVAILABLE = 'AVAILABLE',
  REQUESTED = 'REQUESTED',
  COLLECTED = 'COLLECTED'
}

// Interfaces para requisições
export interface CreateWasteRequest {
  waste: {
    wasteType: WasteType;
    weight: number;
    quantity: number;
    unit: UnitType;
    condition: ConditionType;
    hasPackaging: boolean;
    discardDate: string; // ISO 8601 string
    additionalDescription?: string;
    images?: string[]; // Base64 strings
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    reference?: string;
    main?: boolean;
    latitude: string;  // ⭐ OBRIGATÓRIO: coordenada como string (ex: "-23.5505")
    longitude: string; // ⭐ OBRIGATÓRIO: coordenada como string (ex: "-46.6333")
  };
}

export interface UpdateWasteRequest {
  waste: {
    wasteType?: WasteType;
    weight?: number;
    quantity?: number;
    unit?: UnitType;
    condition?: ConditionType;
    hasPackaging?: boolean;
    discardDate?: string; // ISO 8601 string
    additionalDescription?: string;
    images?: string[]; // Base64 strings
  };
}

// Interfaces para respostas
export interface AddressResponse {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
  main?: boolean;
  latitude?: number;  // 📍 Retornado pelo backend como number
  longitude?: number; // 📍 Retornado pelo backend como number
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export interface WasteResponse {
  id: string;
  wasteType: WasteType;
  weight: number;
  quantity: number;
  unit: UnitType;
  condition: ConditionType;
  hasPackaging: boolean;
  discardDate: string; // ISO 8601 string
  status: WasteStatus;
  additionalDescription?: string;
  images?: string[];
  userId: string;
  addressId: string;
  address?: AddressResponse;
  user?: UserResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  code: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AvailableWastesResponse extends ApiResponse<WasteResponse[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filtros para consulta de resíduos disponíveis
export interface WasteFilters {
  wasteType?: WasteType;
  condition?: ConditionType;
  location?: string;
  page?: number;
  limit?: number;
}

// Códigos de erro comuns
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface ApiError {
  success: false;
  message: string;
  code: ApiErrorCode;
}
