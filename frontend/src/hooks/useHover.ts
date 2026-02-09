import { useState, useRef } from 'react';
import { useEventListener } from './useEventListener';

/**
 * Hook to track hover state
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T>,
  boolean
] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEventListener('mouseenter', () => setIsHovered(true), undefined, ref);
  useEventListener('mouseleave', () => setIsHovered(false), undefined, ref);

  return [ref, isHovered];
}

export default useHover;
