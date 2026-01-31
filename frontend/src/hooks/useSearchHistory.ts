import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'stacksusu-search-history';
const MAX_HISTORY_ITEMS = 10;

interface UseSearchHistoryOptions {
  /** Maximum number of items to store */
  maxItems?: number;
  /** Custom storage key */
  storageKey?: string;
}

interface UseSearchHistoryReturn {
  /** Recent search terms */
  history: string[];
  /** Add a search term to history */
  addToHistory: (term: string) => void;
  /** Remove a specific term from history */
  removeFromHistory: (term: string) => void;
  /** Clear all search history */
  clearHistory: () => void;
}

/**
 * Hook to manage search history with localStorage persistence
 * 
 * @example
 * ```tsx
 * const { history, addToHistory, clearHistory } = useSearchHistory();
 * 
 * const handleSearch = (term: string) => {
 *   addToHistory(term);
 *   // perform search...
 * };
 * ```
 */
export function useSearchHistory(
  options: UseSearchHistoryOptions = {}
): UseSearchHistoryReturn {
  const { 
    maxItems = MAX_HISTORY_ITEMS, 
    storageKey = STORAGE_KEY 
  } = options;

  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  }, [history, storageKey]);

  const addToHistory = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      // Remove if already exists (to move to front)
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      // Add to front and limit to maxItems
      return [trimmed, ...filtered].slice(0, maxItems);
    });
  }, [maxItems]);

  const removeFromHistory = useCallback((term: string) => {
    setHistory((prev) => 
      prev.filter((item) => item.toLowerCase() !== term.toLowerCase())
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

export default useSearchHistory;
