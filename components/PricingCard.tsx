'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { subscribeToPlanAction } from '@/app/pricing/actions';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
}

interface PricingCardProps {
  plan: Plan;
  userId: string;
}

export default function PricingCard({ plan, userId }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [operationCode, setOperationCode] = useState('');

  const router = useRouter();

  const handleSubscribeClick = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!operationCode) {
      alert('Por favor ingresa el número de operación');
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would verify the operationCode here
      await subscribeToPlanAction(plan.id);
    } catch (error) {
      console.error('Error al suscribirse:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  return (
    <>
      <div
        className={`relative rounded-lg border p-8 shadow-lg ${plan.popular
            ? 'border-green-500 bg-white dark:bg-zinc-800 scale-105'
            : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800'
          }`}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1 text-sm font-medium text-white">
            Más Popular
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {plan.name}
          </h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              ${plan.price}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">/{plan.period}</span>
          </div>
        </div>

        <ul className="mb-8 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribeClick}
          disabled={loading}
          className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors disabled:opacity-50 ${plan.popular
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200'
            }`}
        >
          Suscribirse
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-slate-100 mb-2">Pago con Yape</h3>
            <p className="text-sm text-slate-400 mb-6">Escanea el QR para pagar el plan <span className="text-cyan-400 font-medium">{plan.name}</span>.</p>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="bg-white p-2 rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/yape-qr.jpg"
                  alt="QR Yape"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">Total a pagar</p>
                <p className="text-2xl font-bold text-slate-100">S/ {plan.price}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Número de Operación / Teléfono
                </label>
                <input
                  type="text"
                  value={operationCode}
                  onChange={(e) => setOperationCode(e.target.value)}
                  placeholder="Ej: 1234567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={loading || !operationCode}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Validando...' : 'Confirmar Pago'}
              </button>

              <p className="text-[10px] text-center text-slate-500">
                Al confirmar, tu suscripción se activará inmediatamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
