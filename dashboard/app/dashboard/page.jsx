"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import ConfirmDeleteDialog from '../../components/ConfirmDeleteDialog';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { deleteProject as deleteProjectAPI } from '../../utils/api';

// En producción, usa una ruta relativa. En desarrollo, usa la URL completa.
const API_URL = (process.env.NEXT_PUBLIC_API_URL || '/api');

export default function DashboardPage() {
    // --- Hooks de Autenticación (como antes) ---
    const { logout, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    // --- Hooks de Estado (como antes) ---
    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [newProjectName, setNewProjectName] = useState('');
    const [error, setError] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);
    
    // --- Hooks para Delete Functionality ---
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast, showSuccess, showError, hideToast } = useToast();

    // --- Efecto de Guardia de Autenticación (como antes) ---
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    // --- Efecto para Cargar Proyectos (como antes) ---
    useEffect(() => {
        if (isAuthenticated) {
            const fetchProjects = async () => {
                setIsLoadingProjects(true);
                try {
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
    }, [isAuthenticated]);

    // --- Función para Crear Proyecto (como antes) ---
    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName) return;
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/projects`, { name: newProjectName });
            setProjects([res.data, ...projects]);
            setNewProjectName('');
        } catch (err) {
            console.error("Error al crear proyecto", err);
            setError("No se pudo crear el proyecto.");
        }
    };

    // --- Función para Copiar (como antes) ---
    const copyToClipboard = (apiKey) => {
        navigator.clipboard.writeText(apiKey);
        setCopiedKey(apiKey);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // --- Función de Logout (como antes) ---
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // --- Funciones para Delete Functionality ---
    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setIsDialogOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
        setProjectToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;

        setIsDeleting(true);
        try {
            // Call API to delete project
            const result = await deleteProjectAPI(projectToDelete._id);
            
            // Remove project from local state
            setProjects(projects.filter(p => p._id !== projectToDelete._id));
            
            // Show success message
            showSuccess(`Proyecto "${projectToDelete.name}" eliminado exitosamente`);
            
            // Close dialog
            setIsDialogOpen(false);
            setProjectToDelete(null);
            
            console.log('Project deleted:', result);
        } catch (err) {
            console.error('Error deleting project:', err);
            showError(err.message || 'Error al eliminar el proyecto');
        } finally {
            setIsDeleting(false);
        }
    };

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
            {/* Toast Notification */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={hideToast} 
                />
            )}

            {/* Confirmation Dialog */}
            <ConfirmDeleteDialog
                isOpen={isDialogOpen}
                projectName={projectToDelete?.name || ''}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
            />

            {/* --- Barra de Navegación (como antes) --- */}
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

            {/* --- Contenido Principal (como antes) --- */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* --- Columna 1: Crear Proyecto (como antes) --- */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nuevo Proyecto</h2>
                        <form onSubmit={handleCreateProject}>
                            {/* ... (todo el formulario queda igual) ... */}
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

                {/* --- Columna 2: Mis Proyectos (con link) --- */}
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
                                    <li key={project._id} className="border p-4 rounded-md bg-gray-50 relative">
                                        
                                        {/* Delete button - positioned in top-right corner */}
                                        <button
                                            onClick={() => handleDeleteClick(project)}
                                            className="absolute top-2 right-2 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                                            aria-label={`Eliminar proyecto ${project.name}`}
                                            title="Eliminar proyecto"
                                        >
                                            <svg 
                                                className="w-5 h-5" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                                />
                                            </svg>
                                        </button>
                                        
                                        {/* Project name with link */}
                                        <Link href={`/project/${project._id}`} className="hover:underline">
                                            <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-800 pr-8">
                                                {project.name}
                                            </h3>
                                        </Link>
                                        
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
    ) : null;
}