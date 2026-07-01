import { Plus } from "lucide-react";
import { getCategories, getTransactions } from "@/lib/actions/transactions";
import { Button } from "@/components/ui/button";
import { FiltersBar } from "@/components/transactions/filters-bar";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { ExportCsvButton } from "@/components/transactions/export-csv-button";

export default async function TransacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; categoria?: string; busca?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month) || now.getMonth() + 1;
  const year = Number(params.year) || now.getFullYear();

  const [categories, transactions] = await Promise.all([
    getCategories(),
    getTransactions({
      month,
      year,
      categoryId: params.categoria,
      search: params.busca,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
        <div className="flex gap-2">
          <ExportCsvButton transactions={transactions} />
          <TransactionForm
            categories={categories}
            trigger={
              <Button>
                <Plus className="size-4" />
                Nova transação
              </Button>
            }
          />
        </div>
      </div>

      <FiltersBar
        month={month}
        year={year}
        categories={categories}
        categoryId={params.categoria}
        search={params.busca}
      />

      <TransactionTable transactions={transactions} categories={categories} />
    </div>
  );
}
