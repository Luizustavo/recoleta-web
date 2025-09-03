"use client";

import { useState } from "react";
//import TypeWasteForm from "@/components/forms/discard/discard-type-waste-form";
//import SummaryRegistration from "@/components/forms/summary-registration-collection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import  AddressListForm  from "@/components/features/discard/address-form/components/address-list-form";

export default function WasteRegister() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  /* const handleSubmit = () => {
    console.log("Formulário submetido com sucesso");
    // Lógica adicional de submissão
  }; */

  return (
    <div className="max-w-full mx-auto">
      <Breadcrumb className="py-2">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="dashboard">Gerenciar Coletas </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="collect">Descartar Resíduos</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>{" "}
      {step === 1 && (
        <AddressListForm  />
      )}
      {/*       {step === 2 && <AddressForm nextStep={nextStep} prevStep={prevStep} />}
       */}{" "}
      {/* {step === 3 && (
        <SummaryRegistration prevStep={prevStep} handleSubmit={handleSubmit} />
      )} */}
    </div>
  );
}
