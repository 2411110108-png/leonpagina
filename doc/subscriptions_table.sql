-- Tabla de suscripciones
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  plan text not null check (plan in ('basic', 'professional', 'enterprise')),
  status text not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Índices para mejorar el rendimiento
create index idx_subscriptions_user_id on subscriptions(user_id);
create index idx_subscriptions_stripe_subscription_id on subscriptions(stripe_subscription_id);
create index idx_subscriptions_status on subscriptions(status);

-- Trigger para actualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row
  execute function update_updated_at_column();

-- Habilitar RLS
alter table subscriptions enable row level security;

-- Política para que los usuarios vean solo sus suscripciones
create policy "Users can view their own subscriptions"
  on subscriptions
  for select
  using (auth.uid() = user_id);


