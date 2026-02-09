import React from 'react';
import './Spinner.css';

export interface SpinnerProps {
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'white';
  /** Whether to show as pulse */
  pulse?: boolean;
  /** Label text */
  label?: string;
  /** Whether to show in fullscreen overlay */
  fullscreen?: boolean;
  /** Overlay variant */
  overlayVariant?: 'light' | 'dark';
  /** Custom class name */
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  pulse = false,
  label,
  fullscreen = false,
  overlayVariant = 'light',
  className = '',
}) => {
  const spinnerContent = (
    <div className={`spinner ${size} ${variant} ${pulse ? 'pulse' : ''} ${className}`} role="status" aria-label={label || 'Loading'}>
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className={`spinner-overlay ${overlayVariant === 'dark' ? 'dark' : ''}`}>
        {spinnerContent}
        {label && <div className="spinner-overlay-label" style={{ marginTop: 16, color: overlayVariant === 'dark' ? 'white' : '#374151' }}>{label}</div>}
      </div>
    );
  }

  if (label) {
    return (
      <div className="spinner-wrapper">
        {spinnerContent}
        <span className="spinner-label">{label}</span>
      </div>
    );
  }

  return spinnerContent;
};

export default Spinner;
