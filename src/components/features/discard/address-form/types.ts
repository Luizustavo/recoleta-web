export interface AddressData {
  id?: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  referencia?: string;
  principal?: boolean;
}

export interface AddressFormProps {
  nextStep: (data: AddressData) => void;
  prevStep: () => void;
  initialData?: AddressData | null;
}