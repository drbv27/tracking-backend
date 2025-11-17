'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'error', options = {}) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type,
      onRetry: options.onRetry,
      duration: options.duration !== undefined ? options.duration : 5000
    };
    
    setToasts(prev => [...prev, toast]);
    
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showError = useCallback((message, options = {}) => {
    return showToast(message, 'error', options);
  }, [showToast]);

  const showSuccess = useCallback((message, options = {}) => {
    return showToast(message, 'success', options);
  }, [showToast]);

  const showWarning = useCallback((message, options = {}) => {
    return showToast(message, 'warning', options);
  }, [showToast]);

  const showInfo = useCallback((message, options = {}) => {
    return showToast(message, 'info', options);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess, showWarning, showInfo, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
            onRetry={toast.onRetry}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
