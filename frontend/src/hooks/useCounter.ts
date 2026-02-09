import { useState, useCallback } from 'react';

/**
 * Hook for managing a counter
 */
export function useCounter(
  initialValue = 0,
  options: {
    min?: number;
    max?: number;
  } = {}
): {
  value: number;
  increment: (delta?: number) => void;
  decrement: (delta?: number) => void;
  setValue: (value: number | ((prev: number) => number)) => void;
  reset: () => void;
} {
  const { min, max } = options;
  const [value, setValue] = useState(initialValue);

  const increment = useCallback(
    (delta = 1) => {
      setValue((prev) => {
        const newValue = prev + delta;
        if (max !== undefined) {
          return Math.min(newValue, max);
        }
        return newValue;
      });
    },
    [max]
  );

  const decrement = useCallback(
    (delta = 1) => {
      setValue((prev) => {
        const newValue = prev - delta;
        if (min !== undefined) {
          return Math.max(newValue, min);
        }
        return newValue;
      });
    },
    [min]
  );

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, increment, decrement, setValue, reset };
}

export default useCounter;
