/**
 * useOnClickOutside Hook
 * 
 * Detects clicks outside a specified element. Commonly used for
 * closing dropdowns, modals, and popovers.
 * 
 * @module hooks/useOnClickOutside
 */

import { useEffect, useRef, useCallback, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Hook to detect clicks outside an element
 * 
 * @param ref - React ref to the element to monitor
 * @param handler - Callback function when click outside is detected
 * @param enabled - Whether the listener is enabled (default: true)
 * 
 * @example
 * ```tsx
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *   
 *   useOnClickOutside(dropdownRef, () => setIsOpen(false), isOpen);
 *   
 *   return (
 *     <div ref={dropdownRef}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <div className="menu">...</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: Handler,
  enabled: boolean = true
): void {
  // Use a ref to store the handler to avoid recreating the listener
  const handlerRef = useRef<Handler>(handler);
  
  // Update handler ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      
      // Do nothing if clicking ref's element or its descendants
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, enabled]);
}

/**
 * Hook variant that supports multiple refs
 * 
 * @param refs - Array of refs to monitor
 * @param handler - Callback function when click outside all refs
 * @param enabled - Whether the listener is enabled
 */
export function useOnClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T | null>[],
  handler: Handler,
  enabled: boolean = true
): void {
  const handlerRef = useRef<Handler>(handler);
  
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Check if click is inside any of the refs
      const isClickInside = refs.some((ref) => {
        const el = ref?.current;
        return el && el.contains(event.target as Node);
      });

      if (!isClickInside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, enabled]);
}

/**
 * Hook that creates and returns the ref automatically
 * 
 * @param handler - Callback function when click outside is detected
 * @param enabled - Whether the listener is enabled
 * @returns React ref to attach to the element
 * 
 * @example
 * ```tsx
 * function Modal({ onClose }) {
 *   const modalRef = useClickOutsideRef<HTMLDivElement>(onClose);
 *   
 *   return <div ref={modalRef} className="modal">...</div>;
 * }
 * ```
 */
export function useClickOutsideRef<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  enabled: boolean = true
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useOnClickOutside(ref, handler, enabled);
  return ref;
}

/**
 * Hook for handling escape key press in addition to click outside
 * 
 * @param ref - React ref to the element
 * @param handler - Callback function
 * @param enabled - Whether the listener is enabled
 */
export function useOnClickOutsideOrEscape<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: Handler,
  enabled: boolean = true
): void {
  const handlerRef = useRef<Handler>(handler);
  
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // Click outside listener
  useOnClickOutside(ref, handler, enabled);

  // Escape key listener
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handlerRef.current(event as unknown as MouseEvent);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [enabled]);
}

export default useOnClickOutside;
