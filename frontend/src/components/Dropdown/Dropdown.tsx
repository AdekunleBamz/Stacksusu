import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Dropdown.css';

export interface DropdownItem {
  /** Item ID */
  id: string;
  /** Item label */
  label: string | React.ReactNode;
  /** Icon */
  icon?: React.ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Variant */
  variant?: 'default' | 'danger';
  /** Click handler */
  onClick?: () => void;
}

export interface DropdownProps {
  /** Dropdown trigger */
  trigger: React.ReactNode;
  /** Dropdown items */
  items: DropdownItem[];
  /** Dropdown header */
  header?: string | React.ReactNode;
  /** Position */
  position?: 'left' | 'right' | 'center';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether dropdown is open (controlled) */
  isOpen?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Open change callback */
  onOpenChange?: (isOpen: boolean) => void;
  /** Custom class name */
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  header,
  position = 'left',
  size = 'md',
  isOpen: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  const toggleDropdown = useCallback(() => {
    handleOpenChange(!isOpen);
  }, [isOpen, handleOpenChange]);

  const closeDropdown = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const handleItemClick = useCallback(
    (item: DropdownItem) => {
      if (!item.disabled) {
        item.onClick?.();
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDropdown]);

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${size} ${className}`}
    >
      <div
        className="dropdown-trigger"
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
      >
        {trigger}
        <svg
          className="dropdown-arrow"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div
        className={`dropdown-menu ${position} ${isOpen ? 'open' : ''}`}
        role="menu"
      >
        {header && (
          <div className="dropdown-header">
            {header}
          </div>
        )}

        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <div className="dropdown-divider" />}
            <button
              className={`dropdown-item ${item.variant === 'danger' ? 'dropdown-item-danger' : ''}`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.icon && (
                <span className="dropdown-item-icon">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
