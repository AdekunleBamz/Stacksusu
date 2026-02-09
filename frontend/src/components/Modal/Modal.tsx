import React, { useEffect, useCallback } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import './Modal.css';

export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show close button */
  showClose?: boolean;
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
  /** Position */
  position?: 'center' | 'top' | 'bottom';
  /** Whether to blur backdrop */
  blur?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Close handler */
  onClose: () => void;
  /** Custom class name */
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  position = 'center',
  blur = false,
  footer,
  onClose,
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
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${blur ? 'blur' : ''} ${position}`}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <ModalContent
        title={title}
        size={size}
        showClose={showClose}
        footer={footer}
        onClose={onClose}
        className={className}
      >
        {children}
      </ModalContent>
    </div>
  );
};

/**
 * Modal content component (for nested modals or custom usage)
 */
interface ModalContentProps {
  title?: ModalProps['title'];
  size?: ModalProps['size'];
  showClose?: ModalProps['showClose'];
  footer?: ModalProps['footer'];
  onClose: ModalProps['onClose'];
  className?: ModalProps['className'];
  children: React.ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({
  title,
  size,
  showClose,
  footer,
  onClose,
  className,
  children,
}) => {
  const ref = useClickOutside<HTMLDivElement>(() => {});

  return (
    <div
      ref={ref}
      className={`modal ${size} ${className}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
    >
      {(title || showClose) && (
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          {showClose && (
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      <div className="modal-body">{children}</div>
      
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  );
};

export default Modal;
