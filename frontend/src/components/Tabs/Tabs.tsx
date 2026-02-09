import React, { useState } from 'react';
import './Tabs.css';

export interface TabsProps {
  /** Tab items */
  items: {
    /** Tab ID */
    id: string;
    /** Tab label */
    label: string | React.ReactNode;
    /** Tab content */
    content: React.ReactNode;
    /** Icon */
    icon?: React.ReactNode;
    /** Disabled */
    disabled?: boolean;
  }[];
  /** Default active tab */
  defaultTab?: string;
  /** Controlled active tab */
  activeTab?: string;
  /** Tab change callback */
  onChange?: (tabId: string) => void;
  /** Variant */
  variant?: 'default' | 'pills';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether tabs are full width */
  fullWidth?: boolean;
  /** Custom class name */
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || items[0]?.id);
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div className={`tabs ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${className}`}>
      <div className="tabs-list" role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            className={`tabs-trigger ${activeTab === item.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-controls={`tab-panel-${item.id}`}
            disabled={item.disabled}
            onClick={() => handleTabChange(item.id)}
          >
            {item.icon && <span className="tabs-trigger-icon">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
      
      <div className="tabs-content">
        {items.map((item) => (
          <div
            key={item.id}
            id={`tab-panel-${item.id}`}
            className={`tabs-content-item ${activeTab === item.id ? 'active' : ''}`}
            role="tabpanel"
            aria-labelledby={`tab-trigger-${item.id}`}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
