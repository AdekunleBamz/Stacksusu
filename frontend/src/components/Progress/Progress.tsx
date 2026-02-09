import React from 'react';
import './Progress.css';

export interface ProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Variant */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** Whether to show label */
  showLabel?: boolean;
  /** Custom label */
  label?: string;
  /** Whether is indeterminate */
  indeterminate?: boolean;
  /** Whether to show striped pattern */
  striped?: boolean;
  /** Whether to animate striped */
  animateStriped?: boolean;
  /** Custom class name */
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  indeterminate = false,
  striped = false,
  animateStriped = false,
  className = '',
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`progress ${size} ${variant} ${striped ? 'striped' : ''} ${animateStriped ? 'animate' : ''} ${className}`}>
      {showLabel && (
        <div className="progress-label">
          <span>{label || `${Math.round(percent)}%`}</span>
        </div>
      )}
      
      <div className="progress-bar">
        <div
          className={`progress-fill ${indeterminate ? 'indeterminate' : ''}`}
          style={{ width: indeterminate ? '50%' : `${percent}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

/**
 * Circular Progress Component
 */
export interface CircularProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Variant color */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** Whether to show value text */
  showValue?: boolean;
  /** Custom value formatter */
  valueFormatter?: (percent: number) => string;
  /** Label text */
  label?: string;
  /** Custom class name */
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showValue = true,
  valueFormatter = (v) => `${Math.round(v)}%`,
  label,
  className = '',
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  
  const colors = {
    primary: 'var(--color-primary, #6366f1)',
    success: 'var(--color-success, #10b981)',
    warning: 'var(--color-warning, #f59e0b)',
    error: 'var(--color-danger, #ef4444)',
  };

  return (
    <div className={`progress-circular ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="progress-circular-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-circular-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      
      {(showValue || label) && (
        <div className="progress-circular-content">
          {showValue && (
            <span className="progress-circular-value">
              {valueFormatter(percent)}
            </span>
          )}
          {label && (
            <span className="progress-circular-label">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Progress;
