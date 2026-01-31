import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  /** Key to trigger the shortcut (e.g., 'k', 'Escape', 'Enter') */
  key: string;
  /** Callback function when shortcut is triggered */
  callback: () => void;
  /** Require Ctrl/Cmd key */
  ctrlKey?: boolean;
  /** Require Shift key */
  shiftKey?: boolean;
  /** Require Alt/Option key */
  altKey?: boolean;
  /** Optional description for help menu */
  description?: string;
  /** Disable shortcut temporarily */
  disabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  /** Whether shortcuts are enabled globally */
  enabled?: boolean;
  /** Ignore shortcuts when focus is in input/textarea */
  ignoreInputs?: boolean;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
}

/**
 * Hook for managing global keyboard shortcuts
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   { key: 'k', ctrlKey: true, callback: openSearch, description: 'Open search' },
 *   { key: 'Escape', callback: closeModal, description: 'Close modal' },
 *   { key: '/', callback: focusSearch, description: 'Focus search' },
 * ]);
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
): void {
  const {
    enabled = true,
    ignoreInputs = true,
    preventDefault = true,
  } = options;

  // Store shortcuts in ref to avoid re-running effect on every render
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Skip if focus is in an input element and ignoreInputs is true
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || 
                       target.tagName === 'TEXTAREA' || 
                       target.isContentEditable;
        if (isInput) return;
      }

      for (const shortcut of shortcutsRef.current) {
        if (shortcut.disabled) continue;

        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatches = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.altKey ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          if (preventDefault) {
            event.preventDefault();
          }
          shortcut.callback();
          return;
        }
      }
    },
    [enabled, ignoreInputs, preventDefault]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Get platform-specific modifier key label
 */
export function getModifierKey(): string {
  if (typeof window !== 'undefined') {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return isMac ? '⌘' : 'Ctrl';
  }
  return 'Ctrl';
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) {
    parts.push(getModifierKey());
  }
  if (shortcut.shiftKey) {
    parts.push('Shift');
  }
  if (shortcut.altKey) {
    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    parts.push(isMac ? '⌥' : 'Alt');
  }
  
  // Format special keys
  const keyMap: Record<string, string> = {
    'escape': 'Esc',
    'enter': '↵',
    'arrowup': '↑',
    'arrowdown': '↓',
    'arrowleft': '←',
    'arrowright': '→',
    ' ': 'Space',
  };
  
  const displayKey = keyMap[shortcut.key.toLowerCase()] || shortcut.key.toUpperCase();
  parts.push(displayKey);
  
  return parts.join(' + ');
}

export type { KeyboardShortcut, UseKeyboardShortcutsOptions };
