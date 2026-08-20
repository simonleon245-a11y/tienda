-- Esquema de Supabase para las suscripciones Premium de Recos Diarias.
-- Cómo aplicarlo: en el dashboard de Supabase, ve a "SQL Editor" -> "New
-- query", pega todo este archivo y dale "Run". Solo hay que hacerlo una vez.
--
-- Nada de esto se toca desde el navegador del usuario ni desde la app con
-- la "anon key" -- Row Level Security (RLS) está activado y sin ninguna
-- política pública, así que solo el backend (con la "service_role key",
-- que nunca sale del servidor) puede leer o escribir aquí.

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  plan text not null check (plan in ('monthly', 'annual')),
  status text not null default 'pending' check (status in ('pending', 'active', 'past_due', 'canceled')),
  payment_source_id bigint,
  amount_in_cents bigint not null,
  currency text not null default 'COP',
  next_charge_at timestamptz,
  -- Token único que se le entrega a la persona en la pantalla de
  -- confirmación (y por correo si en el futuro se agrega envío de
  -- correos) para que pueda cancelar sin necesitar una cuenta/login.
  cancel_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscribers_status_next_charge_idx
  on subscribers (status, next_charge_at)
  where status in ('active', 'past_due');

-- Historial de cada intento de cobro (para poder responder preguntas de
-- soporte tipo "¿por qué no me cobró este mes?" sin adivinar).
create table if not exists subscriber_transactions (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  wompi_transaction_id text,
  wompi_reference text not null,
  status text not null,
  amount_in_cents bigint not null,
  raw_event jsonb,
  created_at timestamptz not null default now()
);

create index if not exists subscriber_transactions_subscriber_idx
  on subscriber_transactions (subscriber_id, created_at desc);

alter table subscribers enable row level security;
alter table subscriber_transactions enable row level security;
-- A propósito, sin ninguna política "create policy ..." -- eso bloquea
-- por completo el acceso vía la anon key. Solo la service_role key
-- (usada exclusivamente en las funciones serverless de /api) puede
-- leer/escribir, porque esa key ignora RLS.

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists subscribers_set_updated_at on subscribers;
create trigger subscribers_set_updated_at
  before update on subscribers
  for each row
  execute function set_updated_at();
