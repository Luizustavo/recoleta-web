'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const residuos = [
  {
    id: 'eletronico',
    nome: 'Eletrônico',
    imagem: '/images/waste/electronic.png',
  },
  {
    id: 'plastico',
    nome: 'Plástico',
    imagem: '/images/waste/plastic.png',
  },
  {
    id: 'papel',
    nome: 'Papel',
    imagem: '/images/waste/paper.png',
  },
  {
    id: 'vidro',
    nome: 'Vidro',
    imagem: '/images/waste/glass.png',
  },
  {
    id: 'metal',
    nome: 'Metal',
    imagem: '/images/waste/metal.png',
  },
  {
    id: 'organico',
    nome: 'Orgânico',
    imagem: '/images/waste/organic.png',
  },
];

export default function SelecaoResiduo({ nextStep }: { nextStep: () => void }) {
  const [formData, setFormData] = useState<{
    tipoResiduo: string;
    quantidade: string;
    condicao: string;
    embalagem: string[];
    dataColeta: string;
    horaColeta: string;
  }>({
    tipoResiduo: '',
    quantidade: '',
    condicao: '',
    embalagem: [],
    dataColeta: '',
    horaColeta: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResiduoSelect = (id: string) => {
    setFormData(prev => ({ ...prev, tipoResiduo: id }));
  };

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setFormData(prev => ({
      ...prev,
      embalagem: checked
        ? [...prev.embalagem, value]
        : prev.embalagem.filter(item => item !== value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados do resíduo enviados.');
    nextStep(); // Avança para o próximo passo
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Detalhes do Resíduo para Descarte</CardTitle>
        <CardDescription>
          Selecione o tipo de resíduo e forneça as informações adicionais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Tipo de Resíduo</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {residuos.map(residuo => (
                <Card
                  key={residuo.id}
                  className={`cursor-pointer transition-all ${formData.tipoResiduo === residuo.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleResiduoSelect(residuo.id)}
                >
                  <CardContent className="flex flex-col items-center p-4">
                    <Image
                      src={residuo.imagem}
                      alt={residuo.nome}
                      width={100}
                      height={100}
                      className="mb-2"
                    />
                    <span className="text-sm font-medium">{residuo.nome}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade (em kg)</Label>
            <Input
              id="quantidade"
              name="quantidade"
              type="number"
              min="0"
              step="0.1"
              value={formData.quantidade}
              onChange={handleInputChange}
              placeholder="Ex: 5.5"
            />
          </div>

          <div className="space-y-2">
            <Label>Condição do Resíduo</Label>
            <RadioGroup
              onValueChange={value =>
                setFormData(prev => ({ ...prev, condicao: value }))
              }
              value={formData.condicao}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limpo" id="limpo" />
                <Label htmlFor="limpo">Limpo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sujo" id="sujo" />
                <Label htmlFor="sujo">Sujo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misto" id="misto" />
                <Label htmlFor="misto">Misto</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Embalagem Disponível</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="caixa"
                  onCheckedChange={checked =>
                    handleCheckboxChange(checked as boolean, 'caixa')
                  }
                />
                <Label htmlFor="caixa">Caixa de Papelão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saco"
                  onCheckedChange={checked =>
                    handleCheckboxChange(checked as boolean, 'saco')
                  }
                />
                <Label htmlFor="saco">Saco de Lixo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="solto"
                  onCheckedChange={checked =>
                    handleCheckboxChange(checked as boolean, 'solto')
                  }
                />
                <Label htmlFor="solto">Solto</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataColeta">Data Preferida para Coleta</Label>
            <Input
              id="dataColeta"
              name="dataColeta"
              type="date"
              value={formData.dataColeta}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horaColeta">Hora Preferida para Coleta</Label>
            <Input
              id="horaColeta"
              name="horaColeta"
              type="time"
              value={formData.horaColeta}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end items-center">
            {' '}
            <Button type="submit">Avançar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
