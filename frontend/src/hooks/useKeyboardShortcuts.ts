/**
 * useKeyboardShortcuts - A hook for managing keyboard shortcuts
 * 
 * Provides a way to define and manage keyboard shortcuts with:
 * - Multiple shortcut combinations per action
 * - Scope control (global vs. local)
 * - Enabled/disabled state
 * - Proper event cleanup
 * 
 * @module hooks/useKeyboardShortcuts
 */

import { useEffect, useCallback, useRef, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

/** Modifier keys that can be combined */
export type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta' | 'mod';

/** Single key combination */
export interface KeyCombination {
  /** Modifier keys (order doesn't matter) */
  modifiers?: ModifierKey[];
  /** Main key (required) */
  key: string;
  /** Case-sensitive key matching */
  caseSensitive?: boolean;
}

/** Keyboard shortcut definition */
export interface KeyboardShortcut {
  /** Unique identifier for the shortcut */
  id: string;
  /** Human-readable description (for help UI) */
  description: string;
  /** Key combination(s) that trigger this action */
  keyCombo: KeyCombination | KeyCombination[];
  /** Callback when shortcut is triggered */
  action: () => void;
  /** Scope of the shortcut */
  scope?: 'global' | 'local';
  /** Whether the shortcut is enabled */
  enabled?: boolean;
  /** Priority for conflicting shortcuts (higher =优先) */
  priority?: number;
}

/** Convert modifier keys to their browser equivalents */
const MODIFIER_MAP: Record<ModifierKey, string> = {
  ctrl: 'Control',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
  mod: typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? 'Meta' : 'Control',
};

// ============================================================================
// Utility Functions
// ============================================================================

/** Check if a key matches a key combination */
function matchesKeyCombo(
  event: KeyboardEvent,
  combo: KeyCombination
): boolean {
  const { key, modifiers = [], caseSensitive = false } = combo;
  const targetKey = caseSensitive ? key : key.toLowerCase();
  const eventKey = caseSensitive ? event.key : event.key.toLowerCase();
  
  // Check main key
  if (targetKey !== eventKey) {
    // Handle special key names
    const specialKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'escape', 'enter', ' '];
    if (!specialKeys.includes(targetKey)) {
      return false;
    }
  }
  
  // Check modifiers
  const requiredModifiers = new Set(modifiers.map(m => MODIFIER_MAP[m]));
  const pressedModifiers = new Set<string>();
  
  if (event.ctrlKey) pressedModifiers.add('Control');
  if (event.altKey) pressedModifiers.add('Alt');
  if (event.shiftKey) pressedModifiers.add('Shift');
  if (event.metaKey) pressedModifiers.add('Meta');
  
  // Check all required modifiers are pressed
  for (const mod of requiredModifiers) {
    if (!pressedModifiers.has(mod)) {
      return false;
    }
  }
  
  // Check no extra modifiers are pressed (unless specified)
  if (modifiers.length === 0) {
    if (pressedModifiers.size > 0) return false;
  }
  
  return true;
}

/** Get key display name for UI */
export function getKeyDisplayName(key: string): string {
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    escape: 'Esc',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    enter: 'Enter',
    backspace: 'Backspace',
    delete: 'Del',
    tab: 'Tab',
    capslock: 'Caps',
    shift: 'Shift',
    control: 'Ctrl',
    alt: 'Alt',
    meta: '⌘',
    dead: 'Dead',
  };
  
  const lowerKey = key.toLowerCase();
  return keyMap[lowerKey] || key.toUpperCase();
}

/** Format shortcut for display */
export function formatShortcut(combo: KeyCombination): string {
  const parts: string[] = [];
  
  if (combo.modifiers) {
    combo.modifiers.forEach(mod => {
      parts.push(getKeyDisplayName(MODIFIER_MAP[mod]));
    });
  }
  
  parts.push(getKeyDisplayName(combo.key));
  return parts.join('+');
}

// ============================================================================
// Hook
// ============================================================================

interface UseKeyboardShortcutsOptions {
  /** Whether the hook is enabled */
  enabled?: boolean;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Target element (defaults to window) */
  target?: HTMLElement | Window | null;
}

