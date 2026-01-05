'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType } from '@/types';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
  };

  const colorClasses = {
    success: 'border-l-[var(--success)] [&_.toast-icon]:text-[var(--success)]',
    error: 'border-l-[var(--danger)] [&_.toast-icon]:text-[var(--danger)]',
    warning: 'border-l-[var(--warning)] [&_.toast-icon]:text-[var(--warning)]',
    info: 'border-l-[var(--accent)] [&_.toast-icon]:text-[var(--accent)]',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      <div className="fixed top-[90px] right-8 z-[1000] flex flex-col gap-2.5">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-[var(--bg-panel)] border border-[var(--border)] border-l-4 rounded-lg p-4 min-w-[300px] max-w-[400px] flex items-center gap-3 shadow-lg animate-slideIn ${colorClasses[toast.type]}`}
          >
            <i className={`fas ${icons[toast.type]} text-xl toast-icon flex-shrink-0`}></i>
            <div className="flex-1 text-sm text-[var(--text-primary)]">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-5 h-5 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
