"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: AuthState = { error: null };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>Comece a organizar suas finanças em minutos.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="voce@email.com" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state.message && (
            <p className="text-sm text-emerald-600">{state.message}</p>
          )}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
