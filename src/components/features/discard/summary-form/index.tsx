"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Trash2,
  Package,
  Info,
  Loader2,
} from "lucide-react";
import { SummaryFormProps } from "./types";

function SummaryForm({
  prevStep,
  handleSubmit,
  summaryData,
  isSubmitting = false,
}: SummaryFormProps) {

  const handleConfirmSubmit = async () => {
    try {
      await handleSubmit();
    } catch (error) {
      console.error("Erro ao submeter:", error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Não informado";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "Não informado";
    return timeString;
  };

  const getWasteTypeName = (id: string) => {
    const types: Record<string, string> = {
      eletronicos: "Eletrônicos",
      organicos: "Orgânicos", 
      plasticos: "Plásticos",
      papel: "Papel",
      vidros: "Vidros",
      metais: "Metais",
      madeira: "Madeira",
      texteis: "Têxteis",
      diversos: "Diversos",
    };
    return types[id] || id;
  };

  const getConditionName = (condition: string) => {
    const conditions: Record<string, string> = {
      novo: "Novo",
      usado: "Usado",
      danificado: "Danificado",
    };
    return conditions[condition] || condition;
  };

  const getUnitName = (unit: string) => {
    const units: Record<string, string> = {
      kg: "Quilogramas",
      unidades: "Unidades",
      litros: "Litros",
    };
    return units[unit] || unit;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Resumo do Descarte
        </CardTitle>
        <CardDescription>
          Verifique todas as informações antes de confirmar o agendamento da
          coleta.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informações do Resíduo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <Label className="text-lg font-semibold">
              Informações do Resíduo
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Tipo de Resíduo
              </Label>
              <p className="text-base">
                {getWasteTypeName(summaryData.waste.tipoResiduo)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Peso</Label>
              <p className="text-base">{summaryData.waste.peso} kg</p>
            </div>

            {summaryData.waste.quantidade > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Quantidade
                </Label>
                <p className="text-base">
                  {summaryData.waste.quantidade}{" "}
                  {getUnitName(summaryData.waste.unidade)}
                </p>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-600">
                Condição
              </Label>
              <Badge variant="secondary">
                {getConditionName(summaryData.waste.condicao)}
              </Badge>
            </div>

            {summaryData.waste.embalagem.length > 0 && (
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">
                  Embalagem
                </Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {summaryData.waste.embalagem.map((embalagem, index) => (
                    <Badge key={index} variant="outline">
                      <Package className="h-3 w-3 mr-1" />
                      {embalagem}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {summaryData.waste.descricaoAdicional && (
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-600">
                  Descrição Adicional
                </Label>
                <p className="text-sm text-gray-700 mt-1">
                  {summaryData.waste.descricaoAdicional}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Informações de Coleta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Label className="text-lg font-semibold">Agendamento</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Data
                </Label>
                <p className="text-base">
                  {formatDate(summaryData.waste.dataDescarte)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Horário
                </Label>
                <p className="text-base">
                  {formatTime(summaryData.waste.horaDescarte) ||
                    "Qualquer horário"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Endereço de Coleta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <Label className="text-lg font-semibold">Endereço de Coleta</Label>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="space-y-2">
              <p className="font-medium">
                {summaryData.address.rua}, {summaryData.address.numero}
                {summaryData.address.complemento &&
                  ` - ${summaryData.address.complemento}`}
              </p>
              <p className="text-sm text-gray-600">
                {summaryData.address.bairro} - {summaryData.address.cidade}/
                {summaryData.address.estado}
              </p>
              <p className="text-sm text-gray-600">
                CEP: {summaryData.address.cep}
              </p>
              {summaryData.address.referencia && (
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-green-400">
                  <Label className="text-xs font-medium text-gray-600">
                    Referência:
                  </Label>
                  <p className="text-sm">{summaryData.address.referencia}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações Importantes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">
                Próximos Passos:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  1. Após a confirmação, você receberá um número de protocolo
                </li>
                <li>
                  2. Nossa equipe entrará em contato para confirmar o horário
                </li>
                <li>
                  3. Prepare o resíduo conforme especificado até a data agendada
                </li>
                <li>4. Acompanhe o status da coleta pelo dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Voltar
        </Button>
        <Button
          onClick={handleConfirmSubmit}
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Agendando...
            </>
          ) : (
            "Confirmar Descarte"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export { SummaryForm };
export default SummaryForm;
