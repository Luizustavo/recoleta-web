import {
  Smartphone,
  Recycle,
  FileText,
  Wine,
  Wrench,
  Apple,
  Shirt,
  Package,
  Battery,
  Lightbulb,
  Droplets,
} from "lucide-react";

interface WasteTypeIconProps {
  wasteType: string;
  className?: string;
}

export function WasteTypeIcon({
  wasteType,
  className = "h-3.5 w-3.5 text-black",
}: WasteTypeIconProps) {
  const type = wasteType.toLowerCase();

  // Mapeamento exato baseado nos IDs em inglês e português
  switch (type) {
      case "electronics":
      return <Smartphone className={className} />;
    case "plastics":
      return <Recycle className={className} />;
    case "paper":
      return <FileText className={className} />;
    case "glass":
      return <Wine className={className} />;
    case "metals":
      return <Wrench className={className} />;
    case "organic":
      return <Apple className={className} />;
    case "hazardous":
      return <Package className={className} />;
    case "textiles":
      return <Shirt className={className} />;
    case "miscellaneous":
      return <Package className={className} />;
  }

  // Fallbacks para variações ou tipos em outros idiomas
  if (
    type.includes("eletronic") ||
    type.includes("computador") ||
    type.includes("celular") ||
    type.includes("smartphone") ||
    type.includes("tv")
  ) {
    return <Smartphone className={className} />;
  }

  if (
    type.includes("plastic") ||
    type.includes("pet") ||
    type.includes("embalagem")
  ) {
    return <Recycle className={className} />;
  }

  if (
    type.includes("paper") ||
    type.includes("livro") ||
    type.includes("revista") ||
    type.includes("jornal") ||
    type.includes("caixa")
  ) {
    return <FileText className={className} />;
  }

  if (
    type.includes("vidro") ||
    type.includes("glass") ||
    type.includes("garrafa") ||
    type.includes("pote")
  ) {
    return <Wine className={className} />;
  }

  if (
    type.includes("metal") ||
    type.includes("lata") ||
    type.includes("ferro") ||
    type.includes("alum")
  ) {
    return <Wrench className={className} />;
  }

  if (
    type.includes("organic") ||
    type.includes("comida") ||
    type.includes("resto") ||
    type.includes("casca")
  ) {
    return <Apple className={className} />;
  }

  if (
    type.includes("perigoso") ||
    type.includes("toxic") ||
    type.includes("quimic")
  ) {
    return <Package className={className} />;
  }

  if (
    type.includes("textil") ||
    type.includes("roupa") ||
    type.includes("tecido")
  ) {
    return <Shirt className={className} />;
  }

  // Ícones específicos adicionais
  if (
    type.includes("pilha") ||
    type.includes("bateria") ||
    type.includes("battery")
  ) {
    return <Battery className={className} />;
  }

  if (type.includes("lamp") || type.includes("luz")) {
    return <Lightbulb className={className} />;
  }

  if (type.includes("oil") || type.includes("oleo")) {
    return <Droplets className={className} />;
  }

  // Ícone padrão - usando Recycle por ser mais genérico para resíduos
  return <Recycle className={className} />;
}
