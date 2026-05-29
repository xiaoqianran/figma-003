import React, { type ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  // Convenience for confirmation dialogs (destructive actions)
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  destructive?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  open, onClose, title, children, footer, width = 320,
  confirmText, cancelText, onConfirm, destructive
}) => {
  if (!open) return null;

  const hasConfirmFooter = !!onConfirm || !!confirmText || !!cancelText;

  const defaultFooter = hasConfirmFooter ? (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
      <button
        onClick={onClose}
        style={{
          padding: '9px 18px',
          borderRadius: 10,
          border: '1px solid #3A3935',
          background: 'transparent',
          color: '#B8B5B0',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          minWidth: 72
        }}
      >
        {cancelText || 'Cancel'}
      </button>
      <button
        onClick={() => {
          if (onConfirm) onConfirm();
          // parent usually closes via state change in onConfirm
        }}
        style={{
          padding: '9px 20px',
          borderRadius: 10,
          border: 'none',
          background: destructive ? '#C53D3D' : '#fecc2a',
          color: destructive ? '#fff' : '#0A0908',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          minWidth: 72,
          boxShadow: destructive ? 'none' : '0 1px 0 rgba(0,0,0,0.15)'
        }}
      >
        {confirmText || 'Confirm'}
      </button>
    </div>
  ) : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,9,8,0.72)',
        zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width,
          background: '#1A1916',
          border: '1px solid #2A2926',
          borderRadius: 16,
          boxShadow: '0 24px 70px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)',
          color: '#EDEBE5',
          overflow: 'hidden',
          fontFamily: 'inherit'
        }}
      >
        {title && (
          <div style={{ 
            padding: '15px 20px', 
            borderBottom: '1px solid #2A2926', 
            fontWeight: 600, 
            fontSize: 15,
            color: '#fecc2a',
            letterSpacing: '0.3px'
          }}>
            {title}
          </div>
        )}
        <div style={{ padding: title ? '18px 20px' : '20px 20px' }}>{children}</div>
        
        {(footer || defaultFooter) && (
          <div style={{ 
            padding: '12px 18px 16px', 
            borderTop: '1px solid #2A2926', 
            display: 'flex', 
            gap: 8, 
            justifyContent: 'flex-end',
            background: 'rgba(0,0,0,0.15)'
          }}>
            {footer || defaultFooter}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
