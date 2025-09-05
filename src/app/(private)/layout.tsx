"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarComponent } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/theme/mode-toggle";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/context/theme-provider";
import { FormProvider, useForm } from "react-hook-form";
import { useAutoTokenValidation } from "@/hooks/use-token-validation";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isValid: isAuthenticated, isLoading: authLoading } = useAutoTokenValidation();
  const router = useRouter();
  const form = useForm();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated === false) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (!mounted) {
    return null;
  }

  // Loading da autenticação
  if (authLoading) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Se não autenticado, não renderizar (vai redirecionar)
  if (isAuthenticated === false) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <SidebarComponent />
        <main className="w-screen">
          <div className="flex gap-3 items-center pt-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ModeToggle />
          </div>
          <FormProvider {...form}>{children}</FormProvider>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
