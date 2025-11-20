/**
 * API Client Utilities
 * 
 * Centralized functions for making API calls to the backend.
 * Handles authentication, error handling, and response parsing.
 */

import axios from 'axios';

// API base URL - uses environment variable or defaults to /api
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Create axios instance with authentication headers
 * @returns {Object} Axios instance with auth headers
 */
function createAuthenticatedClient() {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: token ? {
      'Authorization': `Bearer ${token}`
    } : {}
  });
}

/**
 * Delete a project and all associated events
 * @param {string} projectId - The project ID to delete
 * @returns {Promise<Object>} Deletion result with deletedEventsCount
 * @throws {Error} If deletion fails
 */
export async function deleteProject(projectId) {
  try {
    const client = createAuthenticatedClient();
    const response = await client.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    // Extract error message from response
    const message = error.response?.data?.message || 
                   error.message || 
                   'Error al eliminar el proyecto';
    throw new Error(message);
  }
}

/**
 * Get all projects for the authenticated user
 * @returns {Promise<Array>} List of projects
 * @throws {Error} If request fails
 */
export async function getProjects() {
  try {
    const client = createAuthenticatedClient();
    const response = await client.get('/projects');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 
                   error.message || 
                   'Error al cargar los proyectos';
    throw new Error(message);
  }
}

/**
 * Create a new project
 * @param {string} name - Project name
 * @returns {Promise<Object>} Created project
 * @throws {Error} If creation fails
 */
export async function createProject(name) {
  try {
    const client = createAuthenticatedClient();
    const response = await client.post('/projects', { name });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 
                   error.message || 
                   'Error al crear el proyecto';
    throw new Error(message);
  }
}

/**
 * Get a specific project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project details
 * @throws {Error} If request fails
 */
export async function getProject(projectId) {
  try {
    const client = createAuthenticatedClient();
    const response = await client.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 
                   error.message || 
                   'Error al cargar el proyecto';
    throw new Error(message);
  }
}
