"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FormProvider } from "react-hook-form";

const registerSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "O nome é obrigatório" })
    .min(2, { message: "O nome deve ter no mínimo 2 caracteres" }),
  email: z
    .string()
    .nonempty({ message: "O e-mail é obrigatório" })
    .email({ message: "E-mail inválido" }),
  password: z
    .string()
    .nonempty({ message: "A senha é obrigatória" })
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onToggle: () => void;
}

export default function RegisterFormSimple({ onToggle }: RegisterFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Conta criada com sucesso!", {
          description: "Redirecionando para o login...",
          duration: 2000,
        });

        form.reset(); 

        setTimeout(() => {
          onToggle();
        }, 2000);
      } else {
        toast.error("Erro ao criar conta", {
          description: result.error || "Tente novamente mais tarde",
        });
      }
    } catch (error) {
      toast.error("Erro de conexão", {
        description: "Verifique sua conexão e tente novamente",
      });
      console.error("Erro durante o registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <header>
        <h1 className="font-medium text-3xl">Crie sua conta</h1>
        <p className="font-normal text-base mt-3 mb-12">
          Junte-se a nós para um futuro mais sustentável.
        </p>
      </header>

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite seu nome"
                    startIcon={User}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@exemplo.com"
                    autoComplete="email"
                    startIcon={Mail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informe sua senha"
                    startIcon={Lock}
                    type={isVisible ? "text" : "password"}
                    buttonIcon={
                      <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                      >
                        {isVisible ? (
                          <Eye className="text-muted-foreground" size={20} />
                        ) : (
                          <EyeOff className="text-muted-foreground" size={20} />
                        )}
                      </button>
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Criando conta..." : "Cadastrar"}
          </Button>

          <span className="flex justify-center">
            <h1 className="mt-4">
              Já possui uma conta?{" "}
              <button
                type="button"
                className="text-green-800 font-bold"
                onClick={onToggle}
              >
                Faça login
              </button>
            </h1>
          </span>
        </form>
      </FormProvider>
    </div>
  );
}
