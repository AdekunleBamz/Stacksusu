import React from 'react';
import './Card.css';

export interface CardProps {
  /** Card header content */
  header?: React.ReactNode;
  /** Card title (used with header) */
  title?: string;
  /** Card subtitle (used with header) */
  subtitle?: string;
  /** Card body content */
  children?: React.ReactNode;
  /** Card footer content */
  footer?: React.ReactNode;
  /** Image URL */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Variant style */
  variant?: 'default' | 'flat' | 'elevated';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether card is interactive */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom class name */
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  header,
  title,
  subtitle,
  children,
  footer,
  image,
  imageAlt = '',
  variant = 'default',
  size = 'md',
  interactive = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`card ${variant} ${size} ${interactive ? 'interactive' : ''} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {image && (
        <img src={image} alt={imageAlt} className="card-image" />
      )}
      
      {(header || title) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {header}
        </div>
      )}
      
      {children && <div className="card-body">{children}</div>}
      
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
