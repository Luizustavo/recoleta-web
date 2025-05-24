"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const schema = z.object({
  email: z
    .string()
    .nonempty({ message: "O e-mail é obrigatório" })
    .email({ message: "E-mail inválido" }),
  password: z
    .string()
    .nonempty({ message: "A senha é obrigatória" })
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

type Schema = z.infer<typeof schema>;

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = form;

  async function onSubmit() {
    console.log("Login");
  }

  return (
    <div className="flex flex-col">
      <header>
        <h1 className="font-medium text-3xl">Bem-vindo de volta!</h1>
        <p className="font-normal text-base mt-3 mb-12">
          Conecte-se para contribuir com um futuro mais sustentável.
        </p>
      </header>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-8"
        >
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
                          <Eye className="text-muted-foreground" size={18} />
                        ) : (
                          <EyeOff className="text-muted-foreground" size={18} />
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
          <Button type="submit">Login</Button>
          <span className="flex items-center justify-center gap-4">
            <hr className="w-full border-t border-gray-300" />
            <span className="text-gray-500">ou</span>
            <hr className="w-full border-t border-gray-300" />
          </span>
          <section className="flex gap-10 justify-center">
            <div>
              <Button
                type="button"
                variant="outline"
                className="flex gap-3 text-sm"
                /*  onClick={() => signIn("google", { callbackUrl: "/dashboard" })} */
              >
                <Image
                  src="/images/icon-google.svg"
                  alt="icon-google"
                  width={20}
                  height={20}
                />
                Entrar com Google
              </Button>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                className="flex gap-3 text-sm"
                /*   onClick={() =>
                  signIn("facebook", { callbackUrl: "/dashboard" })
                } */
              >
                <Image
                  src="/images/icon-facebook.svg"
                  alt="icon-facebook"
                  width={20}
                  height={20}
                />
                Entrar com Facebook
              </Button>
            </div>
          </section>
          <span className="flex justify-center">
            <h1 className="mt-4">
              Não possui uma conta?{" "}
              <button
                className="text-green-800 font-bold"
                /*                 onClick={() => setIsLoginComponent(false)}
                 */
              >
                Cadastre-se
              </button>
            </h1>
          </span>
        </form>
      </FormProvider>
    </div>
  );
}
