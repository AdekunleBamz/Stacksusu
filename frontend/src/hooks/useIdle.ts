import { useState, useEffect, useCallback } from 'react';

export interface UseIdleOptions {
  /** Time in ms before considering the user idle */
  idleTimeout?: number;
  /** Events to listen to for activity */
  events?: string[];
}

/**
 * Hook to detect if the user is idle
 */
export function useIdle(
  options: UseIdleOptions = {}
): boolean {
  const {
    idleTimeout = 30000,
    events = ['mousedown', 'keydown', 'scroll', 'touchstart'],
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    const checkIdle = () => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity >= idleTimeout) {
        setIsIdle(true);
      }
    };

    // Set up interval to check idle state
    const intervalId = setInterval(checkIdle, 1000);

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(intervalId);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [idleTimeout, events, resetTimer, lastActivity]);

  return isIdle;
}

export default useIdle;
