import React from 'react';
import './Stepper.css';

export interface Step {
  /** Step ID */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
}

export interface StepperProps {
  /** Steps */
  steps: Step[];
  /** Current step index */
  currentStep: number;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether steps are clickable */
  clickable?: boolean;
  /** Step click handler */
  onStepClick?: (stepIndex: number) => void;
  /** Custom class name */
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  clickable = false,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`stepper ${orientation} ${size} ${clickable ? 'clickable' : ''} ${className}`}>
      <div className="stepper-steps">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isClickable = clickable && index <= currentStep;

          return (
            <div
              key={step.id}
              className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isClickable && onStepClick?.(index)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
            >
              <div className="step-connector" />
              
              <div className="step-indicator">
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                {step.description && (
                  <div className="step-description">{step.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
