/**
 * Reusable UI components
 * 
 * @module components
 */

// Layout components
export { default as Navbar } from './Navbar';
export { default as Footer } from './Footer';
export { Sidebar } from './Sidebar';

// Navigation components
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbItem, BreadcrumbProps } from './Breadcrumb';
export { ScrollToTop } from './ScrollToTop';

// Core UI components
export { default as Button } from './Button';
export { default as Card, CardHeader, CardBody, CardFooter } from './Card';
export { default as Modal, ModalActions } from './Modal';
export { default as Badge } from './Badge';
export { default as Avatar } from './Avatar';
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Alert } from './Alert';
export { default as Tabs } from './Tabs';
export { default as Tooltip } from './Tooltip';
export { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSeparator, DropdownLabel } from './Dropdown';
export type { DropdownProps, DropdownItemProps, DropdownMenuProps } from './Dropdown';

// Feedback components
export { default as Spinner } from './Spinner';
export { default as Skeleton } from './Skeleton';
export { default as ProgressBar } from './ProgressBar';
export { ToastContainer } from './ToastContainer';
export { EmptyState } from './EmptyState';
export { Stepper } from './Stepper';
export type { Step, StepStatus, StepperProps } from './Stepper';
export { DashboardSkeleton } from './DashboardSkeleton';
export { NetworkStatus } from './NetworkStatus';

// Data display components
export { Stats } from './Stats';
export { TransactionItem } from './TransactionItem';
export { ActivityFeed } from './ActivityFeed';
export type { Activity } from './ActivityFeed';
export { AnimatedNumber } from './AnimatedNumber';
export { CircleActivityLog } from './CircleActivityLog';
export type { CircleActivity, CircleActivityType } from './CircleActivityLog';
export { ContributionStreak } from './ContributionStreak';

// Interactive components
export { ConnectWallet } from './ConnectWallet';
export { SearchBar } from './SearchBar';
export { Pagination } from './Pagination';
export { CopyButton, CopyText } from './CopyButton';
export type { CopyButtonProps, CopyTextProps } from './CopyButton';
export { ShareCircle } from './ShareCircle';
export { FavoriteButton } from './FavoriteButton';

// Accessibility components
export { SkipToContent } from './SkipToContent';

// Comparison components
export { CircleComparison } from './CircleComparison';

// Calendar components
export { PayoutCalendar } from './PayoutCalendar';
export type { PayoutEvent } from './PayoutCalendar';

// Wallet components
export { WalletQRCode } from './WalletQRCode';

// Member components
export { MemberReputationPreview } from './MemberReputationPreview';
export type { ReputationData, MemberReputationPreviewProps } from './MemberReputationPreview';

