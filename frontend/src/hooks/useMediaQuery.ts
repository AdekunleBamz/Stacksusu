import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for matching a media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Support older browsers
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    } else {
      mediaQuery.addEventListener('change', handleChange);
    }

    // Initial check
    setMatches(mediaQuery.matches);

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      } else {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
}

// Common breakpoints
export function usePrefersDark(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function usePrefersLight(): boolean {
  return useMediaQuery('(prefers-color-scheme: light)');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function usePrefersReducedData(): boolean {
  return useMediaQuery('(prefers-reduced-data: reduce)');
}

export function usePrintMode(): boolean {
  return useMediaQuery('print');
}

export function useScreen(): boolean {
  return useMediaQuery('screen');
}

export function useHover(): boolean {
  return useMediaQuery('(hover: hover)');
}

export function usePointerFine(): boolean {
  return useMediaQuery('(pointer: fine)');
}

export function usePointerCoarse(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

export default useMediaQuery;
