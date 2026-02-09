import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for throttling a value
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdatedRef = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() - lastUpdatedRef.current >= interval) {
      setThrottledValue(value);
      lastUpdatedRef.current = Date.now();
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Hook for throttling a callback
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  interval: number
): T {
  const lastCalledRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const argsRef = useRef<Parameters<T>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      argsRef.current = args;

      if (now - lastCalledRef.current >= interval) {
        callback(...args);
        lastCalledRef.current = now;
      } else {
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            if (argsRef.current) {
              callback(...argsRef.current);
            }
            lastCalledRef.current = Date.now();
            timeoutRef.current = null;
          }, interval - (now - lastCalledRef.current));
        }
      }
    }) as T,
    [callback, interval]
  );
}

export default useThrottle;
