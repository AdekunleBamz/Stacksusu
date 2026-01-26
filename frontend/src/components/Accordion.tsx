/**
 * Accordion Component
 * 
 * Collapsible content panels for organizing information in a compact,
 * expandable format. Commonly used for FAQs and settings sections.
 * 
 * @module components/Accordion
 */

import React, { useState, useCallback, useId, createContext, useContext } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import './Accordion.css';

// =============================================================================
// Context
// =============================================================================

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
  iconStyle: 'chevron' | 'plus-minus';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
}

// =============================================================================
// Types
// =============================================================================

export interface AccordionProps {
  /** Child AccordionItem elements */
  children: React.ReactNode;
  /** Allow multiple items to be expanded simultaneously */
  allowMultiple?: boolean;
  /** Initially expanded item IDs */
  defaultExpanded?: string[];
  /** Icon style for expand/collapse indicator */
  iconStyle?: 'chevron' | 'plus-minus';
  /** Additional CSS classes */
  className?: string;
}

export interface AccordionItemProps {
  /** Unique identifier for the item */
  id: string;
  /** Header/title content */
  title: React.ReactNode;
  /** Expandable content */
  children: React.ReactNode;
  /** Custom icon for the header */
  icon?: React.ReactNode;
  /** Disable the item */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Accordion Container
// =============================================================================

/**
 * Accordion container component
 * 
 * @example
 * ```tsx
 * <Accordion allowMultiple defaultExpanded={['item-1']}>
 *   <AccordionItem id="item-1" title="What is StackSUSU?">
 *     StackSUSU is a decentralized rotating savings platform...
 *   </AccordionItem>
 *   <AccordionItem id="item-2" title="How do I join a circle?">
 *     To join a circle, navigate to the Circles page...
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({
  children,
  allowMultiple = false,
  defaultExpanded = [],
  iconStyle = 'chevron',
  className = '',
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleItem = useCallback((id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  }, [allowMultiple]);

  const contextValue: AccordionContextValue = {
    expandedItems,
    toggleItem,
    allowMultiple,
    iconStyle,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={`accordion ${className}`} role="region">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// =============================================================================
// Accordion Item
// =============================================================================

/**
 * Individual accordion panel
 */
export function AccordionItem({
  id,
  title,
  children,
  icon,
  disabled = false,
  className = '',
}: AccordionItemProps) {
  const { expandedItems, toggleItem, iconStyle } = useAccordionContext();
  const isExpanded = expandedItems.has(id);
  const headerId = useId();
  const panelId = useId();

  const handleClick = useCallback(() => {
    if (!disabled) {
      toggleItem(id);
    }
  }, [disabled, id, toggleItem]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const ExpandIcon = iconStyle === 'plus-minus' 
    ? (isExpanded ? Minus : Plus)
    : ChevronDown;

  return (
    <div 
      className={`accordion-item ${isExpanded ? 'accordion-item--expanded' : ''} ${disabled ? 'accordion-item--disabled' : ''} ${className}`}
    >
      <h3 className="accordion-item__header">
        <button
          id={headerId}
          type="button"
          className="accordion-item__trigger"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          aria-disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        >
          {icon && <span className="accordion-item__icon">{icon}</span>}
          <span className="accordion-item__title">{title}</span>
          <span 
            className={`accordion-item__indicator ${isExpanded ? 'accordion-item__indicator--expanded' : ''}`}
            aria-hidden="true"
          >
            <ExpandIcon size={18} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="accordion-item__panel"
        hidden={!isExpanded}
      >
        <div className="accordion-item__content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
