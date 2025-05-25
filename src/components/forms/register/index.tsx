import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

interface RegisterFormProps {
  onToggle: () => void;
}

const schema = z.object({
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
  userType: z.enum(["collector", "generator"]),
});

type Schema = z.infer<typeof schema>;

const ENUM = [
  { label: "Coletor de resíduos", value: "collector" },
  { label: "Gerador de resíduos", value: "generator" },
];

export default function RegisterForm({ onToggle }: RegisterFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = form;

  async function onSubmit() {
    console.log("Register");
  }

  return (
    <div className="flex flex-col">
      <header>
        <h1 className="font-medium text-3xl">Crie sua conta</h1>
        <p className="font-normal text-base mt-3 mb-12">
          Junte-se a nós para um futuro mais sustentável.
        </p>
      </header>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" startIcon={User} {...field} />
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
                    placeholder="email@example.com"
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
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de usuário</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipos</SelectLabel>
                        {ENUM.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="default"
            className="mt-2"

            //onClick={handleRegister}
          >
            Cadastrar
          </Button>
          <span className="flex justify-center">
            <h1 className="mt-4">
              Já possui uma conta?{" "}
              <button className="text-green-800 font-bold" onClick={onToggle}>
                Faça login
              </button>
            </h1>
          </span>
        </form>
      </FormProvider>
    </div>
  );
}
