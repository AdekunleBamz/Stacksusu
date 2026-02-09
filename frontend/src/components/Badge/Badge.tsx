import React from 'react';
import './Badge.css';

export interface BadgeProps {
  /** Badge content */
  children?: React.ReactNode;
  /** Variant style */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline-default' | 'outline-primary' | 'outline-success' | 'outline-warning' | 'outline-danger';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Shape */
  shape?: 'pill' | 'square';
  /** Whether to show dot indicator */
  dot?: boolean;
  /** Dot color (for default variant) */
  dotColor?: string;
  /** Whether to animate pulse */
  pulse?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Custom class name */
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'pill',
  dot = false,
  dotColor,
  pulse = false,
  onClick,
  icon,
  className = '',
}) => {
  const dotStyle = dotColor ? { background: dotColor } : {};

  return (
    <span
      className={`badge ${variant} ${size} ${shape} ${pulse ? 'pulse' : ''} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {dot && <span className="badge-dot" style={dotStyle} />}
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
