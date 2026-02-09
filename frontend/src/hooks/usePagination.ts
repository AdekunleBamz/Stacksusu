import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationOptions {
  /** Initial page */
  initialPage?: number;
  /** Items per page */
  pageSize?: number;
  /** Total items count */
  total?: number;
}

export interface UsePaginationResult {
  /** Current page */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total pages */
  totalPages: number;
  /** Total items */
  total: number;
  /** Whether there's a next page */
  hasNextPage: boolean;
  /** Whether there's a previous page */
  hasPrevPage: boolean;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Go to specific page */
  goToPage: (page: number) => void;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Slice items for current page */
  sliceItems: <T>(items: T[]) => T[];
  /** Calculate offset for current page */
  getOffset: () => number;
}

/**
 * Hook for managing pagination
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationResult {
  const { initialPage = 1, pageSize: initialPageSize = 10, total = 0 } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((p) => p + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage((p) => p - 1);
    }
  }, [hasPrevPage]);

  const goToPage = useCallback((targetPage: number) => {
    const validPage = Math.max(1, Math.min(targetPage, totalPages));
    setPage(validPage);
  }, [totalPages]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1); // Reset to first page
  }, []);

  const getOffset = useCallback(() => {
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  const sliceItems = useCallback(
    <T>(items: T[]): T[] => {
      const offset = getOffset();
      return items.slice(offset, offset + pageSize);
    },
    [getOffset, pageSize]
  );

  return {
    page,
    pageSize,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    sliceItems,
    getOffset,
  };
}

export default usePagination;
