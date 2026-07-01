import type { Transaction } from "@/lib/types";

function escapeCsvField(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = ["Descrição", "Categoria", "Data", "Tipo", "Valor"];
  const rows = transactions.map((t) => [
    t.description,
    t.categories?.name ?? "",
    t.date,
    t.type === "receita" ? "Receita" : "Despesa",
    t.amount.toString().replace(".", ","),
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n");
}

export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
