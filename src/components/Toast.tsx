import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info as InfoIcon, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((message: string) => toast(message, 'success'), [toast]);
  const error = useCallback((message: string) => toast(message, 'error'), [toast]);
  const info = useCallback((message: string) => toast(message, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none" 
        id="toast-layer-container"
      >
        <AnimatePresence>
          {toasts.map(t => {
            let icon = <InfoIcon className="size-4 text-blue-600" />;
            let borderColor = 'border-slate-200';
            let bgLight = 'bg-white';
            
            if (t.type === 'success') {
              icon = <CheckCircle2 className="size-4 text-emerald-600" />;
              borderColor = 'border-emerald-100';
              bgLight = 'bg-emerald-50/90';
            } else if (t.type === 'error') {
              icon = <AlertTriangle className="size-4 text-rose-600" />;
              borderColor = 'border-rose-100';
              bgLight = 'bg-rose-50/90';
            }

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderColor} ${bgLight} shadow-lg backdrop-blur-md text-slate-800`}
                id={`toast-item-${t.id}`}
              >
                <div className="shrink-0 mt-0.5">{icon}</div>
                <div className="flex-1 text-xs font-semibold leading-relaxed">
                  {t.message}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 p-1 hover:bg-slate-100/60 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
