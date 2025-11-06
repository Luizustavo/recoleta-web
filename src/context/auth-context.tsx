"use client";

import { signIn as nextAuthSignIn } from "next-auth/react";
import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AccessType, AuthContextData, RegisterType } from "@/types/auth-type";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const useAuth = (): AuthContextData => {
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
          Pragma: "no-cache",
          Expires: "0",
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

  // --- NEW: Google Login ---
  const signInWithGoogle = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Falha na autenticação com Google!");

      const data = await response.json();
      console.log("Google login response:", data);
      // Trigger NextAuth Google OAuth flow
      await nextAuthSignIn("google", {
        callbackUrl: "/dashboard", // redirect after successful login
      });

      // No need to handle token manually; NextAuth sets session cookies
      console.log("Google sign-in triggered");
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  };

  // --- NEW: Facebook Login ---
  const signInWithFacebook = async () => {
    try {
      const response = await fetch("/api/auth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Falha na autenticação com Facebook");

      const data = await response.json();
      console.log("Facebook login response:", data);

      localStorage.setItem("token", data.access_token);

      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Erro no login com Facebook:", error);
      return false;
    }
  };

  const value: AuthContextData = {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
