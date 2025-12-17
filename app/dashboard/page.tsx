'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Cita } from '@/lib/supabase/queries';
import StatCard from '@/components/dashboard/StatCard';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);
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

        const today = new Date().toISOString().split('T')[0];

        const { data: citasData } = await supabase
          .from('citas')
          .select('*, doctor(nombre, especialidad), paciente(nombre)')
          .gte('fecha', today)
          .in('estado', ['pendiente', 'confirmada'])
          .order('fecha', { ascending: true })
          .order('hora', { ascending: true })
          .limit(4);

        setProxCitas(citasData || []);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            buenos dias, Dr. {userEmail?.split('@')[0]}
          </h1>
          <p className="text-gray-500 mt-1">bienvenido a su panel de control</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Ver reportes
          </button>
          <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors shadow-md shadow-teal-200">
            + Nuevo paciente
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Citas"
          value="18"
          change="12%"
          trend="up"
          color="teal"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Pacientes"
          value="52"
          change="8%"
          trend="up"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Ingresos"
          value="$24.3k"
          change="5%"
          trend="neutral"
          color="indigo"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Satisfacción"
          value="4.9/5"
          trend="up"
          change="0.2"
          color="amber"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-lg">Citas próximas</h3>
            <Link href="/dashboard/citas" className="text-sm text-teal-600 font-medium hover:text-teal-700">Ver todas</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {proxCitas.map((cita) => (
              <div key={cita.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex flex-col items-center justify-center font-bold text-xs">
                    <span>{new Date(cita.fecha).getDate()}</span>
                    <span className="uppercase text-[10px] opacity-75">{new Date(cita.fecha).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{cita.paciente?.nombre}</p>
                    <p className="text-xs text-gray-500">{cita.hora} • Dr. {cita.doctor?.nombre}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize
                             ${cita.estado === 'confirmada' ? 'bg-emerald-100 text-emerald-700' :
                    cita.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                  {cita.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Small Widgets Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-8 -mt-8"></div>

            <h3 className="font-bold text-lg mb-1 relative z-10">Premium Plan</h3>
            <p className="text-teal-100 text-sm mb-6 relative z-10 opacity-90">Unlock advanced reporting and patient analytics.</p>
            <button className="w-full py-3 bg-white text-teal-600 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all relative z-10">
              Actualizar perfil
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Acciones rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl bg-gray-50 hover:bg-teal-50 hover:text-teal-600 transition-colors flex flex-col items-center gap-2 group">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-teal-600">Add Cita</span>
              </button>
              <button className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors flex flex-col items-center gap-2 group">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">Add Patient</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

