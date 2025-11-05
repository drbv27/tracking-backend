// dashboard/app/project/[projectId]/page.js

"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation'; // Importamos useParams
import axios from 'axios';
import Link from 'next/link'; // Para el botón de "Volver"

// En producción, usa una ruta relativa. En desarrollo, usa la URL completa.
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '/api');

export default function ProjectAnalyticsPage() {
    // --- Hooks de Autenticación y Ruteo ---
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const params = useParams(); // Hook para leer la URL
    const { projectId } = params; // Obtenemos el [projectId] de la URL

    // --- Hooks de Estado para Eventos ---
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [error, setError] = useState(null);

    // --- Efecto de Guardia de Autenticación (como antes) ---
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    // --- Efecto para Cargar Eventos ---
    useEffect(() => {
        // Solo cargamos si estamos autenticados y ya tenemos el projectId
        if (isAuthenticated && projectId) {
            const fetchEvents = async () => {
                setIsLoadingEvents(true);
                setError(null);
                try {
                    // ¡Llamamos a nuestro nuevo endpoint del backend!
                    const res = await axios.get(`${API_URL}/projects/${projectId}/events`);
                    setEvents(res.data);
                } catch (err) {
                    console.error("Error al cargar eventos", err);
                    setError("No se pudieron cargar los eventos. (¿Este proyecto es tuyo?)");
                }
                setIsLoadingEvents(false);
            };
            fetchEvents();
        }
    }, [isAuthenticated, projectId]); // Se re-ejecuta si 'isAuthenticated' o 'projectId' cambian

    // --- Renderizado (con lógica) ---
    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-700">Verificando autenticación...</p>
            </main>
        );
    }

    return isAuthenticated ? (
        <div className="min-h-screen bg-gray-100">
            {/* --- Barra de Navegación simple --- */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl text-blue-600">Metrics Lab</span>
                        </div>
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                                ← Volver al Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Contenido Principal: Tabla de Eventos --- */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Analíticas del Proyecto</h1>
                    
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    
                    {isLoadingEvents ? (
                        <p className="text-gray-600">Cargando eventos...</p>
                    ) : events.length === 0 ? (
                        <p className="text-gray-600">
                            No se han registrado eventos para este proyecto.
                            <br />
                            Asegúrate de que tu script de tracking esté instalado con esta `apiKey`.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GCLID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Página</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.map((event) => (
                                        <tr key={event._id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {new Date(event.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.eventType}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{event.gclid}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{event.utm_source}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{event.utm_campaign}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">{event.pageUrl}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    ) : null;
}