import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Plus, X, CirclePlus, Wallet, Send, Bell, Settings, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import './QuickActions.css';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

interface QuickActionsProps {
  /** Custom actions to display */
  actions?: QuickAction[];
  /** Position of the FAB */
  position?: 'bottom-right' | 'bottom-left';
  /** Additional class name */
  className?: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { id: 'create-circle', label: 'Create Circle', icon: <CirclePlus size={20} />, onClick: () => {}, variant: 'primary' },
  { id: 'deposit', label: 'Deposit STX', icon: <Wallet size={20} />, onClick: () => {}, variant: 'success' },
  { id: 'send', label: 'Send Payment', icon: <Send size={20} />, onClick: () => {} },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, onClick: () => {} },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, onClick: () => {} },
  { id: 'help', label: 'Get Help', icon: <HelpCircle size={20} />, onClick: () => {} },
];

/**
 * QuickActions Component
 * 
 * Floating action button (FAB) that expands to reveal quick actions.
 * Provides fast access to common tasks without navigation.
 */
const QuickActions = memo(function QuickActions({
  actions = DEFAULT_ACTIONS,
  position = 'bottom-right',
  className
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleActionClick = useCallback((action: QuickAction) => {
    action.onClick();
    setIsOpen(false);
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className={clsx(
        'quick-actions',
        `quick-actions--${position}`,
        isOpen && 'quick-actions--open',
        className
      )}
    >
      {/* Backdrop */}
      {isOpen && <div className="quick-actions__backdrop" onClick={() => setIsOpen(false)} />}

      {/* Action buttons */}
      <div className="quick-actions__menu">
        {actions.map((action, index) => (
          <button
            key={action.id}
            className={clsx(
              'quick-actions__item',
              action.variant && `quick-actions__item--${action.variant}`
            )}
            onClick={() => handleActionClick(action)}
            style={{ 
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
            }}
            aria-label={action.label}
          >
            <span className="quick-actions__item-icon">{action.icon}</span>
            <span className="quick-actions__item-label">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB button */}
      <button 
        className={clsx('quick-actions__fab', isOpen && 'quick-actions__fab--open')}
        onClick={toggle}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
      >
        <span className="quick-actions__fab-icon quick-actions__fab-icon--plus">
          <Plus size={24} />
        </span>
        <span className="quick-actions__fab-icon quick-actions__fab-icon--close">
          <X size={24} />
        </span>
      </button>
    </div>
  );
});

export { QuickActions };
export type { QuickAction, QuickActionsProps };
export default QuickActions;
