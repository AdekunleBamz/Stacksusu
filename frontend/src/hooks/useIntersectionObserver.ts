import { useState, useEffect, useRef, type RefObject } from 'react';

export interface IntersectionObserverOptions {
  /** The element to use as the viewport */
  root?: RefObject<Element> | null;
  /** Margin around the root */
  rootMargin?: string;
  /** Threshold(s) at which to trigger */
  threshold?: number | number[];
  /** Whether to trigger once */
  triggerOnce?: boolean;
}

export interface IntersectionResult {
  /** Whether the element is intersecting */
  isIntersecting: boolean;
 /** Reference to the observed element */
  ref: (node: Element | null) => void;
}

/**
 * Hook to detect when an element enters the viewport using IntersectionObserver
 */
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
): IntersectionResult {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const nodeRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = (node: Element | null) => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    nodeRef.current = node;

    if (node) {
      // Create new observer
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          const intersecting = entry.isIntersecting;
          setIsIntersecting(intersecting);

          if (triggerOnce && intersecting && observerRef.current) {
            observerRef.current.disconnect();
          }
        },
        {
          root: root?.current ?? null,
          rootMargin,
          threshold,
        }
      );

      observerRef.current.observe(node);
    }
  };

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    isIntersecting,
    ref: setRef,
  };
}

export default useIntersectionObserver;
