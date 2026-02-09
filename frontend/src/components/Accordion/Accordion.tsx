import React, { useState } from 'react';
import './Accordion.css';

export interface AccordionProps {
  /** Accordion items */
  items: {
    /** Item ID */
    id: string;
    /** Item trigger/header */
    trigger: string | React.ReactNode;
    /** Item content */
    content: React.ReactNode;
    /** Whether initially open */
    defaultOpen?: boolean;
    /** Disabled */
    disabled?: boolean;
  }[];
  /** Whether to allow multiple open at once */
  allowMultiple?: boolean;
  /** Variant */
  variant?: 'default' | 'borderless' | 'bg';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Icon position */
  iconPosition?: 'end' | 'start';
  /** Custom class name */
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  variant = 'default',
  size = 'md',
  iconPosition = 'end',
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(items.filter((item) => item.defaultOpen).map((item) => item.id))
  );

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`accordion ${variant} ${size} ${iconPosition === 'start' ? 'accordion-trigger-start' : ''} ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div key={item.id} className="accordion-item">
            <button
              className="accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
            >
              {item.trigger}
              <svg
                className="accordion-trigger-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
