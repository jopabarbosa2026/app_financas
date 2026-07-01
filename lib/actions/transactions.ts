"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { transactionSchema, type TransactionInput } from "@/lib/validations";
import type { Category, Transaction } from "@/lib/types";

export type TransactionFilters = {
  month: number; // 1-12
  year: number;
  categoryId?: string;
  search?: string;
};

function monthRange(month: number, year: number) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type")
    .order("name");

  if (error) throw new Error(error.message);
  return data;
}

export async function getTransactions(filters: TransactionFilters): Promise<Transaction[]> {
  const supabase = await createClient();
  const { start, end } = monthRange(filters.month, filters.year);

  let query = supabase
    .from("transactions")
    .select("*, categories(id, name)")
    .gte("date", start)
    .lt("date", end)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.search) {
    query = query.ilike("description", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as unknown as Transaction[];
}

export type ActionResult = { error: string | null };

export async function createTransaction(input: TransactionInput): Promise<ActionResult> {
  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("transactions").insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
  return { error: null };
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<ActionResult> {
  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
  return { error: null };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/transacoes");
  return { error: null };
}
