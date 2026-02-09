import { useEffect, useState, useCallback } from 'react';

export function useKeyPress(targetKey: string | string[]): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

    const downHandler = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        e.preventDefault();
        setPressed(true);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        setPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return pressed;
}

export function useKeyPressWithCallback(
  targetKey: string | string[],
  callback: (event: KeyboardEvent) => void
): void {
  useEffect(() => {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

    const handler = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [targetKey, callback]);
}
