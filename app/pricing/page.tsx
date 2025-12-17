'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PricingCard from '@/components/PricingCard';
import Link from 'next/link';

export default function PricingPage() {
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('PricingPage (Client): No user, redirecting');
          router.replace('/login');
          return;
        }
        setUser(user);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  const plans = [
    {
      id: 'basic',
      name: 'Starter',
      price: 49,
      period: 'mes',
      features: [
        '10 Doctores activos',
        '100 Pacientes registrados',
        'Gestión completa de citas',
        'Historial médico básico',
        'Soporte por email',
        'Reportes mensuales',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 149,
      period: 'mes',
      features: [
        'Doctores ilimitados',
        'Pacientes ilimitados',
        'Gestión avanzada de citas',
        'Historial médico completo',
        'Reportes en tiempo real',
        'Análisis y estadísticas',
        'Soporte prioritario 24/7',
        'Recordatorios automáticos',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 399,
      period: 'mes',
      features: [
        'Todo del plan Professional',
        'Múltiples sucursales',
        'API REST personalizada',
        'Integración con sistemas',
        'Capacitación del equipo',
        'Soporte dedicado 24/7',
        'Backup automático diario',
        'Personalización completa',
      ],
      popular: false,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Cargando planes...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 py-20">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Dashboard
            </Link>

            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Planes y Precios
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Elige el plan perfecto para tu clínica y comienza a gestionar tus pacientes de manera profesional
            </p>

            {/* Decorative elements */}
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <div className="w-2 h-2 rounded-full bg-white/80"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 -mt-12 pb-20">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} userId={user.id} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
              <p className="text-gray-600 text-sm">Sí, puedes actualizar o degradar tu plan cuando lo necesites.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">¿Ofrecen garantía de devolución?</h3>
              <p className="text-gray-600 text-sm">Sí, ofrecemos garantía de devolución de 30 días sin preguntas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

