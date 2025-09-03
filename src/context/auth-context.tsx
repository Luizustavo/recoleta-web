"use client";

import { fetchWrapper } from "@/lib/fetch-wrapper";
import {
  AuthProps,
  AccessType,
  AuthCoxtextData,
  AccessResultType,
} from "@/types/auth-type";
import { createContext, useContext } from "react";
import { api } from "@/lib/auth-data";

const AuthContext = createContext({} as AuthCoxtextData);

function AuthProvider({ children }: AuthProps) {
  async function signIn(user: AccessType) {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      const { ok } = await fetchWrapper<AccessResultType>(
        "/api/auth",
        {
          method: "POST",
          body: JSON.stringify(user),
        },
        false
      );

      if (!ok) {
        console.log("Usuário ou senha incorretos");
        return false;
      }
      return true;
      //eslint-disable-next-line
    } catch (error) {
      console.log("Usuário ou senha incorretos");
      return false;
    }
  }

  async function signOut() {
    await api("/api/auth", {
      method: "DELETE",
    });
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
const useAuth = (): AuthCoxtextData => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
