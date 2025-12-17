# ✅ Checklist de Producción

Usa esta lista para asegurarte de que todo esté configurado correctamente antes de desplegar.

## 🔐 Supabase

- [ ] Tabla `doctor` creada
- [ ] Tabla `paciente` creada
- [ ] Tabla `citas` creada
- [ ] Tabla `subscriptions` creada (ejecutar `doc/subscriptions_table.sql`)
- [ ] RLS habilitado en todas las tablas
- [ ] Variables de entorno de Supabase (PRODUCCIÓN):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 💳 Stripe

- [ ] Cuenta de Stripe creada y verificada
- [ ] Modo LIVE activado en Stripe Dashboard
- [ ] 3 productos creados en modo LIVE:
  - [ ] Básico ($9.99/mes)
  - [ ] Profesional ($29.99/mes)
  - [ ] Empresarial ($99.99/mes)
- [ ] Price IDs copiados (empiezan con `price_`)
- [ ] API Keys de LIVE copiadas:
  - [ ] `STRIPE_SECRET_KEY` (empieza con `sk_live_`)
  - [ ] `STRIPE_PUBLISHABLE_KEY` (empieza con `pk_live_`)
- [ ] Webhook configurado:
  - [ ] URL: `https://tu-dominio.vercel.app/api/webhooks/stripe`
  - [ ] Eventos seleccionados:
    - [ ] `checkout.session.completed`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
  - [ ] `STRIPE_WEBHOOK_SECRET` copiado (empieza con `whsec_`)

## 🚀 Vercel

- [ ] Código subido a GitHub
- [ ] Proyecto conectado en Vercel
- [ ] Todas las variables de entorno configuradas:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `STRIPE_PRICE_BASIC`
  - [ ] `STRIPE_PRICE_PROFESSIONAL`
  - [ ] `STRIPE_PRICE_ENTERPRISE`
  - [ ] `NEXT_PUBLIC_APP_URL`
- [ ] Build exitoso en Vercel
- [ ] Dominio configurado (opcional)

## ✅ Testing

- [ ] Login funciona
- [ ] Signup funciona
- [ ] Dashboard se muestra correctamente
- [ ] Pricing page se muestra
- [ ] Checkout de Stripe funciona
- [ ] Webhook recibe eventos (verificar en Stripe Dashboard)
- [ ] Suscripción se guarda en Supabase después del pago

## 🔒 Seguridad

- [ ] `.env.local` NO está en GitHub
- [ ] Variables sensibles solo en Vercel
- [ ] RLS habilitado en Supabase
- [ ] Webhook secret configurado correctamente

## 📝 Notas

- Guarda todas las credenciales en un lugar seguro
- No compartas las claves secretas
- Revisa los logs en Vercel si hay problemas
- Monitorea los webhooks en Stripe Dashboard


