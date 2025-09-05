"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface WastePageHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export function WastePageHeader({ onRefresh, refreshing }: WastePageHeaderProps) {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Meus Descartes</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Meus Descartes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os seus descartes de resíduos cadastrados
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          
          <Button asChild className="flex items-center gap-2">
            <Link href="/discard">
              <Plus className="h-4 w-4" />
              Novo Descarte
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
