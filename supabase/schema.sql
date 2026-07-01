-- Schema do app de finanças pessoais
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase (supabase.com -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

-- Categorias (pré-definidas, leitura pública para qualquer usuário autenticado)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('receita', 'despesa', 'ambos')),
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "categories_select_authenticated" on public.categories;
create policy "categories_select_authenticated"
  on public.categories for select
  to authenticated
  using (true);

insert into public.categories (name, type) values
  ('Alimentação', 'despesa'),
  ('Transporte', 'despesa'),
  ('Moradia', 'despesa'),
  ('Lazer', 'despesa'),
  ('Saúde', 'despesa'),
  ('Educação', 'despesa'),
  ('Salário', 'receita'),
  ('Freelance', 'receita'),
  ('Outros', 'ambos')
on conflict (name) do nothing;

-- Transações
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null,
  type text not null check (type in ('receita', 'despesa')),
  category_id uuid not null references public.categories(id),
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_date_idx
  on public.transactions (user_id, date desc);

alter table public.transactions enable row level security;

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
  on public.transactions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
  on public.transactions for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own"
  on public.transactions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own"
  on public.transactions for delete
  to authenticated
  using (auth.uid() = user_id);
