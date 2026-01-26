/**
 * Reusable UI Components for StackSUSU
 * 
 * A comprehensive library of React components built with accessibility
 * and reusability in mind. All components follow consistent patterns
 * and support dark mode theming.
 * 
 * @module components
 * 
 * Component Categories:
 * - Layout: Page structure (Navbar, Footer, Sidebar)
 * - Core UI: Basic building blocks (Button, Card, Modal, Input)
 * - Feedback: User feedback (Spinner, Skeleton, ProgressBar, Toast)
 * - Data Display: Presenting data (Stats, TransactionItem, ActivityFeed)
 * - Interactive: User interaction (ConnectWallet, SearchBar, Pagination)
 * 
 * @example
 * ```typescript
 * // Import specific components
 * import { Button, Card, Modal } from '@/components';
 * 
 * // Import with types
 * import { TransactionItem, type Activity } from '@/components';
 * ```
 * 
 * @packageDocumentation
 */

// ============================================================================
// Layout Components
// ============================================================================

/** Main navigation bar component */
export { default as Navbar } from './Navbar';

/** Page footer component */
export { default as Footer } from './Footer';

/** Collapsible sidebar navigation */
export { Sidebar } from './Sidebar';

// ============================================================================
// Core UI Components
// ============================================================================

/** Versatile button with variants and states */
export { default as Button } from './Button';

/** Card container with header, body, and footer sections */
export { default as Card, CardHeader, CardBody, CardFooter } from './Card';

/** Modal dialog with backdrop and animations */
export { default as Modal, ModalActions } from './Modal';

/** Status badge for labels and tags */
export { default as Badge } from './Badge';

/** User avatar with fallback and status indicators */
export { default as Avatar } from './Avatar';

/** Form input with validation support */
export { default as Input } from './Input';

/** Dropdown select component */
export { default as Select } from './Select';

/** Alert banner for messages and notifications */
export { default as Alert } from './Alert';

/** Tabbed navigation component */
export { default as Tabs } from './Tabs';

/** Tooltip for additional context */
export { default as Tooltip } from './Tooltip';

// ============================================================================
// Feedback Components
// ============================================================================

/** Loading spinner animation */
export { default as Spinner } from './Spinner';

/** Skeleton loading placeholder */
export { default as Skeleton } from './Skeleton';

/** Progress bar with percentage display */
export { default as ProgressBar } from './ProgressBar';

/** Toast notification container */
export { ToastContainer } from './ToastContainer';

/** Empty state placeholder with action */
export { EmptyState } from './EmptyState';

// ============================================================================
// Data Display Components
// ============================================================================

/** Statistics display cards */
export { Stats } from './Stats';

/** Transaction list item with status */
export { TransactionItem } from './TransactionItem';

/** Activity feed with timeline */
export { ActivityFeed } from './ActivityFeed';

/** Activity feed item type */
export type { Activity } from './ActivityFeed';

// ============================================================================
// Interactive Components
// ============================================================================

/** Stacks wallet connection button */
export { ConnectWallet } from './ConnectWallet';

/** Search bar with suggestions */
export { SearchBar } from './SearchBar';

/** Pagination controls */
export { Pagination } from './Pagination';

