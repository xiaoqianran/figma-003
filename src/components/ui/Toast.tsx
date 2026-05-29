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

// Industrial Yellow/Metal aesthetic - heavy use of #fecc2a primary + metal darks + semantic red
const typeStyles: Record<ToastType, { bg: string; border: string; icon: string; iconColor: string }> = {
  success: { bg: '#1A1916', border: '#fecc2a', icon: '✓', iconColor: '#fecc2a' },
  error:   { bg: '#1A1916', border: '#C53D3D', icon: '✕', iconColor: '#C53D3D' },
  info:    { bg: '#1A1916', border: '#5A7A9A', icon: 'ℹ', iconColor: '#8BA4BE' },
  warning: { bg: '#1A1916', border: '#fecc2a', icon: '⚠', iconColor: '#fecc2a' },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newToast: Toast = { id, duration: 3800, ...toast };
    setToasts(prev => [newToast, ...prev].slice(0, 5)); // newest first, cap at 5

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

      {/* Toast Container - Industrial console aesthetic, overlays lab for visible feedback during prototype testing */}
      <div style={{
        position: 'fixed',
        top: '68px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: 'min(340px, 92vw)',
        pointerEvents: 'none'
      }}>
        {toasts.map((toastItem, index) => {
          const s = typeStyles[toastItem.type];
          return (
            <div
              key={toastItem.id}
              onClick={() => dismissToast(toastItem.id)}
              style={{
                background: s.bg,
                border: `2px solid ${s.border}`,
                borderRadius: '12px',
                padding: '13px 16px',
                color: '#EDEBE5',
                fontSize: '13px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                cursor: 'pointer',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                pointerEvents: 'auto',
                opacity: 1 - Math.min(index * 0.06, 0.25), // subtle stack fade
                transform: `translateY(${index * -1}px)`,
                transition: 'all 0.2s cubic-bezier(0.2, 0.0, 0.0, 1)'
              }}
            >
              <div style={{
                color: s.iconColor,
                fontWeight: 700,
                fontSize: '16px',
                marginTop: '1px',
                lineHeight: 1,
                flexShrink: 0,
                width: '18px',
                textAlign: 'center'
              }}>
                {s.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: s.border === '#fecc2a' ? '#fecc2a' : '#EDEBE5', marginBottom: toastItem.message ? 3 : 0, letterSpacing: '0.2px' }}>
                  {toastItem.title}
                </div>
                {toastItem.message && (
                  <div style={{ opacity: 0.9, fontSize: '12px', lineHeight: 1.35, color: '#C9C6BE' }}>
                    {toastItem.message}
                  </div>
                )}
              </div>
              <div style={{ opacity: 0.5, fontSize: '11px', marginLeft: 4, marginTop: 2, color: '#B8B5B0' }}>×</div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
