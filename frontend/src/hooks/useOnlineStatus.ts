import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for tracking online/offline status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return isOnline;
}

/**
 * Hook for tracking connection type
 */
export function useConnectionType(): string | undefined {
  const [connectionType, setConnectionType] = useState<string | undefined>(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as Navigator & { connection: { effectiveType?: string } }).connection;
      return conn?.effectiveType;
    }
    return undefined;
  });

  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as Navigator & { connection: { effectiveType?: string; addEventListener?: (event: string, handler: () => void) => void; removeEventListener?: (event: string, handler: () => void) => void } }).connection;
      
      const handleChange = () => {
        setConnectionType(conn?.effectiveType);
      };

      conn?.addEventListener?.('change', handleChange);

      return () => {
        conn?.removeEventListener?.('change', handleChange);
      };
    }
  }, []);

  return connectionType;
}

/**
 * Hook for checking if connection is fast
 */
export function useIsFastConnection(): boolean {
  const connectionType = useConnectionType();
  // 4g = fast, 3g = slow
  return connectionType === '4g' || connectionType === '3g' || connectionType === '2g' ? false : true;
}

export default useOnlineStatus;
