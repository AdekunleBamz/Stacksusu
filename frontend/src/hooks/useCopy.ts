import { useState, useCallback } from 'react';

interface UseCopyOptions {
  duration?: number;
}

interface UseCopyResult {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
}

export function useCopy(options: UseCopyOptions = {}): UseCopyResult {
  const { duration = 2000 } = options;
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
      return true;
    } catch {
      return false;
    }
  }, [duration]);

  return { copy, copied };
}
