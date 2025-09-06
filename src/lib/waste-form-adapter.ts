/**
 * ⭐ Utilitário para converter dados entre o formulário atual e a nova API de waste
 */

import { WasteFormData } from '@/components/features/discard/waste-form/types';
import { AddressData } from '@/components/features/discard/address-form/types';
import { CreateWasteRequest, WasteType as APIWasteType, UnitType, ConditionType } from '@/types/waste-api';
import { createWasteWithLocation, filesToBase64Array, formatDiscardDate } from '@/lib/waste-api-utils';

/**
 * Mapeamento entre os tipos do formulário atual e os tipos da API
 */
const WASTE_TYPE_MAPPING: Record<string, APIWasteType> = {
  'eletronicos': APIWasteType.ELECTRONICS,
  'organicos': APIWasteType.ORGANIC,
  'plasticos': APIWasteType.PLASTIC,
  'papel': APIWasteType.PAPER,
  'vidro': APIWasteType.GLASS,
  'metal': APIWasteType.METAL,
  'madeira': APIWasteType.WOOD,
  'textil': APIWasteType.TEXTILE,
  'diversos': APIWasteType.MISCELLANEOUS
};

const UNIT_MAPPING: Record<string, UnitType> = {
  'kg': UnitType.KG,
  'litros': UnitType.LITERS,
  'unidades': UnitType.UNITS
};

const CONDITION_MAPPING: Record<string, ConditionType> = {
  'novo': ConditionType.NEW,
  'usado': ConditionType.USED,
  'danificado': ConditionType.DAMAGED
};

/**
 * Converte dados do formulário atual para o formato da API
 */
export async function convertFormDataToAPI(
  wasteData: WasteFormData,
  addressData: AddressData
): Promise<CreateWasteRequest> {
  // Converter imagens para base64 se necessário
  let images: string[] = [];
  if (wasteData.imagens && wasteData.imagens.length > 0) {
    // Se são arquivos File, converter para base64
    if (wasteData.imagens[0] instanceof File) {
      images = await filesToBase64Array(wasteData.imagens as File[]);
    } else {
      // Se já são strings, usar diretamente
      images = wasteData.imagens as string[];
    }
  }

  // Montar dados do resíduo
  const waste: CreateWasteRequest['waste'] = {
    wasteType: WASTE_TYPE_MAPPING[wasteData.tipoResiduo] || APIWasteType.MISCELLANEOUS,
    weight: wasteData.peso,
    quantity: wasteData.quantidade,
    unit: UNIT_MAPPING[wasteData.unidade] || UnitType.UNITS,
    condition: CONDITION_MAPPING[wasteData.condicao] || ConditionType.USED,
    hasPackaging: wasteData.embalagem.length > 0,
    discardDate: formatDiscardDate(wasteData.dataDescarte, wasteData.horaDescarte),
    additionalDescription: wasteData.descricaoAdicional,
    images: images.length > 0 ? images : undefined
  };

  // Montar dados do endereço (sem coordenadas - serão obtidas automaticamente)
  const address: Omit<CreateWasteRequest['address'], 'latitude' | 'longitude'> = {
    street: addressData.rua,
    number: addressData.numero,
    complement: addressData.complemento || undefined,
    neighborhood: addressData.bairro,
    city: addressData.cidade,
    state: addressData.estado,
    zipCode: addressData.cep,
    reference: addressData.referencia || undefined,
    main: addressData.principal || false
  };

  return { waste, address };
}

/**
 * Cria um resíduo usando os dados do formulário atual com obtenção automática de coordenadas
 */
export async function createWasteFromForm(
  wasteData: WasteFormData,
  addressData: AddressData
) {
  try {
    // Converter dados do formulário
    const { waste, address } = await convertFormDataToAPI(wasteData, addressData);
    
    // Criar resíduo com coordenadas automáticas
    const result = await createWasteWithLocation(waste, address);
    
    return result;
  } catch (error) {
    // Tratar erros específicos de coordenadas
    if (error instanceof Error && error.message.includes('Geolocalização')) {
      throw new Error('Para criar um resíduo, é necessário permitir o acesso à localização ou inserir as coordenadas manualmente.');
    }
    
    if (error instanceof Error && error.message.includes('Coordenadas')) {
      throw new Error(`Erro nas coordenadas: ${error.message}`);
    }
    
    throw error;
  }
}

/**
 * Valida os dados do formulário antes de enviar para a API
 */
export function validateWasteFormData(wasteData: WasteFormData, addressData: AddressData): string[] {
  const errors: string[] = [];

  // Validações do resíduo
  if (!wasteData.tipoResiduo) {
    errors.push('Tipo de resíduo é obrigatório');
  }
  
  if (wasteData.peso <= 0) {
    errors.push('Peso deve ser maior que zero');
  }
  
  if (wasteData.quantidade <= 0) {
    errors.push('Quantidade deve ser maior que zero');
  }
  
  if (!wasteData.dataDescarte) {
    errors.push('Data de descarte é obrigatória');
  }

  // Validações do endereço
  if (!addressData.rua) {
    errors.push('Rua é obrigatória');
  }
  
  if (!addressData.numero) {
    errors.push('Número é obrigatório');
  }
  
  if (!addressData.bairro) {
    errors.push('Bairro é obrigatório');
  }
  
  if (!addressData.cidade) {
    errors.push('Cidade é obrigatória');
  }
  
  if (!addressData.estado) {
    errors.push('Estado é obrigatório');
  }
  
  if (!addressData.cep) {
    errors.push('CEP é obrigatório');
  }

  return errors;
}

import { WasteResponse } from '@/types/waste-api';

/**
 * Exemplo de uso completo
 */
export async function handleFormSubmission(
  wasteData: WasteFormData,
  addressData: AddressData
): Promise<{ success: boolean; message: string; data?: WasteResponse }> {
  try {
    // 1. Validar dados
    const validationErrors = validateWasteFormData(wasteData, addressData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: `Dados inválidos: ${validationErrors.join(', ')}`
      };
    }

    // 2. Criar resíduo
    const result = await createWasteFromForm(wasteData, addressData);

    return {
      success: true,
      message: '✅ Resíduo criado com sucesso! As coordenadas foram obtidas automaticamente.',
      data: result
    };

  } catch (error) {
    console.error('Erro ao criar resíduo:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao criar resíduo'
    };
  }
}
