import { memo, useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import './AnimatedNumber.css';

interface AnimatedNumberProps {
  /** The target value to animate to */
  value: number;
  /** Duration of animation in milliseconds */
  duration?: number;
  /** Decimal places to show */
  decimals?: number;
  /** Prefix (e.g., "$", "£") */
  prefix?: string;
  /** Suffix (e.g., "%", " STX") */
  suffix?: string;
  /** Use compact notation (K, M, B) */
  compact?: boolean;
  /** Delay before starting animation in ms */
  delay?: number;
  /** Custom formatter function */
  formatter?: (value: number) => string;
  /** Animate only when element enters viewport */
  animateOnView?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Easing function for smooth animation
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Format number with compact notation
 */
function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/**
 * AnimatedNumber Component
 * 
 * Displays a number with a counting animation effect.
 * Great for stats, dashboards, and highlighting numeric achievements.
 * 
 * @example
 * ```tsx
 * <AnimatedNumber value={1250} prefix="$" suffix=" saved" />
 * <AnimatedNumber value={95} suffix="%" duration={1000} />
 * <AnimatedNumber value={2500000} compact />
 * ```
 */
const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  compact = false,
  delay = 0,
  formatter,
  animateOnView = true,
  className
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const formatValue = (val: number): string => {
    if (formatter) {
      return formatter(val);
    }
    if (compact) {
      return formatCompact(val);
    }
    return val.toFixed(decimals);
  };

  useEffect(() => {
    if (hasAnimated) return;

    const animate = () => {
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        
        setDisplayValue(easedProgress * value);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
          setHasAnimated(true);
        }
      };

      setTimeout(() => {
        animationRef.current = requestAnimationFrame(step);
      }, delay);
    };

    if (!animateOnView) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, delay, animateOnView, hasAnimated]);

  // Reset animation when value changes
  useEffect(() => {
    setHasAnimated(false);
    setDisplayValue(0);
  }, [value]);

  return (
    <span ref={elementRef} className={clsx('animated-number', className)}>
      {prefix}
      {formatValue(displayValue)}
      {suffix}
    </span>
  );
});

export { AnimatedNumber };
export default AnimatedNumber;
