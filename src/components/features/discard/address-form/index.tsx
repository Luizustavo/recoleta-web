'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { AddressData, AddressFormProps } from './types';

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function AddressForm({ nextStep, prevStep, initialData }: AddressFormProps) {
  const [addressData, setAddressData] = useState<AddressData>(initialData || {
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    referencia: '',
    principal: false,
  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    setAddressData({ ...addressData, cep });

    if (cep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddressData({
            ...addressData,
            cep,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const formatCep = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressData.cep || addressData.cep.length < 8) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!addressData.rua.trim()) {
      newErrors.rua = 'Rua é obrigatória';
    }

    if (!addressData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!addressData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!addressData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!addressData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    nextStep(addressData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereço de Coleta
        </CardTitle>
        <CardDescription>
          Informe o endereço onde a coleta deve ser realizada.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CEP */}
          <div className="space-y-2">
            <Label htmlFor="cep">CEP *</Label>
            <div className="relative">
              <Input
                id="cep"
                name="cep"
                value={formatCep(addressData.cep)}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
                className={errors.cep ? 'border-red-500' : ''}
                required
              />
              {isLoadingCep && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            {errors.cep && (
              <p className="text-sm text-red-500">{errors.cep}</p>
            )}
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="rua">Rua/Avenida *</Label>
              <Input
                id="rua"
                name="rua"
                value={addressData.rua}
                onChange={handleInputChange}
                placeholder="Nome da rua"
                className={errors.rua ? 'border-red-500' : ''}
                required
              />
              {errors.rua && (
                <p className="text-sm text-red-500">{errors.rua}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                name="numero"
                value={addressData.numero}
                onChange={handleInputChange}
                placeholder="123"
                className={errors.numero ? 'border-red-500' : ''}
                required
              />
              {errors.numero && (
                <p className="text-sm text-red-500">{errors.numero}</p>
              )}
            </div>
          </div>

          {/* Complemento */}
          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento (opcional)</Label>
            <Input
              id="complemento"
              name="complemento"
              value={addressData.complemento}
              onChange={handleInputChange}
              placeholder="Apartamento, bloco, casa, etc."
            />
          </div>

          {/* Bairro e Cidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                name="bairro"
                value={addressData.bairro}
                onChange={handleInputChange}
                placeholder="Nome do bairro"
                className={errors.bairro ? 'border-red-500' : ''}
                required
              />
              {errors.bairro && (
                <p className="text-sm text-red-500">{errors.bairro}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                name="cidade"
                value={addressData.cidade}
                onChange={handleInputChange}
                placeholder="Nome da cidade"
                className={errors.cidade ? 'border-red-500' : ''}
                required
              />
              {errors.cidade && (
                <p className="text-sm text-red-500">{errors.cidade}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Select 
              value={addressData.estado} 
              onValueChange={(value) => {
                setAddressData({ ...addressData, estado: value });
                if (errors.estado) {
                  setErrors(prev => ({ ...prev, estado: '' }));
                }
              }}
            >
              <SelectTrigger className={errors.estado ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosBrasil.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.estado && (
              <p className="text-sm text-red-500">{errors.estado}</p>
            )}
          </div>

          {/* Referência */}
          <div className="space-y-2">
            <Label htmlFor="referencia">Ponto de Referência (opcional)</Label>
            <Textarea
              id="referencia"
              name="referencia"
              value={addressData.referencia}
              onChange={handleInputChange}
              placeholder="Ex: Próximo ao supermercado, em frente à escola..."
              rows={3}
            />
          </div>

          {/* Principal */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="principal"
              checked={addressData.principal}
              onCheckedChange={(checked) => 
                setAddressData({ ...addressData, principal: checked as boolean })}
            />
            <Label htmlFor="principal" className="text-sm">
              Definir como endereço principal
            </Label>
          </div>

          {/* Botões */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={prevStep}>
              Voltar
            </Button>
            <Button type="submit">
              Próximo: Resumo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
