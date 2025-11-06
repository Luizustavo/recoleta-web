"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Upload,
  X,
} from "lucide-react";
import { WasteFormData, WasteFormProps } from "./types";
import { wasteTypes } from "./utils";

export default function WasteForm({ onNext, initialData }: WasteFormProps) {
  const [formData, setFormData] = useState<WasteFormData>(
    initialData || {
      tipoResiduo: "",
      peso: 0,
      quantidade: 0,
      unidade: "kg",
      condicao: "novo",
      embalagem: [],
      dataDescarte: "",
      horaDescarte: "",
      descricaoAdicional: "",
      imagens: [],
    }
  );

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

  const handleResiduoSelect = (id: string) => {
    setFormData({ ...formData, tipoResiduo: id });
  };

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setFormData({
      ...formData,
      embalagem: checked
        ? [...formData.embalagem, value]
        : formData.embalagem.filter((item) => item !== value),
    });
  };

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");

      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        const sizeInBytes = Math.round(
          (compressedBase64.length - "data:image/jpeg;base64,".length) * 0.75
        );

        if (sizeInBytes > 50 * 1024) {
          const lowerQualityBase64 = canvas.toDataURL("image/jpeg", 0.5);
          const base64Only = lowerQualityBase64.split(",")[1];
          resolve(base64Only);
        } else {
          const base64Only = compressedBase64.split(",")[1];
          resolve(base64Only);
        }
      };

      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(
        (file) =>
          file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024 // Aumentar limite para 10MB
      );

      const remainingSlots = 5 - selectedImages.length;
      const filesToProcess = validFiles.slice(0, remainingSlots);

      if (filesToProcess.length > 0) {
        try {
          console.log(`⏳ Processando ${filesToProcess.length} imagem(ns)...`);

          const processedImages: File[] = [];
          for (let i = 0; i < filesToProcess.length; i++) {
            const file = filesToProcess[i];
            console.log(
              `📷 Processando imagem ${i + 1}: ${file.name} (${Math.round(
                file.size / 1024
              )}KB)`
            );

            try {
              const compressedBase64 = await resizeAndCompressImage(file);
              const sizeKB = Math.round(
                (compressedBase64.length * 0.75) / 1024
              );
              console.log(`✅ Imagem comprimida: ${sizeKB}KB`);

              const compressedBlob = new Blob(
                [
                  Uint8Array.from(atob(compressedBase64), (c) =>
                    c.charCodeAt(0)
                  ),
                ],
                { type: "image/jpeg" }
              );
              const compressedFile = new File(
                [compressedBlob],
                `compressed_${file.name}`,
                { type: "image/jpeg" }
              );

              processedImages.push(compressedFile);
            } catch (error) {
              console.error(`❌ Erro ao processar ${file.name}:`, error);
              toast.error(`Erro ao processar a imagem ${file.name}`, {
                description: "Tente novamente com uma imagem diferente.",
              });
            }
          }

          setSelectedImages((prev) => [...prev, ...processedImages]);

          if (processedImages.length > 0) {
            console.log(
              `✅ ${processedImages.length} imagem(ns) processada(s) com sucesso`
            );
            toast.success(
              `${processedImages.length} imagem(ns) adicionada(s)`,
              {
                description: "Imagens otimizadas automaticamente.",
              }
            );
          }
        } catch (error) {
          console.error("Erro geral no processamento:", error);
          toast.error("Erro ao processar imagens", {
            description: "Tente novamente ou use imagens diferentes.",
          });
        }
      }

      if (validFiles.length > remainingSlots) {
        toast.warning("Limite de imagens atingido", {
          description: `Só é possível adicionar mais ${remainingSlots} imagem(ns). Máximo total: 5.`,
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allowedTypes = [
      "eletronicos",
      "organicos",
      "plasticos",
      "papel",
      "vidros",
      "metais",
      "perigosos",
      "texteis",
      "mistos",
    ];

    if (!formData.tipoResiduo) {
      toast.error("Tipo de resíduo obrigatório", {
        description: "Por favor, selecione um tipo de resíduo.",
      });
      return;
    }

    if (!allowedTypes.includes(formData.tipoResiduo)) {
      toast.error("Tipo de resíduo inválido", {
        description: `Tipos aceitos: ${allowedTypes.join(", ")}`,
      });
      return;
    }

    if (formData.peso <= 0) {
      toast.error("Peso obrigatório", {
        description: "Por favor, informe o peso do resíduo.",
      });
      return;
    }

    if (!formData.dataDescarte) {
      toast.error("Data obrigatória", {
        description: "Por favor, informe a data de descarte.",
      });
      return;
    }

    try {
      const base64Images: string[] = [];

      for (const imageFile of selectedImages) {
        try {
          const compressedBase64 = await resizeAndCompressImage(imageFile);
          base64Images.push(compressedBase64);
        } catch (error) {
          console.error("Erro ao processar imagem:", error);
          toast.error("Erro ao processar imagem", {
            description:
              "Uma das imagens não pôde ser processada. Tente novamente.",
          });
          return;
        }
      }

      const submissionData = {
        ...formData,
        imagens: base64Images,
      };

      console.log(`📤 Enviando formulário:`);
      console.log(`   Tipo: ${submissionData.tipoResiduo} ✅`);
      console.log(`   Imagens: ${base64Images.length}`);

      toast.success("Formulário validado com sucesso!", {
        description: "Prosseguindo para o endereço...",
      });

      onNext(submissionData);
    } catch (error) {
      console.error("Erro no envio:", error);
      toast.error("Erro ao enviar formulário", {
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Detalhes do Resíduo para Descarte</CardTitle>
        <CardDescription>
          Selecione o tipo de resíduo e forneça as informações necessárias para
          o descarte adequado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Tipo de Resíduo</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wasteTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 hover:bg-gray-50 transition-all duration-200 ${
                      formData.tipoResiduo === type.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleResiduoSelect(type.id)}
                  >
                    <div className="text-center space-y-3">
                      <div
                        className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center transition-colors ${
                          formData.tipoResiduo === type.id
                            ? "bg-blue-100"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 ${
                            formData.tipoResiduo === type.id
                              ? "text-blue-600"
                              : type.color
                          }`}
                        />
                      </div>
                      <h3 className="font-medium text-sm">{type.nome}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {type.descricao}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg) *</Label>
              <Input
                id="peso"
                name="peso"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.peso || ""}
                onChange={handleNumberChange}
                placeholder="Ex: 2.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min="0"
                  value={formData.quantidade || ""}
                  onChange={handleNumberChange}
                  placeholder="Ex: 5"
                />
                <Select
                  value={formData.unidade}
                  onValueChange={(value: "kg" | "unidades" | "litros") =>
                    setFormData({ ...formData, unidade: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="unidades">unidades</SelectItem>
                    <SelectItem value="litros">litros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Condição do Resíduo</Label>
            <RadioGroup
              value={formData.condicao}
              onValueChange={(value: "novo" | "usado" | "danificado") =>
                setFormData({ ...formData, condicao: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="novo" id="novo" />
                <Label htmlFor="novo">Novo (sem uso)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="usado" id="usado" />
                <Label htmlFor="usado">Usado (boas condições)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="danificado" id="danificado" />
                <Label htmlFor="danificado">Danificado (precisa reparo)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Embalagem (opcional)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Saco plástico",
                "Caixa de papelão",
                "Embalagem original",
                "Sem embalagem",
              ].map((embalagem) => (
                <div key={embalagem} className="flex items-center space-x-2">
                  <Checkbox
                    id={embalagem}
                    checked={formData.embalagem.includes(embalagem)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked as boolean, embalagem)
                    }
                  />
                  <Label htmlFor={embalagem}>{embalagem}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dataDescarte">Data de Descarte *</Label>
              <Input
                id="dataDescarte"
                name="dataDescarte"
                type="date"
                min={today}
                value={formData.dataDescarte}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaDescarte">Horário Preferido (opcional)</Label>
              <Input
                id="horaDescarte"
                name="horaDescarte"
                type="time"
                value={formData.horaDescarte}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricaoAdicional">
              Descrição Adicional (opcional)
            </Label>
            <Textarea
              id="descricaoAdicional"
              name="descricaoAdicional"
              value={formData.descricaoAdicional}
              onChange={handleInputChange}
              placeholder="Informações adicionais sobre o resíduo..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Fotos do Resíduo (opcional, máx. 5)
            </Label>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-20 border-dashed"
                disabled={selectedImages.length >= 5}
              >
                <Upload className="mr-2 h-4 w-4" />
                {selectedImages.length >= 5
                  ? "Máximo de 5 imagens atingido"
                  : "Clique para adicionar fotos (otimização automática)"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              {selectedImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedImages.length}/5 imagem(ns) selecionada(s) -
                    Otimização automática aplicada
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative w-full h-24">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit">Próximo: Endereço</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
