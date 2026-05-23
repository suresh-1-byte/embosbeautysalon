import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Bell, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  body?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-green-500 flex-shrink-0" />,
  error: <XCircle size={18} className="text-red-500 flex-shrink-0" />,
  info: <Bell size={18} className="text-[#40BFFF] flex-shrink-0" />,
};

const borders = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
};

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-3 left-3 sm:left-auto sm:right-4 z-[9999] flex flex-col gap-2 sm:max-w-xs pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg ${borders[t.type]}`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1a2e] leading-tight">{t.title}</p>
              {t.body && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.body}</p>}
            </div>
            <button onClick={() => onRemove(t.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5 p-1">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Auto-dismiss hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, title: string, body?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, body }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

// Need useState import
import { useState } from 'react';
