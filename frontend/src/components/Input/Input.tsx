import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label */
  label?: string;
  /** Whether label is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Helper text */
  helper?: string;
  /** Left addon */
  leftAddon?: React.ReactNode;
  /** Right addon */
  rightAddon?: React.ReactNode;
  /** Icon */
  icon?: React.ReactNode;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether full width */
  fullWidth?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label */
  label?: string;
  /** Whether label is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Helper text */
  helper?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Character count */
  maxLength?: number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Label */
  label?: string;
  /** Whether label is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Helper text */
  helper?: string;
  /** Options */
  options: { value: string; label: string }[];
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      error,
      helper,
      leftAddon,
      rightAddon,
      icon,
      size = 'md',
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasAddon = leftAddon || rightAddon;
    const hasIcon = !!icon;

    return (
      <div
        className={`input-wrapper ${size} ${fullWidth ? 'full-width' : ''} ${className}`}
      >
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        {hasAddon ? (
          <div className="input-addon-wrapper">
            {leftAddon && <span className="input-addon left">{leftAddon}</span>}
            <input
              ref={ref}
              className={`input-field ${error ? 'error' : ''} ${hasIcon ? 'has-icon' : ''}`}
              {...props}
            />
            {rightAddon && <span className="input-addon right">{rightAddon}</span>}
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%' }}>
            {icon && <span className="input-icon">{icon}</span>}
            <input
              ref={ref}
              className={`input-field ${error ? 'error' : ''} ${hasIcon ? 'has-icon' : ''}`}
              {...props}
            />
          </div>
        )}

        {error && <div className="input-helper input-error">{error}</div>}
        {helper && !error && <div className="input-helper">{helper}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, required, error, helper, size = 'md', maxLength, className = '', ...props }, ref) => {
    const characterCount = maxLength && props.value
      ? `${String(props.value).length}/${maxLength}`
      : undefined;

    return (
      <div className={`input-wrapper ${size} ${className}`}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`input-field textarea ${error ? 'error' : ''}`}
          maxLength={maxLength}
          {...props}
        />
        
        {characterCount && (
          <div className="input-character-count">{characterCount}</div>
        )}
        
        {error && <div className="input-helper input-error">{error}</div>}
        {helper && !error && <div className="input-helper">{helper}</div>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, required, error, helper, options, size = 'md', className = '', ...props }, ref) => {
    return (
      <div className={`input-wrapper ${size} ${className}`}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}
        
        <select
          ref={ref}
          className={`input-field select ${error ? 'error' : ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && <div className="input-helper input-error">{error}</div>}
        {helper && !error && <div className="input-helper">{helper}</div>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
