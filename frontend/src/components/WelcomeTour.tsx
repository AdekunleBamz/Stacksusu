import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Circle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import './WelcomeTour.css';

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  image?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface WelcomeTourProps {
  /** Array of tour steps */
  steps: TourStep[];
  /** Whether the tour is active */
  isOpen?: boolean;
  /** Callback when tour is closed */
  onClose?: () => void;
  /** Callback when tour is completed */
  onComplete?: () => void;
  /** Storage key for persisting completion state */
  storageKey?: string;
  /** Additional class name */
  className?: string;
}

/**
 * WelcomeTour Component
 * 
 * Guided onboarding tour for first-time users.
 * Highlights key features and explains how to use the app.
 */
const WelcomeTour = memo(function WelcomeTour({
  steps,
  isOpen: controlledIsOpen,
  onClose,
  onComplete,
  storageKey = 'stacksusu-tour-completed',
  className
}: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : isVisible;

  // Check if tour was already completed
  useEffect(() => {
    if (!isControlled) {
      const completed = localStorage.getItem(storageKey);
      if (!completed) {
        setIsVisible(true);
      }
    }
  }, [storageKey, isControlled]);

  // Find and highlight target element
  useEffect(() => {
    if (!isOpen) return;

    const step = steps[currentStep];
    if (step.targetSelector) {
      const target = document.querySelector(step.targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep, steps]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  const handleComplete = useCallback(() => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  }, [storageKey, onComplete]);

  const goToNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, steps.length, handleComplete]);

  const goToPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((index: number) => {
    setCurrentStep(index);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowRight':
        case 'Enter':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, handleClose]);

  if (!isOpen || steps.length === 0) return null;

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={clsx('welcome-tour', className)}>
      {/* Backdrop with spotlight effect */}
      <div className="welcome-tour__backdrop" onClick={handleClose}>
        {targetRect && (
          <div 
            className="welcome-tour__spotlight"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className={clsx(
          'welcome-tour__tooltip',
          `welcome-tour__tooltip--${step.position || 'center'}`,
          !targetRect && 'welcome-tour__tooltip--centered'
        )}
        style={targetRect ? {
          top: step.position === 'top' ? targetRect.top - 16 : 
               step.position === 'bottom' ? targetRect.bottom + 16 : 
               targetRect.top + targetRect.height / 2,
          left: step.position === 'left' ? targetRect.left - 16 : 
                step.position === 'right' ? targetRect.right + 16 : 
                targetRect.left + targetRect.width / 2,
        } : undefined}
      >
        <button 
          className="welcome-tour__close" 
          onClick={handleClose}
          aria-label="Close tour"
        >
          <X size={18} />
        </button>

        {step.image && (
          <div className="welcome-tour__image">
            <img src={step.image} alt={step.title} />
          </div>
        )}

        <div className="welcome-tour__content">
          <h3 className="welcome-tour__title">{step.title}</h3>
          <p className="welcome-tour__description">{step.description}</p>
        </div>

        {/* Progress indicators */}
        <div className="welcome-tour__progress">
          <div className="welcome-tour__dots">
            {steps.map((_, index) => (
              <button
                key={index}
                className={clsx(
                  'welcome-tour__dot',
                  index === currentStep && 'welcome-tour__dot--active',
                  index < currentStep && 'welcome-tour__dot--completed'
                )}
                onClick={() => goToStep(index)}
                aria-label={`Go to step ${index + 1}`}
              >
                {index < currentStep ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <Circle size={12} />
                )}
              </button>
            ))}
          </div>
          <span className="welcome-tour__step-counter">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Navigation */}
        <div className="welcome-tour__nav">
          <button
            className="welcome-tour__nav-btn welcome-tour__nav-btn--secondary"
            onClick={isFirstStep ? handleClose : goToPrev}
          >
            {isFirstStep ? 'Skip' : <><ChevronLeft size={16} /> Back</>}
          </button>
          <button
            className="welcome-tour__nav-btn welcome-tour__nav-btn--primary"
            onClick={goToNext}
          >
            {isLastStep ? 'Get Started' : <>Next <ChevronRight size={16} /></>}
          </button>
        </div>

        {/* Progress bar */}
        <div className="welcome-tour__progress-bar">
          <div 
            className="welcome-tour__progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
});

export { WelcomeTour };
export type { TourStep, WelcomeTourProps };
export default WelcomeTour;
