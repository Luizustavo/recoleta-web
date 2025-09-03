"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarComponent } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/theme/mode-toggle";
import { AuthProvider } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/context/theme-provider";
import { FormProvider, useForm } from "react-hook-form";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const form = useForm();
  useEffect(() => {
    setMounted(true);
  }, []);

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
        <AuthProvider>
          <SidebarComponent />
          <main className="w-screen">
            <div className="flex gap-3 items-center pt-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <ModeToggle />
            </div>
            <FormProvider {...form}>{children}</FormProvider>
          </main>
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
