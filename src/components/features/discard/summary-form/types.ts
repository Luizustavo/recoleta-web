import { WasteFormData } from '../waste-form/types';
import { AddressData } from '../address-form/types';

export interface SummaryData {
  waste: WasteFormData;
  address: AddressData;
  status?: 'pendente' | 'agendado' | 'coletado' | 'cancelado';
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export interface SummaryFormProps {
  prevStep: () => void;
  handleSubmit: () => void;
  summaryData: SummaryData;
  isSubmitting?: boolean;
}