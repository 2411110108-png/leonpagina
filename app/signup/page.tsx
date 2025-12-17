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
        // Opcional: redirigir después de un tiempo
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

      {/* Tarjeta de registro con efecto glassmorphism */}
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
            Sign Up
          </h1>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-500/20 border border-green-400/50 text-green-200 px-4 py-3 rounded-lg text-sm text-center">
                ¡Cuenta creada exitosamente! Revisa tu correo para confirmar tu cuenta.
              </div>
              <p className="text-white text-sm text-center">
                Redirigiendo al login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Campo Nombre */}
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-white text-sm mb-2 font-medium"
                >
                  Nombre
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-white/50 text-white placeholder-white/50 focus:outline-none focus:border-white pb-2 pr-8 transition-colors"
                    placeholder="Tu nombre"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

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
                    minLength={6}
                    className="w-full bg-transparent border-0 border-b-2 border-white/50 text-white placeholder-white/50 focus:outline-none focus:border-white pb-2 pr-8 transition-colors"
                    placeholder="Password (mín. 6 caracteres)"
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

              {/* Campo Confirm Password */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-sm mb-2 font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-transparent border-0 border-b-2 border-white/50 text-white placeholder-white/50 focus:outline-none focus:border-white pb-2 pr-8 transition-colors"
                    placeholder="Confirma tu password"
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>

              {/* Botón Sign Up */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          )}

          {/* Enlace de login */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-white font-semibold hover:underline"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


