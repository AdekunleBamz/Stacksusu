import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
}

export function usePagination(
  total: number,
  options: UsePaginationOptions = {}
): UsePaginationResult {
  const { pageSize = 10, initialPage = 1 } = options;
  const [page, setPageState] = useState(initialPage);
  
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  
  const setPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPageState(validPage);
  }, [totalPages]);
  
  const setPageSize = useCallback((newSize: number) => {
    setPageState(1);
  }, []);
  
  const next = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);
  
  const prev = useCallback(() => {
    setPage(page - 1);
  }, [page, setPage]);
  
  const first = useCallback(() => {
    setPage(1);
  }, [setPage]);
  
  const last = useCallback(() => {
    setPage(totalPages);
  }, [setPage, totalPages]);
  
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    setPage,
    setPageSize,
    next,
    prev,
    first,
    last,
  };
}
