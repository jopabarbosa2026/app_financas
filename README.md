# Meu Financeiro

App de gestão financeira pessoal: registre receitas e despesas, categorize, acompanhe um
dashboard mensal com gráficos e exporte seus dados em CSV.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Auth + Postgres) ·
Recharts

## Rodando localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard).
3. No **SQL Editor** do projeto, rode todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   Isso cria as tabelas `categories`/`transactions`, as políticas de RLS e as categorias padrão.
4. Copie `.env.local.example` para `.env.local` e preencha com as credenciais do seu projeto
   (Project Settings → API → Project URL / anon public key).
5. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse [http://localhost:3000](http://localhost:3000).

> Por padrão o Supabase exige confirmação de e-mail no cadastro. Para testes locais mais
> rápidos, você pode desativar isso em **Authentication → Sign In / Providers → Email →
> Confirm email** (reative antes de ir para produção com usuários reais).

## Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório do GitHub
   (`jopabarbosa2026/app_financas`).
2. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Clique em **Deploy**.
4. Depois do primeiro deploy, no painel do Supabase vá em **Authentication → URL Configuration**
   e adicione a URL da Vercel (ex: `https://seu-app.vercel.app`) em **Site URL** e
   **Redirect URLs**, para os links de confirmação de e-mail funcionarem em produção.
