import React, { forwardRef } from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether button is full width */
  fullWidth?: boolean;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Whether button is loading */
  loading?: boolean;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Whether button is icon-only */
  iconOnly?: boolean;
  /** Custom class name */
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      icon,
      loading = false,
      iconPosition = 'left',
      iconOnly = false,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={`btn ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${loading ? 'btn-loading' : ''} ${iconOnly ? 'icon-only' : ''} ${className}`}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <svg
            className="btn-spinner"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : icon && iconPosition === 'left' ? (
          <span className="btn-icon">{icon}</span>
        ) : null}

        {!iconOnly && children}

        {!loading && icon && iconPosition === 'right' && (
          <span className="btn-icon">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
