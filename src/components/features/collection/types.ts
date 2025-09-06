export interface CollectionFilters {
  city?: string;
  state?: string;
  wasteType?: string;
  maxDistance?: number;
  latitude?: number;
  longitude?: number;
  page?: number;
  limit?: number;
}

export interface CollectionRequestData {
  message?: string;
}

export interface CollectionRequestResult {
  success: boolean;
  message: string;
}

export interface AvailableWasteResponse {
  id: string;
  wasteType: string;
  weight: number;
  quantity: number;
  condition: string;
  status: string;
  discardDate: string;
  additionalDescription?: string;
  distance?: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  images?: string[];
}

export interface CollectionPageProps {
  initialFilters?: CollectionFilters;
}
