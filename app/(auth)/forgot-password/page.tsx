"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "@/lib/actions/auth";
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

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Esqueceu a senha?</CardTitle>
        <CardDescription>
          Informe seu e-mail e enviaremos um link para você redefinir a senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="voce@email.com" required />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state.message && (
            <p className="text-sm text-emerald-600">{state.message}</p>
          )}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Lembrou a senha?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
