"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { WasteResponse } from "@/lib/waste-service";

interface WasteUserCardProps {
  waste: WasteResponse;
}

export function WasteUserCard({ waste }: WasteUserCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4" />
          Informações do Solicitante
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Nome</div>
            <div className="text-sm">{waste.user.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div className="text-sm">{waste.user.email}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
