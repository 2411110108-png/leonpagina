# Guía de Despliegue a Producción (Vercel)

Esta guía te ayudará a desplegar tu aplicación de Consultorio Médico a producción en Vercel.

## 📋 Requisitos Previos

- Una cuenta en [Vercel](https://vercel.com).
- Una cuenta en [GitHub](https://github.com) (recomendado) o Vercel CLI.
- Tu proyecto de Supabase listo.

## 1. 🔐 Configuración de Supabase

Asegúrate de tener las credenciales de tu proyecto de Supabase a la mano.

1. Ve a **Supabase Dashboard** > **Settings** > **API**.
2. Copia:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

> **Importante:** Para producción, asegúrate de que tus tablas de base de datos (`doctor`, `paciente`, `citas`, `subscriptions`) existan y que las políticas de seguridad (RLS) estén activas para proteger los datos.

## 2. 🚀 Desplegar en Vercel

La forma más fácil es conectando tu repositorio de GitHub.

### Opción A: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub** (si no lo has hecho):
   
   ```bash
   git add .
   git commit -m "Listo para producción"
   git push origin main
   ```

2. **Crea el proyecto en Vercel:**
   - Ve a [vercel.com/new](https://vercel.com/new).
   - Selecciona tu repositorio `proyecto-consultorio`.
   - Haz clic en **Import**.

3. **Configura el Proyecto:**
   - **Framework Preset:** Next.js (se detecta automáticamente).
   - **Root Directory:** `./` (déjalo así).

4. **Variables de Entorno (Environment Variables):**
   Despliega la sección "Environment Variables" y agrega las siguientes:

   | Nombre | Valor |
   |origen|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | *Tu URL de Supabase* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Tu clave anon de Supabase* |

5. **Desplegar:**
   - Haz clic en **Deploy**.
   - Espera unos minutos. ¡Vercel construirá y desplegará tu app!

### Opción B: Desde Vercel CLI (Línea de Comandos)

Si prefieres usar la terminal:

1. Instala Vercel CLI: `npm i -g vercel`
2. Inicia sesión: `vercel login`
3. Ejecuta el comando de despliegue: `vercel`
4. Sigue las instrucciones en pantalla.
5. Cuando te pregunte por las variables de entorno, agrégalas en el dashboard de Vercel después del despliegue o usa `vercel env add`.

## 3. ✅ Verificación

Una vez desplegado:

1. Abre la URL que te da Vercel (ej. `https://mi-consultorio.vercel.app`).
2. Intenta iniciar sesión.
3. Verifica que puedas:
   - Ver el Dashboard.
   - Crear un Paciente/Doctor.
   - Ver los planes de suscripción (Página de precios).
   - Probar el botón de "Suscribirse" (debería salir el QR de Yape).

## 4. 📝 Notas Importantes

- **Pagos:** El sistema de pagos actual es **Manual (QR Yape)**. No necesitas configurar pasarelas de pago reales como Stripe por ahora. La activación de la suscripción es automática tras la "confirmación" del usuario en el modal.
- **Base de Datos:** Estás usando la misma base de datos de Supabase. Si quieres separar "Desarrollo" de "Producción", deberías crear un nuevo proyecto en Supabase y usar esas credenciales en Vercel.

¡Felicidades! Tu aplicación ya está en internet. 🚀
