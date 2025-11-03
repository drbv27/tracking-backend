"use client";

import { useEffect }
 from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta ../..
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // --- Protección de Ruta ---
  // Esta es la lógica clave: si el usuario NO está logueado,
  // lo pateamos de vuelta al login.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/'); // Redirige al login
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirige al login después de salir
  };

  // --- Pantalla de Carga ---
  // Si estamos verificando el auth, no mostramos nada
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Verificando autenticación...</p>
      </main>
    );
  }

  // --- Contenido del Dashboard ---
  // Si estamos autenticados, mostramos el dashboard.
  // (Si no, el useEffect ya lo está redirigiendo)
  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-blue-600">Metrics Lab</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800">
              ¡Bienvenido a tu Dashboard!
            </h1>
            <p className="mt-4 text-gray-600">
              Este es tu espacio protegido. Próximamente, aquí verás tus
              proyectos y analíticas.
            </p>
          </div>
        </div>
      </main>
    </div>
  ) : null; // No renderizamos nada si no está autenticado (será redirigido)
}