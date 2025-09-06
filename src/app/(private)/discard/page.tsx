"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import WasteForm from "@/components/features/discard/waste-form";
import AddressForm from "@/components/features/discard/address-form";
import SummaryForm from "@/components/features/discard/summary-form";
import { WasteFormData } from "@/components/features/discard/waste-form/types";
import { AddressData } from "@/components/features/discard/address-form/types";
import { SummaryData } from "@/components/features/discard/summary-form/types";
import { WasteService } from "@/lib/waste-service";

export default function WasteRegister() {
  const [step, setStep] = useState(1);
  const [wasteData, setWasteData] = useState<WasteFormData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleWasteSubmit = (data: WasteFormData) => {
    setWasteData(data);
    nextStep();
  };

  const handleAddressSubmit = (data: AddressData) => {
    setAddressData(data);
    nextStep();
  };

  const handleFinalSubmit = async () => {
    if (!wasteData || !addressData) {
      console.error("Dados incompletos para submissão");
      toast.error("Dados incompletos", {
        description: "Erro interno: dados incompletos para submissão.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        waste: wasteData,
        address: addressData,
      };

      console.log("Enviando dados para a API:", submissionData);

      toast.loading("Enviando dados...", {
        description: "Processando seu agendamento de descarte.",
      });

      const result = await WasteService.submitWaste(submissionData);

      console.log("Descarte cadastrado com sucesso:", result);

      toast.dismiss();
      toast.success("🎉 Descarte agendado com sucesso!", {
        description: `ID: ${result.id} • Data: ${new Date(
          result.discardDate
        ).toLocaleDateString("pt-BR")}`,
        duration: 8000,
      });

      setStep(1);
      setWasteData(null);
      setAddressData(null);
    } catch (error) {
      console.error("Erro ao submeter descarte:", error);

      toast.dismiss();

      let errorMessage = "Erro desconhecido ao agendar descarte.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("Token de autenticação não encontrado")) {
        toast.error("Sessão expirada", {
          description: "Faça login novamente para continuar.",
          action: {
            label: "Fazer Login",
            onClick: () => (window.location.href = "/login"),
          },
        });
      } else if (errorMessage.includes("401")) {
        toast.error("Não autorizado", {
          description: "Faça login novamente para continuar.",
          action: {
            label: "Fazer Login",
            onClick: () => (window.location.href = "/login"),
          },
        });
      } else if (errorMessage.includes("400")) {
        toast.error("Dados inválidos", {
          description: "Verifique as informações e tente novamente.",
        });
      } else if (errorMessage.includes("500")) {
        toast.error("Erro interno do servidor", {
          description: "Tente novamente em alguns minutos.",
        });
      } else {
        toast.error("Erro ao agendar descarte", {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryData: SummaryData | null =
    wasteData && addressData
      ? {
          waste: wasteData,
          address: addressData,
        }
      : null;

  return (
    <div className="max-w-full mx-auto">
      <Breadcrumb className="py-2">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="dashboard">Gerenciar Coletas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="collect">Descartar Resíduos</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-6">
        {step === 1 && (
          <WasteForm onNext={handleWasteSubmit} initialData={wasteData} />
        )}

        {step === 2 && (
          <AddressForm
            nextStep={handleAddressSubmit}
            prevStep={prevStep}
            initialData={addressData}
          />
        )}

        {step === 3 && summaryData && (
          <SummaryForm
            prevStep={prevStep}
            handleSubmit={handleFinalSubmit}
            summaryData={summaryData}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
