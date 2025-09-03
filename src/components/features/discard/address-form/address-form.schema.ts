import * as z from "zod";

export const schema = z.object({
  zipCode: z.string().min(1, { message: "CEP é obrigatório" }),
  street: z.string().min(1, { message: "Rua é obrigatória" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  uf: z.string().min(1, { message: "UF é obrigatória" }),
  complement: z.string().optional(),
});

export type Schema = z.infer<typeof schema>;
