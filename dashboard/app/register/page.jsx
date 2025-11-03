"use client";

import { useState, useEffect }
 from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta ../..
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // --- Protección de Ruta ---
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('No se pudo crear la cuenta. Intenta con otro email.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Crear Cuenta
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded text-gray-700"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Contraseña (mín. 6 caracteres)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}