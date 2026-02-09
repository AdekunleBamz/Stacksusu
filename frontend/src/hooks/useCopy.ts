import { useState, useCallback, useRef } from 'react';

export interface UseCopyOptions {
  /** Duration in milliseconds to show success state */
  successDuration?: number;
}

export interface UseCopyResult {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Whether the copy operation was successful */
  isSuccess: boolean;
  /** Whether the copy operation is in progress */
  isLoading: boolean;
  /** Error message if copy failed */
  error: Error | null;
  /** Reset success state */
  reset: () => void;
}

/**
 * Hook for copying text to clipboard
 */
export function useCopy(options: UseCopyOptions = {}): UseCopyResult {
  const { successDuration = 2000 } = options;
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await navigator.clipboard.writeText(text);
      setIsSuccess(true);

      // Reset success state after duration
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsSuccess(false);
      }, successDuration);

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy');
      setError(error);
      setIsSuccess(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [successDuration]);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    copy,
    isSuccess,
    isLoading,
    error,
    reset,
  };
}

export default useCopy;
