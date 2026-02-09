import React, { useState, useRef, useEffect } from 'react';
import './Toolbar.css';

export interface ToolbarItem {
  /** Unique identifier */
  id: string;
  /** Icon or content */
  icon?: React.ReactNode;
  /** Label */
  label: string;
  /** Whether it's active */
  active?: boolean;
  /** Whether it's disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Submenu items */
  children?: ToolbarItem[];
}

export interface ToolbarProps {
  /** Toolbar items */
  items: ToolbarItem[];
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Style variant */
  variant?: 'default' | 'flat' | 'card';
  /** Custom class name */
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  items,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: ToolbarItem) => {
    if (item.disabled) return;
    
    if (item.children && item.children.length > 0) {
      setOpenDropdown(openDropdown === item.id ? null : item.id);
    } else {
      item.onClick?.();
      setOpenDropdown(null);
    }
  };

  const renderItem = (item: ToolbarItem) => {
    if (item.children && item.children.length > 0) {
      return (
        <div key={item.id} className="toolbar-dropdown" ref={dropdownRef}>
          <button
            className={`toolbar-item ${item.active ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {openDropdown === item.id && (
            <div className="toolbar-dropdown-menu">
              {item.children.map((child) => (
                <button
                  key={child.id}
                  className={`toolbar-dropdown-item ${child.active ? 'active' : ''}`}
                  onClick={() => {
                    handleItemClick(child);
                    setOpenDropdown(null);
                  }}
                  disabled={child.disabled}
                >
                  {child.icon && <span>{child.icon}</span>}
                  <span>{child.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        className={`toolbar-item ${item.active ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
        onClick={() => handleItemClick(item)}
        disabled={item.disabled}
      >
        {item.icon && <span>{item.icon}</span>}
        <span>{item.label}</span>
      </button>
    );
  };

  const renderGroup = (items: ToolbarItem[]) => {
    return items.map((item) => {
      if (item.id === 'divider') {
        return <div key={item.id} className="toolbar-divider" />;
      }
      if (item.id === 'spacer') {
        return <div key={item.id} className="toolbar-spacer" />;
      }
      return renderItem(item);
    });
  };

  return (
    <div className={`toolbar ${size} ${variant} ${className}`}>
      {renderGroup(items)}
    </div>
  );
};

export default Toolbar;
