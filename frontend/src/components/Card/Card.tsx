import React from 'react';
import './Card.css';

export interface CardProps {
  /** Card children */
  children: React.ReactNode;
  /** Variant */
  variant?: 'default' | 'outlined' | 'flat' | 'elevated';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether card is hoverable */
  hoverable?: boolean;
  /** Whether card is clickable */
  clickable?: boolean;
  /** Whether card is horizontal */
  horizontal?: boolean;
  /** Image URL */
  image?: string;
  /** Click handler */
  onClick?: () => void;
  /** Custom class name */
  className?: string;
}

export interface CardHeaderProps {
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Action element */
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  hoverable = false,
  clickable = false,
  horizontal = false,
  image,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`card ${variant} ${size} ${hoverable ? 'hoverable' : ''} ${clickable ? 'clickable' : ''} ${horizontal ? 'horizontal' : ''} ${className}`}
      onClick={onClick}
    >
      {image && <img src={image} alt="" className="card-image" />}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="card-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 className="card-title">{title}</h3>
          {description && <p className="card-description">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="card-body">{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="card-footer">{children}</div>;
};

export default Card;
