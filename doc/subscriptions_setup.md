# Configuración de Suscripciones con Stripe

Este documento explica cómo configurar el sistema de suscripciones de pago con Stripe.

## 1. Crear cuenta en Stripe

1. Ve a [https://stripe.com](https://stripe.com)
2. Crea una cuenta o inicia sesión
3. Completa la configuración de tu cuenta

## 2. Obtener las claves de API

1. En el dashboard de Stripe, ve a **Developers** > **API keys**
2. Copia las siguientes claves:
   - **Publishable key** (empieza con `pk_`)
   - **Secret key** (empieza con `sk_`)

## 3. Crear productos y precios en Stripe

1. Ve a **Products** en el dashboard de Stripe
2. Crea 3 productos:
   - **Básico** - $9.99/mes
   - **Profesional** - $29.99/mes
   - **Empresarial** - $99.99/mes

3. Para cada producto:
   - Crea un precio recurrente (mensual)
   - Copia el **Price ID** (empieza con `price_`)

## 4. Configurar variables de entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (reemplaza con los IDs reales de Stripe)
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# URL de la aplicación (para producción, usa tu dominio)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Crear tabla de suscripciones en Supabase

Ejecuta este script SQL en el SQL Editor de Supabase:

```sql
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
```

## 6. Configurar Webhook en Stripe

1. Ve a **Developers** > **Webhooks** en Stripe
2. Haz clic en **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/webhooks/stripe`
   - Para desarrollo local, usa [Stripe CLI](https://stripe.com/docs/stripe-cli) para hacer forwarding
4. Selecciona los siguientes eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copia el **Signing secret** (empieza con `whsec_`) y agrégalo a `.env.local`

## 7. Testing con Stripe CLI (Desarrollo Local)

Para probar webhooks localmente:

```bash
# Instalar Stripe CLI
# Windows: choco install stripe-cli
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Esto te dará un webhook secret que puedes usar en desarrollo.

## 8. Habilitar Row Level Security (RLS) en Supabase

Ejecuta este script para que los usuarios solo puedan ver sus propias suscripciones:

```sql
-- Habilitar RLS
alter table subscriptions enable row level security;

-- Política para que los usuarios vean solo sus suscripciones
create policy "Users can view their own subscriptions"
  on subscriptions
  for select
  using (auth.uid() = user_id);

-- Política para que el sistema pueda insertar/actualizar (usando service_role)
-- Esta se maneja desde el backend con service_role key
```

## Notas Importantes

- En producción, usa las claves **live** de Stripe (no las de test)
- Asegúrate de configurar correctamente la URL del webhook en producción
- El webhook debe ser HTTPS en producción
- Revisa los logs de Stripe para debugging

## Troubleshooting

- Si los webhooks no funcionan, verifica que la URL sea correcta y accesible
- Asegúrate de que el webhook secret coincida
- Revisa los logs en Stripe Dashboard > Webhooks para ver errores


