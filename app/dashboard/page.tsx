'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import LogoutButton from '@/components/LogoutButton';
import { Cita } from '@/lib/supabase/queries';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{ plan: string; status: string; current_period_end: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [proxCitas, setProxCitas] = useState<Cita[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/login');
          return;
        }

        setUserEmail(user.email ?? null);

        // Fetch parallel data
        const today = new Date().toISOString().split('T')[0];

        const [subResponse, citasResponse] = await Promise.all([
          supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single(),
          supabase
            .from('citas')
            .select('*, doctor(nombre, especialidad), paciente(nombre)')
            .gte('fecha', today)
            .in('estado', ['pendiente', 'confirmada'])
            .order('fecha', { ascending: true })
            .order('hora', { ascending: true })
            .limit(4)
        ]);

        setSubscription(subResponse.data);
        setProxCitas(citasResponse.data || []);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm opacity-80">Cargando panel del consultorio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex h-screen max-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-semibold">
              CM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Consultorio Médico</span>
              <span className="text-[11px] text-slate-400">
                Panel administrativo
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm space-y-1">
            <div className="text-[11px] uppercase tracking-wide text-slate-500 px-3 mb-1">
              Principal
            </div>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 bg-slate-800 text-slate-50 text-sm font-medium">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-cyan-500/10 text-cyan-400">
                •
              </span>
              Panel de control
            </a>
            <a href="/dashboard/citas" className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900/60 cursor-pointer">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800 text-slate-400">
                👨‍⚕️
              </span>
              Agenda de citas
            </a>
            <a href="/dashboard/pacientes" className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900/60 cursor-pointer">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800 text-slate-400">
                👥
              </span>
              Pacientes
            </a>
            <a href="/dashboard/doctores" className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900/60 cursor-pointer">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800 text-slate-400">
                🩺
              </span>
              Doctores
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900/60 cursor-pointer">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800 text-slate-400">
                📄
              </span>
              Historias clínicas
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900/60 cursor-pointer">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800 text-slate-400">
                💊
              </span>
              Recetas
            </a>

            <div className="mt-4 text-[11px] uppercase tracking-wide text-slate-500 px-3 mb-1">
              Reportes {(!subscription || subscription.plan === 'basic') && '🔒'}
            </div>

            {subscription && (subscription.plan === 'professional' || subscription.plan === 'enterprise') ? (
              <>
                <a className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900/60 cursor-pointer">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800 text-slate-400">
                    📊
                  </span>
                  Indicadores
                </a>
                <a className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-300 hover:bg-slate-900/60 cursor-pointer">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-slate-800 text-slate-400">
                    💰
                  </span>
                  Facturación
                </a>
              </>
            ) : (
              <div className="px-3 py-2 text-xs text-slate-500 italic">
                Actualiza a Plan Profesional para ver reportes.
              </div>
            )}
          </nav>

          <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
            {subscription ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200 text-[11px]">
                    Plan {subscription.plan}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-[2px] text-[10px] font-medium text-emerald-400">
                    Activo
                  </span>
                </div>
                <p className="text-[10px]">
                  Renovación:{' '}
                  {new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px]">
                  No tienes una suscripción activa.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-md bg-cyan-500 px-2.5 py-1 text-[11px] font-medium text-slate-950 hover:bg-cyan-400"
                >
                  Ver planes
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-950/90">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4 md:px-8">
            <div>
              <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
                Panel del consultorio
              </h1>
              {userEmail && (
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Bienvenido,{' '}
                  <span className="font-medium text-slate-200">
                    {userEmail}
                  </span>
                  . Resumen general del día.
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs text-slate-400">
                <span className="text-[11px] uppercase tracking-wide">
                  Hoy
                </span>
                <span>
                  {new Date().toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>

          <div className="px-4 py-6 md:px-8 md:py-6 space-y-6">
            {/* Top metrics */}
            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Citas de hoy
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-50">
                  18
                </p>
                <p className="mt-1 text-[11px] text-emerald-400">
                  ↑ 12% vs. ayer
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Pacientes nuevos (30 días)
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-50">
                  52
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  60% primera consulta
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Ocupación de agenda
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-3xl font-semibold text-slate-50">78%</p>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-[2px] text-[10px] text-emerald-400">
                    Óptimo
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Ingresos del mes
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-50">
                  S/ 24,300
                </p>
                <p className="mt-1 text-[11px] text-emerald-400">
                  ↑ 8% vs. mes pasado
                </p>
              </div>
            </section>

            {/* Middle: citas y distribución de pacientes */}
            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-50">
                    Citas por día (7 últimos días)
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Vista simplificada
                  </span>
                </div>
                <div className="mt-2 flex h-40 items-end gap-2">
                  {[12, 16, 9, 18, 14, 20, 11].map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-cyan-500 to-sky-400"
                          style={{ height: `${value * 4}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <h2 className="text-sm font-semibold text-slate-50 mb-3">
                  Tipo de consulta
                </h2>
                <div className="flex items-center justify-center">
                  <div className="relative h-32 w-32">
                    <div className="absolute inset-0 rounded-full border-[10px] border-cyan-500/70" />
                    <div className="absolute inset-3 rounded-full border-[10px] border-emerald-500/60 border-t-transparent border-l-transparent" />
                    <div className="absolute inset-6 rounded-full bg-slate-900/90 flex items-center justify-center text-xs text-slate-300">
                      <div className="text-center">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Consultas
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-50">
                          65% nuevas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span>Nuevas</span>
                    </div>
                    <span>65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Control</span>
                    </div>
                    <span>25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-500" />
                      <span>Procedimientos</span>
                    </div>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom: tablas rápidas */}
            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-50">
                    Próximas citas
                  </h2>
                  <a
                    href="/dashboard/appointments"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    Ver agenda
                  </a>
                </div>
                <div className="space-y-2 text-xs">
                  {proxCitas?.map((cita) => (
                    <div
                      key={cita.id}
                      className="flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-900/70 px-3 py-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px] text-slate-400">
                          {cita.hora} - {new Date(cita.fecha).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-medium text-slate-100">
                          {cita.paciente?.nombre}
                        </span>
                      </div>
                      <span className="max-w-[50%] truncate text-[11px] text-slate-300">
                        {cita.doctor?.especialidad}
                      </span>
                    </div>
                  ))}
                  {proxCitas?.length === 0 && (
                    <div className="text-center text-slate-500 py-4">
                      No hay citas próximas.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-50">
                    Diagnósticos frecuentes (30 días)
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Top 5 códigos
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { nombre: 'Hipertensión esencial primaria', pct: 32 },
                    { nombre: 'Diabetes mellitus tipo 2', pct: 21 },
                    { nombre: 'Infección respiratoria aguda', pct: 17 },
                    { nombre: 'Lumbalgia', pct: 14 },
                    { nombre: 'Ansiedad generalizada', pct: 9 },
                  ].map((dx) => (
                    <div key={dx.nombre} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-slate-200">
                          {dx.nombre}
                        </span>
                        <span className="ml-2 text-[11px] text-slate-400">
                          {dx.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                          style={{ width: `${dx.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
