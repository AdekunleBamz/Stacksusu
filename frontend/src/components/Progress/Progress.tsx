import React from 'react';
import './Progress.css';

export interface ProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Label text */
  label?: string;
  /** Show percentage */
  showPercentage?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Style variant */
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** Whether to show striping */
  striped?: boolean;
  /** Whether to animate striping */
  animated?: boolean;
  /** Whether to use circular progress */
  circular?: boolean;
  /** Custom class name */
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'default',
  striped = false,
  animated = false,
  circular = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const strokeDashoffset = circular
    ? 2 * Math.PI * 45 * (1 - percentage / 100)
    : undefined;

  if (circular) {
    return (
      <div className={`progress-circular ${size} ${className}`}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle
            className="progress-circular-track"
            cx="50"
            cy="50"
            r="45"
            fill="none"
          />
          <circle
            className={`progress-circular-fill ${variant}`}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="progress-circular-label">
          {showPercentage ? `${Math.round(percentage)}%` : label}
        </div>
      </div>
    );
  }

  return (
    <div className={`progress-container ${className}`}>
      {(label || showPercentage) && (
        <div className="progress-label">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`progress-track ${size}`}>
        <div
          className={`progress-bar ${variant} ${striped ? 'striped' : ''} ${animated ? 'animated' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default Progress;
