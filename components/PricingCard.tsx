'use client';

import { useState } from 'react';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PricingCard({ plan, userId }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [operationCode, setOperationCode] = useState('');

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
        className={`relative rounded-2xl border bg-white p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 ${plan.popular
            ? 'border-teal-200 ring-2 ring-teal-500/20 scale-105'
            : 'border-gray-200'
          }`}
      >
        {plan.popular && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-teal-500/50">
              ⭐ Más Popular
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              ${plan.price}
            </span>
            <span className="text-gray-500 font-medium">/ {plan.period}</span>
          </div>
        </div>

        <ul className="mb-8 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribeClick}
          disabled={loading}
          className={`w-full rounded-xl px-6 py-4 font-bold text-white transition-all disabled:opacity-50 shadow-lg active:scale-95 ${plan.popular
              ? 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-teal-500/30'
              : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black shadow-gray-500/30'
            }`}
        >
          Suscribirse Ahora
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pago con Yape</h3>
              <p className="text-gray-600">
                Escanea el QR para pagar el plan <span className="font-semibold text-teal-600">{plan.name}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-6 bg-gray-50 rounded-xl p-6">
              <div className="bg-white p-3 rounded-xl shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/yape-qr.jpg"
                  alt="QR Yape"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  S/ {plan.price}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Operación / Teléfono
                </label>
                <input
                  type="text"
                  value={operationCode}
                  onChange={(e) => setOperationCode(e.target.value)}
                  placeholder="Ej: 1234567"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={loading || !operationCode}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Validando...
                  </span>
                ) : (
                  'Confirmar Pago'
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                Al confirmar, tu suscripción se activará inmediatamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
