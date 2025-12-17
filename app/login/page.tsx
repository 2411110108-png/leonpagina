'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        // Esperar a que la sesión se sincronice
        await supabase.auth.getSession();
        // Redirigir después del login exitoso
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
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
              <stop offset="0%" style={{ stopColor: '#4ADE80', stopOpacity: 1 }} /> {/* Light Green/Teal */}
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} /> {/* Blue */}
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
          {/* Logo Placeholder */}
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xs text-center border-2 border-white/30">
            Gemgloo
          </div>
        </div>
        <h2 className="text-xl font-medium tracking-wide">Sistema para Clinica</h2>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex items-center justify-center z-10 px-4">
        <div className="flex w-full max-w-5xl items-center justify-center gap-10">

          {/* Illustration would go here - Ignored as requested */}
          {/* <div className="hidden lg:block w-1/2"> ... </div> */}

          {/* Login Card */}
          <div className="bg-white rounded-lg p-10 w-full max-w-[450px] shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100">
            <h1 className="text-3xl font-bold text-center text-[#14B8A6] mb-12" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              Inicio de Sesión
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="group">
                <label className="block text-[#14B8A6] text-sm font-medium mb-1">
                  Correo Electronico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b-2 border-gray-300 focus:border-[#2DD4BF] outline-none py-2 text-gray-600 transition-colors bg-white font-medium"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-[#14B8A6] text-sm font-medium mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-300 focus:border-[#2DD4BF] outline-none py-2 text-gray-600 transition-colors bg-white font-medium"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-3 rounded-full text-white font-medium transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md bg-gradient-to-r from-[#34D399] to-[#2DD4BF] hover:shadow-lg"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-6 border-t border-gray-100 mt-6">
                <p className="text-gray-600 text-sm">
                  ¿No tienes una cuenta?{' '}
                  <a
                    href="/signup"
                    className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors"
                  >
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center z-10">
        <p className="text-[#2DD4BF] text-sm font-medium">
          2024 © Developed by Gemgloo
        </p>
      </footer>

      {/* Bottom Green Bubble/Wave decoration (simulated) */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-50 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}

