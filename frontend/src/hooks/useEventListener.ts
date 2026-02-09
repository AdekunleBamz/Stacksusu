import { useEffect, useRef } from 'react';

/**
 * Hook to add an event listener
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
): void;

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
  element?: React.RefObject<T>
): void;

export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions,
  element?: React.RefObject<HTMLElement>
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const target = element?.current ?? window;
    target.addEventListener(eventName, savedHandler.current, options);
    return () => target.removeEventListener(eventName, savedHandler.current, options);
  }, [eventName, element, options]);
}

export default useEventListener;
