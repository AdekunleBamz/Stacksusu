import React, { useState, useCallback, useRef, useEffect, type KeyboardEvent } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './SearchBar.css';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface SearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Search callback with debounced query */
  onSearch: (query: string) => Promise<SearchResult[]> | SearchResult[];
  /** Filter options */
  filters?: { label: string; value: string }[];
  /** Currently selected filter */
  selectedFilter?: string;
  /** Filter change callback */
  onFilterChange?: (filter: string) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show filters */
  showFilters?: boolean;
  /** Maximum results to show */
  maxResults?: number;
  /** Custom class name */
  className?: string;
  /** Loading state override */
  isLoading?: boolean;
  /** Clear search when query is empty */
  clearOnSelect?: boolean;
  /** Custom no results message */
  noResultsMessage?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  filters = [],
  selectedFilter,
  onFilterChange,
  size = 'md',
  showFilters = false,
  maxResults = 5,
  className = '',
  isLoading: controlledLoading,
  clearOnSelect = true,
  noResultsMessage = 'No results found',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(query);
        setResults(searchResults.slice(0, maxResults));
        setHighlightedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, onSearch, query, maxResults]);

  // Show dropdown when we have results or loading
  useEffect(() => {
    const shouldShow = (query.trim() !== '') || (controlledLoading ?? false);
    setIsOpen(shouldShow && results.length > 0);
  }, [query, results, controlledLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleResultClick = useCallback((result: SearchResult) => {
    result.onClick?.();
    if (clearOnSelect) {
      setQuery('');
      setResults([]);
    }
    setIsOpen(false);
    inputRef.current?.focus();
  }, [clearOnSelect]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleResultClick(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`searchbar-container ${className}`}>
      <div className="searchbar-input-wrapper">
        <svg
          className="searchbar-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        
        <input
          ref={inputRef}
          type="text"
          className={`searchbar-input ${size}`}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          aria-label="Search"
          aria-expanded={isOpen}
          aria-controls="search-results"
        />
        
        {query && (
          <button
            className="searchbar-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="searchbar-filters">
          {filters.map(filter => (
            <button
              key={filter.value}
              className={`searchbar-filter-chip ${selectedFilter === filter.value ? 'active' : ''}`}
              onClick={() => onFilterChange?.(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="searchbar-results" id="search-results">
          {isLoading ? (
            <div className="searchbar-loading">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={result.id}
                className={`searchbar-result-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {result.icon && <span>{result.icon}</span>}
                <div>
                  <div>{result.title}</div>
                  {result.subtitle && (
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{result.subtitle}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="searchbar-no-results">{noResultsMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
