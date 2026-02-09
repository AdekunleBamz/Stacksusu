import React from 'react';
import './Badge.css';

export interface BadgeProps {
  /** Badge content */
  children?: React.ReactNode;
  /** Badge variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'solid';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show dot indicator */
  dot?: boolean;
  /** Icon */
  icon?: React.ReactNode;
  /** Shape */
  shape?: 'circle' | 'pill';
  /** Custom class name */
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  shape = 'circle',
  className = '',
}) => {
  return (
    <span className={`badge ${variant} ${size} ${shape} ${className}`}>
      {dot && <span className="badge-dot" style={{ background: 'currentColor' }} />}
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

/**
 * Notification badge component
 */
export interface NotificationBadgeProps {
  /** Count to display */
  count: number;
  /** Maximum count to show */
  max?: number;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  /** Whether to show zero */
  showZero?: boolean;
  /** Custom class name */
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  size = 'md',
  variant = 'error',
  showZero = false,
  className = '',
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span className={`notification-badge ${size} ${variant} ${className}`}>
      {displayCount}
    </span>
  );
};

export default Badge;
