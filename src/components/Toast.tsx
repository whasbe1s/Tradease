import React, { useEffect } from 'react';
import { X, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle size={16} className="text-nothing-accent" />,
    error: <AlertTriangle size={16} className="text-red-500" />,
    info: <Info size={16} className="text-nothing-dim" />
  };

  return (
    <div className="pointer-events-auto flex items-center gap-3 w-full max-w-sm bg-nothing-base border border-nothing-dark shadow-[4px_4px_0px_0px_rgba(34,34,34,0.1)] p-3 pr-8 animate-in slide-in-from-right-full duration-300 relative group select-none rounded-none">
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="font-mono text-xs uppercase text-nothing-dark tracking-wide">{toast.message}</p>
      <button 
        onClick={() => onClose(toast.id)}
        className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-nothing-dark/40 hover:text-nothing-dark p-1 rounded-none"
      >
        <X size={14} />
      </button>
    </div>
  );
};