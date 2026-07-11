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
        type="button"
        onClick={onClose}
        className="gody-modal-btn gody-modal-btn--ghost"
      >
        {cancelText || 'Cancel'}
      </button>
      <button
        type="button"
        onClick={() => {
          if (onConfirm) onConfirm();
        }}
        className={`gody-modal-btn ${destructive ? 'gody-modal-btn--danger' : 'gody-modal-btn--primary'}`}
      >
        {confirmText || 'Confirm'}
      </button>
    </div>
  ) : null;

  return (
    <div
      className="gody-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="gody-modal-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        style={{ width }}
      >
        {title && (
          <div className="gody-modal-title">
            {title}
          </div>
        )}
        <div className="gody-modal-body" style={title ? undefined : { padding: '20px' }}>
          {children}
        </div>
        
        {(footer || defaultFooter) && (
          <div className="gody-modal-footer">
            {footer || defaultFooter}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
