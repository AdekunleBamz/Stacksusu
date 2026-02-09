import React, { useEffect, useCallback } from 'react';
import './Dialog.css';

export interface DialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Dialog title */
  title?: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  /** Whether to show close button */
  showClose?: boolean;
  /** Close callback */
  onClose: () => void;
  /** Callback when dialog opens */
  onOpen?: () => void;
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
  /** Custom class name */
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  children,
  footer,
  size = 'md',
  showClose = true,
  onClose,
  onOpen,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}) => {
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      onOpen?.();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape, onOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-overlay"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        className={`dialog ${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="dialog-header">
            {title && (
              <h2 id="dialog-title" className="dialog-title">
                {title}
              </h2>
            )}
            {showClose && (
              <button
                className="dialog-close"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="dialog-body">{children}</div>

        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Dialog;
