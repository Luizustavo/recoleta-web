"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { WasteResponse } from "@/lib/waste-service";

interface WasteScheduleCardProps {
  waste: WasteResponse;
}

export function WasteScheduleCard({ waste }: WasteScheduleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Data</div>
            <div className="text-sm">{formatDate(waste.discardDate)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Horário</div>
            <div className="text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {waste.discardTime}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
