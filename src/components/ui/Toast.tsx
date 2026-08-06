import React, { createContext, useContext, useState } from 'react';
import { classNames, generateId } from '../../utils/helpers';

export interface ToastData { id: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; }
interface ToastContextType {
  addToast: (message: string, type?: ToastData['type']) => void;
  showToast: (message: string, type?: ToastData['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (message: string, type: ToastData['type'] = 'info') => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const showToast = addToast;

  return (
    <ToastContext.Provider value={{ addToast, showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={classNames(
              'pointer-events-auto p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between transition-all duration-300 animate-slideUp',
              t.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
              t.type === 'error' ? 'bg-red-600 text-white border-red-700' :
              t.type === 'warning' ? 'bg-amber-500 text-white border-amber-600' :
              'bg-[#0099B8] text-white border-[#007A93]'
            )}
          >
            <span>{t.message}</span>
            <button 
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              className="ml-4 opacity-75 hover:opacity-100 font-bold text-base"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      addToast: (msg: string) => alert(msg),
      showToast: (msg: string) => alert(msg)
    };
  }
  return ctx;
};