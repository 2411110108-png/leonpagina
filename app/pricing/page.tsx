'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import PricingCard from '@/components/PricingCard';

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
      name: 'Básico',
      price: 9.99,
      period: 'mes',
      features: [
        'Hasta 5 doctores',
        'Hasta 50 pacientes',
        'Gestión de citas',
        'Soporte por email',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Profesional',
      price: 29.99,
      period: 'mes',
      features: [
        'Doctores ilimitados',
        'Pacientes ilimitados',
        'Gestión de citas',
        'Reportes avanzados',
        'Soporte prioritario',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 99.99,
      period: 'mes',
      features: [
        'Todo lo del plan Profesional',
        'Múltiples sucursales',
        'API personalizada',
        'Soporte 24/7',
        'Capacitación incluida',
      ],
      popular: false,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm opacity-80">Cargando planes...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-50 mb-4">
            Elige tu Plan
          </h1>
          <p className="text-lg text-slate-400">
            Selecciona el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} userId={user.id} />
          ))}
        </div>
      </div>
    </div>
  );
}


