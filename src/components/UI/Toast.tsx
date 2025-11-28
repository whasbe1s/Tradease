import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ToastItem } from '../types';

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(toast.id), 200);
    }, 4800);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  };

  const handleUndo = () => {
    if (toast.onUndo) {
      toast.onUndo();
      handleClose();
    }
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-nothing-surface border-nothing-dark/20 text-nothing-dark',
  };

  return (
    <div
      className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3 border rounded-none shadow-lg
                ${colors[toast.type]}
                ${isExiting ? 'animate-out fade-out slide-out-to-right duration-200' : 'animate-in slide-in-from-right fade-in duration-200'}
            `}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-mono flex-1">{toast.message}</p>

      {toast.onUndo && (
        <button
          onClick={handleUndo}
          className="text-xs font-mono uppercase underline hover:no-underline transition-all"
        >
          Undo
        </button>
      )}

      <button
        onClick={handleClose}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};