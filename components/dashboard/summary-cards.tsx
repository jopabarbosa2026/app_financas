import { ArrowDownCircle, ArrowUpCircle, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SummaryCards({
  totalReceitas,
  totalDespesas,
}: {
  totalReceitas: number;
  totalDespesas: number;
}) {
  const saldo = totalReceitas - totalDespesas;

  const cards = [
    {
      title: "Receita Total",
      value: totalReceitas,
      icon: ArrowUpCircle,
      className: "text-emerald-600",
    },
    {
      title: "Despesa Total",
      value: totalDespesas,
      icon: ArrowDownCircle,
      className: "text-red-600",
    },
    {
      title: "Saldo",
      value: saldo,
      icon: Scale,
      className: saldo >= 0 ? "text-emerald-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(({ title, value, icon: Icon, className }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <Icon className={cn("size-5", className)} />
          </CardHeader>
          <CardContent>
            <p className={cn("text-2xl font-semibold", className)}>
              {formatCurrency(value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
