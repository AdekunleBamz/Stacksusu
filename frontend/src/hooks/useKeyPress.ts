import { useState, useEffect, useCallback, type RefObject } from 'react';

export interface KeyPressOptions {
  /** Whether the target element must be focused */
  target?: 'window' | 'document' | RefObject<HTMLElement>;
  /** Event types to listen to */
  eventTypes?: ('keydown' | 'keyup' | 'keypress')[];
  /** Modifier keys that must be pressed */
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
  /** Whether to prevent default event behavior */
  preventDefault?: boolean;
}

/**
 * Hook for detecting key presses
 */
export function useKeyPress(
  key: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: KeyPressOptions = {}
): void {
  const {
    target = 'window',
    eventTypes = ['keydown'],
    modifiers = {},
    preventDefault = false,
  } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Check modifiers
      const { ctrl, alt, shift, meta } = modifiers;
      
      if (ctrl && !event.ctrlKey) return;
      if (alt && !event.altKey) return;
      if (shift && !event.shiftKey) return;
      if (meta && !event.metaKey) return;

      // Check key
      const keys = Array.isArray(key) ? key : [key];
      const isMatch = keys.some(
        (k) => k.toLowerCase() === event.key.toLowerCase()
      );

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [key, callback, modifiers, preventDefault]
  );

  useEffect(() => {
    let element: HTMLElement | Window | Document | null = null;

    if (target === 'window') {
      element = window;
    } else if (target === 'document') {
      element = document;
    } else if (target && 'current' in target) {
      element = target.current;
    }

    if (!element) return;

    eventTypes.forEach((eventType) => {
      element?.addEventListener(eventType, handleKeyPress);
    });

    return () => {
      eventTypes.forEach((eventType) => {
        element?.removeEventListener(eventType, handleKeyPress);
      });
    };
  }, [target, eventTypes, handleKeyPress]);
}

/**
 * Hook that returns the current pressed key
 */
export function usePressedKeys(): Set<string> {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((prev) => new Set(prev).add(event.key.toLowerCase()));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(event.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return pressedKeys;
}

export default useKeyPress;
