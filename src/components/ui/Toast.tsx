/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  // Core
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  clearAll: () => void;
  // Convenience (per task spec)
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  toast: (options: { type?: ToastType; title: string; message?: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// Industrial Yellow/Metal aesthetic - heavy use of #ca8a04 primary + metal darks + semantic red
const typeMeta: Record<ToastType, { icon: string; iconColor: string }> = {
  success: { icon: '✓', iconColor: '#ca8a04' },
  error:   { icon: '✕', iconColor: '#C53D3D' },
  info:    { icon: 'ℹ', iconColor: '#8BA4BE' },
  warning: { icon: '⚠', iconColor: '#ca8a04' },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    // Much shorter defaults — especially for info (the most spammy type during demos)
    const defaultDuration = toast.type === 'info' ? 1650 : toast.type === 'success' ? 2400 : 4200;
    const newToast: Toast = { id, duration: defaultDuration, ...toast };
    setToasts(prev => [newToast, ...prev].slice(0, 3)); // tighter cap: max 3 to reduce visual noise

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setToasts([]), []);

  // Convenience methods matching task spec
  const success = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'success', title, message, duration });
  }, [showToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'error', title, message, duration: duration ?? 4800 });
  }, [showToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'info', title, message, duration });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    showToast({ type: 'warning', title, message, duration });
  }, [showToast]);

  const toast = useCallback((options: { type?: ToastType; title: string; message?: string; duration?: number }) => {
    showToast({ type: options.type || 'info', title: options.title, message: options.message, duration: options.duration });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast, clearAll, success, error, info, warning, toast }}>
      {children}

      {/* Toast Container - bottom-right, metal/yellow readable feedback */}
      <div className="gody-toast-stack" aria-live="polite" aria-relevant="additions">
        {toasts.map((toastItem, index) => {
          const meta = typeMeta[toastItem.type];
          return (
            <div
              key={toastItem.id}
              role="status"
              tabIndex={0}
              className={`gody-toast gody-toast--${toastItem.type}`}
              onClick={() => dismissToast(toastItem.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  dismissToast(toastItem.id);
                }
              }}
              style={{
                opacity: 1 - Math.min(index * 0.06, 0.25),
                zIndex: 100 - index,
              }}
            >
              <div className="gody-toast__icon" style={{ color: meta.iconColor }}>
                {meta.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="gody-toast__title">
                  {toastItem.title}
                </div>
                {toastItem.message && (
                  <div className="gody-toast__message">
                    {toastItem.message}
                  </div>
                )}
              </div>
              <div className="gody-toast__dismiss" aria-hidden="true">×</div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
