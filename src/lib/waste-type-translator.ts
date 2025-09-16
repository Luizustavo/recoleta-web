import { WasteType } from "@/types/waste-api";

// Mapeamento direto dos enums da API para português
const apiWasteTypeTranslations: Record<WasteType, string> = {
  [WasteType.ELECTRONICS]: "Eletrônicos",
  [WasteType.ORGANIC]: "Orgânico",
  [WasteType.PLASTIC]: "Plástico", 
  [WasteType.PAPER]: "Papel",
  [WasteType.GLASS]: "Vidro",
  [WasteType.METAL]: "Metal",
  [WasteType.WOOD]: "Madeira",
  [WasteType.TEXTILE]: "Têxtil",
  [WasteType.MISCELLANEOUS]: "Diversos"
};

// Mapeamento de tipos de resíduo em inglês para português (compatibilidade)
const wasteTypeTranslations: Record<string, string> = {
  // Enums da API
  "ELECTRONICS": "Eletrônicos",
  "ORGANIC": "Orgânico", 
  "PLASTIC": "Plástico",
  "PAPER": "Papel",
  "GLASS": "Vidro",
  "METAL": "Metal",
  "WOOD": "Madeira",
  "TEXTILE": "Têxtil",
  "MISCELLANEOUS": "Diversos",
  
  // Eletrônicos
  "electronics": "Eletrônicos",
  "electronic": "Eletrônico",
  "computer": "Computador",
  "laptop": "Notebook",
  "smartphone": "Smartphone",
  "phone": "Telefone",
  "tablet": "Tablet",
  "tv": "TV",
  "television": "Televisão",
  "monitor": "Monitor",
  "printer": "Impressora",
  "camera": "Câmera",
  
  // Baterias
  "battery": "Bateria",
  "batteries": "Baterias",
  "rechargeable_battery": "Bateria Recarregável",
  "alkaline_battery": "Pilha Alcalina",
  "lithium_battery": "Bateria de Lítio",
  
  // Lâmpadas
  "lamp": "Lâmpada",
  "lamps": "Lâmpadas",
  "light_bulb": "Lâmpada",
  "fluorescent_lamp": "Lâmpada Fluorescente",
  "led_lamp": "Lâmpada LED",
  
  // Óleos
  "oil": "Óleo",
  "cooking_oil": "Óleo de Cozinha",
  "motor_oil": "Óleo de Motor",
  "vegetable_oil": "Óleo Vegetal",
  
  // Papel
  "paper": "Papel",
  "cardboard": "Papelão",
  "newspaper": "Jornal",
  "magazine": "Revista",
  "book": "Livro",
  "books": "Livros",
  
  // Plástico
  "plastic": "Plástico",
  "pet_bottle": "Garrafa PET",
  "plastic_bag": "Sacola Plástica",
  "plastic_container": "Recipiente Plástico",
  
  // Vidro
  "glass": "Vidro",
  "glass_bottle": "Garrafa de Vidro",
  "glass_jar": "Pote de Vidro",
  "mirror": "Espelho",
  
  // Têxtil
  "textile": "Têxtil",
  "clothing": "Roupa",
  "clothes": "Roupas",
  "fabric": "Tecido",
  "shoes": "Sapatos",
  
  // Orgânico
  "organic": "Orgânico",
  "food_waste": "Resíduo Orgânico",
  "compost": "Compostagem",
  
  // Perigosos
  "hazardous": "Perigoso",
  "toxic": "Tóxico",
  "chemical": "Químico",
  "paint": "Tinta",
  "solvent": "Solvente",
  
  // Metal
  "metal": "Metal",
  "aluminum": "Alumínio",
  "iron": "Ferro",
  "copper": "Cobre",
  "can": "Lata",
  "cans": "Latas",
  
  // Outros
  "furniture": "Móvel",
  "mattress": "Colchão",
  "tire": "Pneu",
  "tires": "Pneus",
  "construction_waste": "Entulho",
  "wood": "Madeira"
};

/**
 * Traduz um tipo de resíduo da API para português
 * Função principal para usar com enums da API
 */
export function translateWasteTypeFromAPI(wasteType: WasteType): string {
  return apiWasteTypeTranslations[wasteType];
}

/**
 * Traduz um tipo de resíduo (compatibilidade)
 * Para uso com strings genéricas
 */
export function translateWasteType(wasteType: string): string {
  // Se já estiver em português, retorna como está
  if (/[áàâãéèêíìîóòôõúùû]/i.test(wasteType)) {
    return wasteType;
  }
  
  // Primeiro tenta busca direta (para enums da API)
  if (wasteTypeTranslations[wasteType]) {
    return wasteTypeTranslations[wasteType];
  }
  
  // Converte para lowercase e remove espaços/underscores para busca
  const normalizedType = wasteType.toLowerCase().replace(/[\s-]/g, '_');
  
  // Busca tradução exata
  if (wasteTypeTranslations[normalizedType]) {
    return wasteTypeTranslations[normalizedType];
  }
  
  // Busca por palavras-chave dentro do tipo
  for (const [key, translation] of Object.entries(wasteTypeTranslations)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      return translation;
    }
  }
  
  // Se não encontrou tradução, capitaliza a primeira letra
  return wasteType.charAt(0).toUpperCase() + wasteType.slice(1).toLowerCase();
}
