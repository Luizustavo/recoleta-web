"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, User, Weight, Package, Loader2, MessageSquare, Navigation } from "lucide-react";
import { AvailableWasteResponse } from "../types";
import { wasteTypes } from "../../discard/waste-form/utils";
import { formatDate } from "../../discard/summary-form/utils";

interface WasteCardProps {
  waste: AvailableWasteResponse;
  onRequestCollection: (wasteId: string, data?: { message?: string }) => Promise<{ success: boolean; message: string }>;
  isCollecting: boolean;
}

// Mapeamento de tipos da API para os tipos do frontend
const wasteTypeMapping: Record<string, string> = {
  'PLASTIC': 'plasticos',
  'ELECTRONICS': 'eletronicos', 
  'PAPER': 'papel',
  'GLASS': 'vidros',
  'METAL': 'metais',
  'ORGANIC': 'organicos',
  'DANGEROUS': 'perigosos',
  'TEXTILE': 'texteis',
  'MIXED': 'mistos'
};

export default function WasteCard({ 
  waste, 
  onRequestCollection, 
  isCollecting 
}: WasteCardProps) {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const frontendWasteType = wasteTypeMapping[waste.wasteType] || 'mistos';
  const wasteType = wasteTypes.find(type => type.id === frontendWasteType);
  const IconComponent = wasteType?.icon || Package;

  const handleCollect = async () => {
    try {
      if (showMessageForm) {
        await onRequestCollection(waste.id, { message: message.trim() || undefined });
        setMessage("");
        setShowMessageForm(false);
      } else {
        setShowMessageForm(true);
      }
    } catch (error) {
      console.error("Erro ao solicitar coleta:", error);
    }
  };

  const handleQuickCollect = async () => {
    try {
      await onRequestCollection(waste.id);
    } catch (error) {
      console.error("Erro ao solicitar coleta:", error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-4">
        {/* Tipo de Resíduo */}
        <div className="flex items-center gap-3">
          <IconComponent className={`h-8 w-8 ${wasteType?.color || 'text-gray-600'}`} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{wasteType?.nome || waste.wasteType}</h3>
            <p className="text-sm text-muted-foreground">{wasteType?.descricao}</p>
          </div>
          {waste.distance && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Navigation className="h-4 w-4" />
              <span>{waste.distance.toFixed(1)}km</span>
            </div>
          )}
        </div>

        {/* Informações do usuário */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{waste.user.name}</p>
            <p className="text-xs text-muted-foreground">{waste.user.email}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Detalhes do resíduo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{waste.weight} kg</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{waste.quantity} unid.</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{waste.condition}</Badge>
          <Badge variant="outline" className="capitalize">
            {waste.status.toLowerCase().replace('_', ' ')}
          </Badge>
        </div>

        {waste.additionalDescription && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Descrição:</p>
            <p className="text-sm">{waste.additionalDescription}</p>
          </div>
        )}

        {/* Endereço */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Localização</span>
          </div>
          <div className="pl-6 space-y-1">
            <p className="text-sm">{waste.address.street}</p>
            <p className="text-sm text-muted-foreground">
              {waste.address.city}/{waste.address.state}
            </p>
          </div>
        </div>

        {/* Agendamento */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(waste.discardDate)}</span>
            </div>
          </div>
        </div>

        {/* Imagens */}
        {waste.images && waste.images.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Fotos ({waste.images.length})
            </p>
            <div className="grid grid-cols-4 gap-2">
              {waste.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-16 object-cover rounded border"
                />
              ))}
              {waste.images.length > 4 && (
                <div className="w-full h-16 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{waste.images.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Formulário de mensagem */}
        {showMessageForm && (
          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="collection-message">Mensagem (opcional)</Label>
            <Textarea
              id="collection-message"
              placeholder="Ex: Posso coletar hoje à tarde. Tenho experiência com reciclagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="space-y-2">
        {!showMessageForm ? (
          <div className="flex gap-2 w-full">
            <Button 
              onClick={handleQuickCollect} 
              disabled={isCollecting}
              variant="outline"
              className="flex-1"
            >
              {isCollecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Solicitando...
                </>
              ) : (
                "Coleta Rápida"
              )}
            </Button>
            <Button 
              onClick={handleCollect} 
              disabled={isCollecting}
              className="flex-1"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Com Mensagem
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              onClick={() => setShowMessageForm(false)} 
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCollect} 
              disabled={isCollecting}
              className="flex-1"
            >
              {isCollecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Solicitar Coleta"
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
