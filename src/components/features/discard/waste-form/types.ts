import { LucideIcon } from 'lucide-react';

export interface WasteType {
  id: string;
  nome: string;
  imagem: string;
  descricao?: string;
  icon: LucideIcon;
  color: string;
}

export interface WasteFormData {
  tipoResiduo: string;
  peso: number;
  quantidade: number;
  unidade: 'kg' | 'unidades' | 'litros';
  condicao: 'novo' | 'usado' | 'danificado';
  embalagem: string[];
  dataDescarte: string;
  horaDescarte: string;
  descricaoAdicional?: string;
  imagens?: File[] | string[];
}

export interface WasteFormProps {
  onNext: (data: WasteFormData) => void;
  initialData?: WasteFormData | null;
}

export type { AddressData } from '../address-form/types';
export type { SummaryData } from '../summary-form/types';