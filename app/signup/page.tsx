'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al crear la cuenta. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between relative overflow-hidden font-sans">
      {/* Wave Header Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] z-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#4ADE80', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            fillOpacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
          <path
            fill="#FFFF"
            fillOpacity="0.2"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,160C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Header Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-start z-10 text-white">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xs text-center border-2 border-white/30">
            Gemgloo
          </div>
        </div>
        <h2 className="text-xl font-medium tracking-wide">Sistema para Clinica</h2>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex items-center justify-center z-10 px-4">
        <div className="flex w-full max-w-5xl items-center justify-center gap-10">
          {/* Sign Up Card */}
          <div className="bg-white rounded-lg p-10 w-full max-w-[500px] shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100">
            <h1 className="text-3xl font-bold text-center text-[#14B8A6] mb-8" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              Crear Cuenta
            </h1>

            {success ? (
              <div className="space-y-4">
                <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg text-sm text-center">
                  ¡Cuenta creada exitosamente! Revisa tu correo para confirmar tu cuenta.
                </div>
                <p className="text-gray-600 text-sm text-center">
                  Redirigiendo al login...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Campo Nombre */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 pb-2 transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Campo Email */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 pb-2 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Campo Password */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 pb-2 transition-colors"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                {/* Campo Confirm Password */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 pb-2 transition-colors"
                    placeholder="Confirma tu contraseña"
                  />
                </div>

                {/* Botón Sign Up */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-3 rounded-full text-white font-medium transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md bg-gradient-to-r from-[#34D399] to-[#2DD4BF] hover:shadow-lg"
                  >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-6 border-t border-gray-100 mt-6">
                  <p className="text-gray-600 text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <a
                      href="/login"
                      className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors"
                    >
                      Inicia sesión aquí
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center z-10">
        <p className="text-[#2DD4BF] text-sm font-medium">
          2024 © Developed by Gemgloo
        </p>
      </footer>

      {/* Bottom decoration */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-50 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}
