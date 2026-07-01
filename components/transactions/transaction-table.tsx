"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { deleteTransaction } from "@/lib/actions/transactions";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Category, Transaction } from "@/lib/types";

export function TransactionTable({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Transação excluída.");
      }
      setDeletingId(null);
    });
  }

  if (transactions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada para os filtros selecionados.
      </p>
    );
  }

  return (
    <>
      {/* Desktop/tablet: tabela completa */}
      <div className="hidden overflow-x-auto rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>{t.categories?.name ?? "-"}</TableCell>
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell>
                  <Badge variant={t.type === "receita" ? "default" : "destructive"}>
                    {t.type === "receita" ? "Receita" : "Despesa"}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    t.type === "receita" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {t.type === "receita" ? "+" : "-"} {formatCurrency(Number(t.amount))}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <TransactionForm
                      categories={categories}
                      transaction={t}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Editar">
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir"
                      onClick={() => setDeletingId(t.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: lista de cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {transactions.map((t) => (
          <div key={t.id} className="flex flex-col gap-2 rounded-md border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-medium">{t.description}</span>
                <span className="text-sm text-muted-foreground">
                  {t.categories?.name ?? "-"} · {formatDate(t.date)}
                </span>
              </div>
              <span
                className={`shrink-0 font-medium ${
                  t.type === "receita" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {t.type === "receita" ? "+" : "-"} {formatCurrency(Number(t.amount))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={t.type === "receita" ? "default" : "destructive"}>
                {t.type === "receita" ? "Receita" : "Despesa"}
              </Badge>
              <div className="flex gap-1">
                <TransactionForm
                  categories={categories}
                  transaction={t}
                  trigger={
                    <Button variant="ghost" size="icon" aria-label="Editar">
                      <Pencil className="size-4" />
                    </Button>
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Excluir"
                  onClick={() => setDeletingId(t.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deletingId !== null} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. A transação será excluída permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              {isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
