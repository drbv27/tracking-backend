"use client"; // ¡Muy importante! Indica que es un Componente de Cliente

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Definimos la URL de nuestra API de backend
// (Gracias al Paso 6.A, esto funcionará en local)
const API_URL = 'http://localhost:3000/api';

// 2. Creamos el Contexto
const AuthContext = createContext();

// 3. Creamos el "Proveedor" (el componente que envuelve la app)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Para saber si estamos cargando

    // 4. useEffect para cargar el token del localStorage al iniciar
    useEffect(() => {
        const tokenGuardado = localStorage.getItem('token');
        if (tokenGuardado) {
            setToken(tokenGuardado);
            // Si hay token, lo ponemos en los headers de TODAS las peticiones de axios
            axios.defaults.headers.common['x-auth-token'] = tokenGuardado;
        }
        setLoading(false); // Terminamos de cargar
    }, []);

    // 5. Función de Registro
    const register = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { email, password });
            const { token } = res.data;

            setToken(token);
            localStorage.setItem('token', token);
            axios.defaults.headers.common['x-auth-token'] = token;
        } catch (err) {
            console.error('Error en el registro:', err.response.data.message);
            // (Aquí podríamos retornar el error para mostrarlo en la UI)
        }
    };

    // 6. Función de Login
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token } = res.data;

            setToken(token);
            localStorage.setItem('token', token);
            axios.defaults.headers.common['x-auth-token'] = token;
        } catch (err) {
            console.error('Error en el login:', err.response.data.message);
            // (Aquí podríamos retornar el error)
        }
    };

    // 7. Función de Logout
    const logout = () => {
        setToken(null);
        setUser(null); // (Aún no usamos 'user', pero es buena práctica)
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{
            token,
            user,
            loading,
            isAuthenticated: !!token, // "!!token" es true si hay un token, false si no
            register,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 8. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};