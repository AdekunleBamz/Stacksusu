import React from 'react';
import './EmptyState.css';

export interface EmptyStateProps {
  /** Icon or illustration */
  icon?: React.ReactNode;
  /** Title */
  title: string | React.ReactNode;
  /** Description */
  description?: string | React.ReactNode;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Variant */
  variant?: 'default' | 'inline';
  /** Custom class name */
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const defaultIcon = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <div
      className={`empty-state ${size} ${variant} ${icon ? 'has-image' : ''} ${className}`}
    >
      {icon && (
        <div className="empty-state-icon">
          {icon}
        </div>
      )}
      
      <div className="empty-state-content">
        <h3 className="empty-state-title">{title}</h3>
        
        {description && (
          <p className="empty-state-description">{description}</p>
        )}
        
        {actions && (
          <div className="empty-state-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
