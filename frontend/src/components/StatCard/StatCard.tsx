import React from 'react';
import './StatCard.css';

export interface StatCardProps {
  /** Icon to display */
  icon?: React.ReactNode;
  /** Main value to display */
  value: string | number;
  /** Label for the stat */
  label: string;
  /** Optional description */
  description?: string;
  /** Trend information */
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Style variant */
  variant?: 'default' | 'outlined' | 'gradient';
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom class name */
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  description,
  trend,
  size = 'md',
  variant = 'default',
  clickable = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`stat-card ${size} ${variant} ${clickable ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="stat-card-header">
        {icon && <div className="stat-card-icon">{icon}</div>}
        {trend && (
          <div
            className={`stat-card-trend ${
              trend.isPositive ? 'positive' : 'negative'
            }`}
          >
            {trend.isPositive ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      
      {description && (
        <div className="stat-card-description">{description}</div>
      )}
    </div>
  );
};

export default StatCard;
