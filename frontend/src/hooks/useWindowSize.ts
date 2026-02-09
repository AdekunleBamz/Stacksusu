import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook for getting window size
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook for checking if window matches a breakpoint
 */
export function useBreakpoint(breakpoint: number): boolean {
  const { width } = useWindowSize();
  return width >= breakpoint;
}

// Predefined breakpoints
export function useIsMobile(): boolean {
  return useBreakpoint(640);
}

export function useIsTablet(): boolean {
  return useBreakpoint(768);
}

export function useIsDesktop(): boolean {
  return useBreakpoint(1024);
}

export function useIsLargeDesktop(): boolean {
  return useBreakpoint(1280);
}

export default useWindowSize;
