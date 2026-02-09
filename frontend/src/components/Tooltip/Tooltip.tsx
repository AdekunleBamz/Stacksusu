import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

export interface TooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Child element */
  children: React.ReactElement;
  /** Position */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show arrow */
  showArrow?: boolean;
  /** Animation type */
  animation?: 'fade' | 'slide' | 'none';
  /** Delay before showing (ms) */
  delay?: number;
  /** Custom class name */
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  size = 'md',
  showArrow = true,
  animation = 'fade',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone child element with event handlers
  const childWithProps = React.cloneElement(children, {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    'aria-describedby': isVisible ? 'tooltip' : undefined,
  });

  return (
    <div className={`tooltip ${size} ${animation !== 'none' ? 'has-animation' : ''} ${className}`}>
      {childWithProps}
      <div
        ref={tooltipRef}
        id="tooltip"
        className={`tooltip-content ${position} ${animation} ${showArrow ? 'has-arrow' : ''} ${isVisible ? 'visible' : ''}`}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
