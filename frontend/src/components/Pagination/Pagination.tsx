import React, { useState, useCallback } from 'react';
import './Pagination.css';

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items per page */
  pageSize: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Maximum number of page buttons to show */
  maxPages?: number;
  /** Whether to show page size selector */
  showPageSizeSelector?: boolean;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Whether to show page info */
  showPageInfo?: boolean;
  /** Whether to show page jump input */
  showPageJump?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Style variant */
  variant?: 'default' | 'simple' | 'compact';
  /** Custom class name */
  className?: string;
  /** Position of pagination */
  position?: 'left' | 'center' | 'right';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  maxPages = 5,
  showPageSizeSelector = false,
  pageSizeOptions = [10, 20, 50, 100],
  showPageInfo = true,
  showPageJump = false,
  size = 'md',
  variant = 'default',
  className = '',
  position = 'center',
}) => {
  const [jumpPage, setJumpPage] = useState('');
  
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const getPageNumbers = useCallback(() => {
    const pages: (number | 'ellipsis')[] = [];
    const halfMax = Math.floor(maxPages / 2);
    
    let start = Math.max(1, currentPage - halfMax);
    let end = Math.min(totalPages, start + maxPages - 1);
    
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis');
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }
    
    return pages;
  }, [currentPage, totalPages, maxPages]);
  
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPage('');
    }
  };
  
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  if (totalPages <= 0) {
    return null;
  }
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div 
      className={`pagination ${size} ${variant} pagination-${position} ${className}`}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Previous button */}
      <button
        className="pagination-btn"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          );
        }
        
        return (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageClick(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      
      {/* Next button */}
      <button
        className="pagination-btn"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      
      {/* Page info */}
      {showPageInfo && (
        <div className="pagination-info">
          {totalItems > 0 ? (
            <>
              <span>{startItem}-{endItem}</span>
              <span>of</span>
              <span>{totalItems}</span>
            </>
          ) : (
            <span>No items</span>
          )}
        </div>
      )}
      
      {/* Page jump */}
      {showPageJump && (
        <form className="pagination-jump" onSubmit={handleJumpSubmit}>
          <input
            type="number"
            className="pagination-jump-input"
            placeholder="Page #"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            min={1}
            max={totalPages}
          />
          <button type="submit" className="pagination-btn pagination-jump-btn">
            Go
          </button>
        </form>
      )}
      
      {/* Page size selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className="pagination-size-selector">
          <span style={{ fontSize: '14px', color: 'var(--color-text-muted, #6b7280)' }}>
            per page
          </span>
          <select
            className="pagination-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Items per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
