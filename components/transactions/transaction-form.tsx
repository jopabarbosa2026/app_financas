"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction, updateTransaction } from "@/lib/actions/transactions";
import {
  transactionSchema,
  type TransactionFormValues,
  type TransactionInput,
} from "@/lib/validations";
import type { Category, Transaction } from "@/lib/types";

export function TransactionForm({
  categories,
  transaction,
  trigger,
}: {
  categories: Category[];
  transaction?: Transaction;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(transaction);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues, unknown, TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? undefined,
      date: transaction?.date ?? new Date().toISOString().slice(0, 10),
      type: transaction?.type ?? "despesa",
      category_id: transaction?.category_id ?? "",
    },
  });

  const type = watch("type");
  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === "ambos",
  );

  async function onSubmit(data: TransactionInput) {
    const result = isEditing
      ? await updateTransaction(transaction!.id, data)
      : await createTransaction(data);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(isEditing ? "Transação atualizada." : "Transação criada.");
    setOpen(false);
    if (!isEditing) {
      reset({
        description: "",
        amount: undefined,
        date: new Date().toISOString().slice(0, 10),
        type: "despesa",
        category_id: "",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar transação" : "Nova transação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" type="number" step="0.01" min="0" {...register("amount")} />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Tipo</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  setValue("type", v as TransactionInput["type"]);
                  setValue("category_id", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Categoria</Label>
              <Select
                value={watch("category_id")}
                onValueChange={(v) => setValue("category_id", v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