/**
 * Hook to manage keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true, target = typeof window !== 'undefined' ? window : null } = options;
  
  // Track which shortcuts have fired (for keyup/keydown separation)
  const pressedRef = useRef<Map<string, boolean>>(new Map());
  
  // State for dynamic shortcuts
  const [shortcutsState, setShortcutsState] = useState(shortcuts);
  
  // Update state when shortcuts change
  useEffect(() => {
    setShortcutsState(shortcuts);
  }, [shortcuts]);
  
  // Toggle shortcut enabled state
  const toggleShortcut = useCallback((id: string, enabled?: boolean) => {
    setShortcutsState(prev => 
      prev.map(s => 
        s.id === id ? { ...s, enabled: enabled ?? !s.enabled } : s
      )
    );
  }, []);
  
  // Enable a specific shortcut
  const enableShortcut = useCallback((id: string) => {
    toggleShortcut(id, true);
  }, [toggleShortcut]);
  
  // Disable a specific shortcut
  const disableShortcut = useCallback((id: string) => {
    toggleShortcut(id, false);
  }, [toggleShortcut]);
  
  // Register new shortcut dynamically
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcutsState(prev => [...prev, shortcut]);
  }, []);
  
  // Unregister shortcut
  const unregisterShortcut = useCallback((id: string) => {
    setShortcutsState(prev => prev.filter(s => s.id !== id));
  }, []);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Ignore if user is typing in an input
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || 
                   target.tagName === 'TEXTAREA' || 
                   target.tagName === 'SELECT' ||
                   target.isContentEditable;
    
    if (isInput) return;
    
    // Find matching shortcuts
    const matchingShortcuts = shortcutsState
      .filter(s => s.enabled !== false)
      .filter(s => {
        const combos = Array.isArray(s.keyCombo) ? s.keyCombo : [s.keyCombo];
        return combos.some(combo => matchesKeyCombo(event, combo));
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    // Execute first matching shortcut
    if (matchingShortcuts.length > 0) {
      const shortcut = matchingShortcuts[0];
      
      // Check if already pressed (for keydown repeat)
      const shortcutId = `${shortcut.id}-${event.key}`;
      if (pressedRef.current.get(shortcutId)) {
        return;
      }
      pressedRef.current.set(shortcutId, true);
      
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      shortcut.action();
    }
  }, [enabled, preventDefault, shortcutsState]);
  
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // Clear pressed state
    shortcutsState.forEach(s => {
      const combos = Array.isArray(s.keyCombo) ? s.keyCombo : [s.keyCombo];
      combos.forEach(combo => {
        const shortcutId = `${s.id}-${event.key}`;
        pressedRef.current.delete(shortcutId);
      });
    });
  }, [shortcutsState]);
  
  useEffect(() => {
    if (!target) return;
    
    const handleKD = (event: Event) => handleKeyDown(event as KeyboardEvent);
    const handleKU = (event: Event) => handleKeyUp(event as KeyboardEvent);
    
    target.addEventListener('keydown', handleKD);
    target.addEventListener('keyup', handleKU);
    
    return () => {
      target.removeEventListener('keydown', handleKD);
      target.removeEventListener('keyup', handleKU);
    };
  }, [target, handleKeyDown, handleKeyUp]);
  
  return {
    /** Toggle a shortcut's enabled state */
    toggleShortcut,
    /** Enable a specific shortcut */
    enableShortcut,
    /** Disable a specific shortcut */
    disableShortcut,
    /** Register a new shortcut dynamically */
    registerShortcut,
    /** Unregister a shortcut */
    unregisterShortcut,
    /** Format a key combination for display */
    formatShortcut,
    /** Get display name for a key */
    getKeyDisplayName,
  };
}

// ============================================================================
// Preset Shortcuts
// ============================================================================

/** Common shortcuts preset */
export const presetShortcuts = {
  save: {
    id: 'save',
    description: 'Save changes',
    keyCombo: [{ modifiers: ['ctrl', 'mod'], key: 's' }],
    action: () => {
      // Dispatch custom event for save
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stacksusu:save'));
      }
    },
  },
  escape: {
    id: 'escape',
    description: 'Close modal / Cancel',
    keyCombo: { key: 'escape' },
    action: () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stacksusu:escape'));
      }
    },
  },
  search: {
    id: 'search',
    description: 'Open search',
    keyCombo: [{ modifiers: ['ctrl', 'mod'], key: 'k' }, { modifiers: ['ctrl', 'mod'], key: '/' }],
    action: () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stacksusu:search'));
      }
    },
  },
  help: {
    id: 'help',
    description: 'Show keyboard shortcuts help',
    keyCombo: { key: '?' },
    action: () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stacksusu:help'));
      }
    },
  },
};

export default useKeyboardShortcuts;
