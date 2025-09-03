'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface ResumoCadastro {
  tipoResiduo: string;
  endereco: Endereco;
  detalhesAdicionais?: string;
}

export default function SummaryRegistration({
  prevStep,
  handleSubmit,
}: {
  prevStep: () => void;
  handleSubmit: () => void;
}) {
  const [resumo, setResumo] = useState<ResumoCadastro>({
    tipoResiduo: 'Eletrônico',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
    },
    detalhesAdicionais: 'Computador antigo para reciclagem',
  });
  console.log(setResumo);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Resumo do Cadastro do Resíduo</CardTitle>
        <CardDescription>
          Verifique as informações do seu cadastro antes de confirmar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Tipo de Resíduo</Label>
          <p className="text-sm text-gray-600">{resumo.tipoResiduo}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Endereço para Coleta
          </Label>
          <div className="pl-4 border-l-2 border-gray-200">
            <p className="text-sm text-gray-600">
              {resumo.endereco.rua}, {resumo.endereco.numero}
            </p>
            <p className="text-sm text-gray-600">{resumo.endereco.bairro}</p>
            <p className="text-sm text-gray-600">
              {resumo.endereco.cidade} - {resumo.endereco.estado}
            </p>
            <p className="text-sm text-gray-600">CEP: {resumo.endereco.cep}</p>
          </div>
        </div>
        {resumo.detalhesAdicionais && (
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Detalhes Adicionais
            </Label>
            <p className="text-sm text-gray-600">{resumo.detalhesAdicionais}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button variant="outline" onClick={handleSubmit}>
          Descartar Resíduo
        </Button>
      </CardFooter>
    </Card>
  );
}
