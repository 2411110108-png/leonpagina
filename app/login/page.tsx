'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
        // Redirigir después del login exitoso usando window.location para forzar recarga
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };
  // Generar estrellas aleatorias
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 1,
  }));

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo con paisaje nocturno */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-pink-600">
        {/* Estrellas */}
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Montañas y paisaje */}
        <div className="absolute bottom-0 w-full">
          {/* Montañas lejanas */}
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
          >
            <path
              d="M0,300 L200,200 L400,250 L600,180 L800,220 L1000,190 L1200,240 L1200,300 Z"
              fill="#1a1a2e"
              opacity="0.8"
            />
            <path
              d="M0,300 L300,150 L500,200 L700,120 L900,180 L1200,140 L1200,300 Z"
              fill="#16213e"
              opacity="0.9"
            />
          </svg>

          {/* Árboles/pinos */}
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
          >
            {Array.from({ length: 20 }, (_, i) => (
              <g key={i}>
                <path
                  d={`M${i * 60},200 L${i * 60 + 10},150 L${i * 60 + 20},200 Z`}
                  fill="#0f1419"
                />
                <path
                  d={`M${i * 60 + 5},200 L${i * 60 + 15},140 L${i * 60 + 25},200 Z`}
                  fill="#0a0e13"
                />
              </g>
            ))}
          </svg>

          {/* Castillo/edificios en la distancia */}
          <div className="absolute bottom-32 right-20">
            <svg width="80" height="60" viewBox="0 0 80 60">
              <rect x="10" y="30" width="15" height="30" fill="#0a0e13" />
              <rect x="30" y="20" width="15" height="40" fill="#0a0e13" />
              <rect x="50" y="25" width="15" height="35" fill="#0a0e13" />
              <polygon points="10,30 17.5,20 25,30" fill="#0a0e13" />
              <polygon points="30,20 37.5,10 45,20" fill="#0a0e13" />
              <polygon points="50,25 57.5,15 65,25" fill="#0a0e13" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tarjeta de login con efecto glassmorphism */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div
          className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Título */}
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Campo Email */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-white text-sm mb-2 font-medium"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 border-b-2 border-white/50 text-white placeholder-white/50 focus:outline-none focus:border-white pb-2 pr-8 transition-colors"
                  placeholder="Email"
                />
                <svg
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Campo Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-white text-sm mb-2 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 border-b-2 border-white/50 text-white placeholder-white/50 focus:outline-none focus:border-white pb-2 pr-8 transition-colors"
                  placeholder="Password"
                />
                <svg
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Remember Me y Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 accent-white"
                />
                <span>Remember Me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-white hover:underline"
              >
                Forgot Password
              </a>
            </div>

            {/* Botón Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Enlace de registro */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              Don't have a account{' '}
              <a
                href="/signup"
                className="text-white font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

