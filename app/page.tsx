import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Filter,
  ShieldCheck,
  Smartphone,
  Download,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Controle total",
    description: "Registre receitas e despesas em segundos e categorize cada transação.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Dashboard visual",
    description: "Veja o resumo do mês e a distribuição de gastos por categoria em gráficos.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    icon: Filter,
    title: "Filtros e busca",
    description: "Encontre qualquer transação por período, categoria ou descrição.",
    color: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  },
  {
    icon: Download,
    title: "Exportação em CSV",
    description: "Baixe seus dados filtrados para usar em planilhas ou relatórios.",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados, só seus",
    description: "Autenticação segura e cada conta só acessa as próprias transações.",
    color: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  },
  {
    icon: Smartphone,
    title: "Funciona em qualquer tela",
    description: "Layout responsivo para usar no computador ou no celular.",
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">Meu Financeiro</span>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
            Entrar
          </Button>
          <Button nativeButton={false} render={<Link href="/signup" />}>
            Criar conta grátis
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Organize suas finanças pessoais em um só lugar
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Registre receitas e despesas, acompanhe seu saldo mensal e entenda para onde vai
            seu dinheiro com um dashboard simples e visual.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
              Começar agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Já tenho conta
            </Button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color }) => (
              <Card key={title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className={`mb-2 flex size-11 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
        Meu Financeiro — projeto de estudo, construído com Next.js e Supabase.
      </footer>
    </div>
  );
}
