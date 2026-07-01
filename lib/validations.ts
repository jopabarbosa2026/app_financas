import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().trim().min(1, "Informe uma descrição").max(200),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  date: z.string().min(1, "Informe a data"),
  type: z.enum(["receita", "despesa"]),
  category_id: z.string().uuid("Selecione uma categoria"),
});

export type TransactionFormValues = z.input<typeof transactionSchema>;
export type TransactionInput = z.output<typeof transactionSchema>;
