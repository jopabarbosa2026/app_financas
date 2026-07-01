"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, ArrowLeftRight, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === href
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </>
  );
}

export function AppNav({ userEmail }: { userEmail: string }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Wallet className="size-5" />
            <span className="hidden sm:inline">Meu Financeiro</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">{userEmail}</span>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" className="gap-2">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </form>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="size-4" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-64">
              <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
              <nav className="flex flex-col gap-1 p-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
