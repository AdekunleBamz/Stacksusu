import { useState, useMemo, useCallback } from 'react';

export interface SearchItem<T> {
  id: string | number;
  [key: string]: unknown;
}

/**
 * Options for useLocalSearch hook
 */
export interface UseLocalSearchOptions<T> {
  /** The items to search through */
  items: T[];
  /** Keys to search in (supports nested with dot notation) */
  searchKeys: (keyof T | string)[];
  /** Case sensitive search */
  caseSensitive?: boolean;
  /** Minimum characters to trigger search */
  minChars?: number;
  /** Maximum results to return */
  maxResults?: number;
  /** Whether to sort results by relevance */
  sortByRelevance?: boolean;
}

/**
 * Result from useLocalSearch hook
 */
export interface UseLocalSearchResult<T> {
  /** Search query */
  query: string;
  /** Set search query */
  setQuery: (query: string) => void;
  /** Clear search */
  clear: () => void;
  /** Filtered items */
  results: T[];
  /** Whether there are results */
  hasResults: boolean;
  /** Total item count */
  totalCount: number;
  /** Result count */
  resultCount: number;
}

/**
 * Hook for searching through a local array of items
 */
export function useLocalSearch<T extends SearchItem<T>>(
  options: UseLocalSearchOptions<T>
): UseLocalSearchResult<T> {
  const {
    items,
    searchKeys,
    caseSensitive = false,
    minChars = 0,
    maxResults = 0,
    sortByRelevance = true,
  } = options;

  const [query, setQuery] = useState('');

  const getNestedValue = useCallback((obj: unknown, path: string): string => {
    const keys = path.split('.');
    let value: unknown = obj;
    
    for (const key of keys) {
      if (value === null || value === undefined) {
        return '';
      }
      value = (value as Record<string, unknown>)[key];
    }
    
    return String(value ?? '');
  }, []);

  const search = useCallback((searchQuery: string): T[] => {
    if (!searchQuery.trim() || searchQuery.length < minChars) {
      return items;
    }

    const normalizedQuery = caseSensitive ? searchQuery : searchQuery.toLowerCase();
    const results: { item: T; relevance: number }[] = [];

    for (const item of items) {
      let matchFound = false;
      let relevance = 0;

      for (const key of searchKeys) {
        const value = getNestedValue(item, String(key));
        const normalizedValue = caseSensitive ? value : value.toLowerCase();

        if (value.includes(normalizedQuery)) {
          matchFound = true;
          
          // Calculate relevance based on match position
          const index = normalizedValue.indexOf(normalizedQuery);
          relevance = Math.max(
            relevance,
            1000 - index + normalizedValue.length - normalizedQuery.length
          );

          // Boost relevance for exact matches
          if (value === normalizedQuery) {
            relevance += 500;
          }
          
          // Boost relevance for starts with matches
          if (value.startsWith(normalizedQuery)) {
            relevance += 200;
          }
        }
      }

      if (matchFound) {
        results.push({ item, relevance });
      }
    }

    if (sortByRelevance) {
      results.sort((a, b) => b.relevance - a.relevance);
    }

    const finalResults = results.map((r) => r.item);
    return maxResults > 0 ? finalResults.slice(0, maxResults) : finalResults;
  }, [items, searchKeys, caseSensitive, minChars, maxResults, sortByRelevance, getNestedValue]);

  const results = useMemo(
    () => search(query),
    [query, search]
  );

  const clear = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    clear,
    results,
    hasResults: results.length > 0,
    totalCount: items.length,
    resultCount: results.length,
  };
}

export default useLocalSearch;
