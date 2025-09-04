"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchWrapper } from "@/lib/fetch-wrapper";
import { AccessType, AuthCoxtextData, RegisterType } from "@/types/auth-type";

const AuthContext = createContext<AuthCoxtextData | undefined>(undefined);

export const useAuth = (): AuthCoxtextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();

  const signIn = async (user: AccessType): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        return false;
      }

      console.log("Login realizado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const signUp = async (user: RegisterType): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Falha no registro");
      }

      console.log("Registro realizado com sucesso");
      router.push("/login");
      return true;
    } catch (error) {
      console.error("Erro ao fazer registro:", error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth", {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });

      if (!response.ok) {
        throw new Error("Falha no logout");
      }

      console.log("Logout realizado com sucesso");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/login");
    }
  };

  const value: AuthCoxtextData = {
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
