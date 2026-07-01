import { getTransactions } from "@/lib/actions/transactions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryPieChart, type CategorySlice } from "@/components/dashboard/category-pie-chart";
import { PeriodSelect } from "@/components/shared/period-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month) || now.getMonth() + 1;
  const year = Number(params.year) || now.getFullYear();

  const transactions = await getTransactions({ month, year });

  const totalReceitas = transactions
    .filter((t) => t.type === "receita")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalDespesas = transactions
    .filter((t) => t.type === "despesa")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const despesasPorCategoria = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "despesa") continue;
    const name = t.categories?.name ?? "Outros";
    despesasPorCategoria.set(name, (despesasPorCategoria.get(name) ?? 0) + Number(t.amount));
  }
  const categoryData: CategorySlice[] = Array.from(despesasPorCategoria, ([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <PeriodSelect month={month} year={year} />
      </div>

      <SummaryCards totalReceitas={totalReceitas} totalDespesas={totalDespesas} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryPieChart data={categoryData} />
        </CardContent>
      </Card>
    </div>
  );
}
