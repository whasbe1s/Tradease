import { useState, useCallback } from 'react';
import { ToastItem } from '../types';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', onUndo?: () => void) => {
    const id = crypto.randomUUID();
    const newToast: ToastItem = { id, message, type, onUndo };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};
