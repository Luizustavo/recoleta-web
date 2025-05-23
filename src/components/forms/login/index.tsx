"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({
    message: "E-mail inválido",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres",
  }),
});

type Schema = z.infer<typeof schema>;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = form;

  async function onSubmit() {
    console.log("Login");
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}></form>
    </FormProvider>
  );
}
