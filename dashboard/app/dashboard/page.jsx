"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // <-- ¡Importamos axios!

// Constante para la URL de tu API
const API_URL = 'http://localhost:3000/api';

export default function DashboardPage() {
    // --- Hooks de Autenticación (como antes) ---
    const { logout, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    // --- NUEVO: Hooks de Estado para Proyectos ---
    const [projects, setProjects] = useState([]); // Lista de proyectos
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [newProjectName, setNewProjectName] = useState(''); // Para el formulario
    const [error, setError] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null); // Para feedback de "copiado"

    // --- Efecto de Guardia de Autenticación (como antes) ---
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    // --- NUEVO: Efecto para Cargar Proyectos ---
    useEffect(() => {
        // Solo cargamos si estamos autenticados
        if (isAuthenticated) {
            const fetchProjects = async () => {
                setIsLoadingProjects(true);
                try {
                    // El token ya está en los headers (gracias a AuthContext)
                    const res = await axios.get(`${API_URL}/projects`);
                    setProjects(res.data);
                } catch (err) {
                    console.error("Error al cargar proyectos", err);
                    setError("No se pudieron cargar los proyectos.");
                }
                setIsLoadingProjects(false);
            };
            fetchProjects();
        }
    }, [isAuthenticated]); // Se re-ejecuta si 'isAuthenticated' cambia

    // --- NUEVO: Función para Crear Proyecto ---
    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName) return;
        setError(null);

        try {
            const res = await axios.post(`${API_URL}/projects`, { name: newProjectName });
            // Añadimos el nuevo proyecto al inicio de la lista (en el state)
            setProjects([res.data, ...projects]);
            setNewProjectName(''); // Limpiamos el formulario
        } catch (err) {
            console.error("Error al crear proyecto", err);
            setError("No se pudo crear el proyecto.");
        }
    };

    // --- NUEVO: Función para Copiar al Portapapeles ---
    const copyToClipboard = (apiKey) => {
        navigator.clipboard.writeText(apiKey);
        setCopiedKey(apiKey); // Guardamos la key que se copió
        setTimeout(() => setCopiedKey(null), 2000); // Reseteamos después de 2 seg
    };

    // --- Función de Logout (como antes) ---
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // --- Renderizado (con lógica) ---
    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-700">Verificando autenticación...</p>
            </main>
        );
    }

    // Si estamos autenticados, mostramos el dashboard.
    return isAuthenticated ? (
        <div className="min-h-screen bg-gray-100">
            {/* --- Barra de Navegación --- */}
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

            {/* --- Contenido Principal --- */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* --- Columna 1: Crear Proyecto --- */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nuevo Proyecto</h2>
                        <form onSubmit={handleCreateProject}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="projectName">
                                    Nombre del Proyecto (ej. Mi Tienda)
                                </label>
                                <input
                                    type="text"
                                    id="projectName"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded text-gray-700"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                            >
                                Crear Proyecto
                            </button>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </form>
                    </div>
                </div>

                {/* --- Columna 2: Mis Proyectos --- */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Proyectos</h2>
                        {isLoadingProjects ? (
                            <p className="text-gray-600">Cargando proyectos...</p>
                        ) : projects.length === 0 ? (
                            <p className="text-gray-600">Aún no has creado ningún proyecto. ¡Crea uno para empezar!</p>
                        ) : (
                            <ul className="space-y-4">
                                {projects.map((project) => (
                                    <li key={project._id} className="border p-4 rounded-md bg-gray-50">
                                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                                        <p className="text-sm text-gray-500 mt-2">API Key:</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <input
                                                type="text"
                                                readOnly
                                                value={project.apiKey}
                                                className="w-full flex-1 px-2 py-1 border rounded bg-gray-200 text-gray-700 text-sm"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(project.apiKey)}
                                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                                            >
                                                {copiedKey === project.apiKey ? '¡Copiado!' : 'Copiar'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    ) : null; // No renderizar nada si no está autenticado
}