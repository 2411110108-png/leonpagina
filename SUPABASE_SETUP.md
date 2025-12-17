# Configuración de Supabase

Este proyecto está integrado con Supabase para autenticación y base de datos.

## Pasos para configurar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración

### 3. Obtener las credenciales

1. En el dashboard de tu proyecto, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_del_proyecto
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
```

**Ejemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Configurar la base de datos

Ejecuta los siguientes scripts SQL en el SQL Editor de Supabase para crear las tablas del MVP:

#### Tabla: doctor
```sql
create table doctor (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  especialidad text not null,
  telefono text,
  creado_en timestamp default now()
);
```

#### Tabla: paciente
```sql
create table paciente (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  dni text not null unique,
  telefono text,
  correo text,
  creado_en timestamp default now()
);
```

#### Tabla: citas
```sql
create table citas (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctor(id),
  paciente_id uuid references paciente(id),
  fecha date not null,
  hora text not null,
  estado text default 'pendiente'
    check (estado in ('pendiente','confirmada','cancelada','atendida')),
  creado_en timestamp default now(),
  unique(doctor_id, fecha, hora)
);
```

### 6. Habilitar autenticación por email

1. Ve a **Authentication** > **Providers** en el dashboard de Supabase
2. Asegúrate de que **Email** esté habilitado
3. Opcionalmente, configura otros proveedores (Google, GitHub, etc.)

## Estructura de archivos

- `lib/supabase/client.ts` - Cliente de Supabase para componentes del cliente
- `lib/supabase/server.ts` - Cliente de Supabase para Server Components y Server Actions
- `lib/supabase/middleware.ts` - Utilidades para el middleware de autenticación
- `middleware.ts` - Middleware de Next.js que protege rutas y maneja sesiones

## Uso

### En componentes del cliente

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### En Server Components

```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data } = await supabase.from('doctor').select('*');
```

## Protección de rutas

El middleware protege automáticamente todas las rutas excepto:
- `/login`
- `/register`
- `/forgot-password`

Los usuarios no autenticados serán redirigidos a `/login`.


