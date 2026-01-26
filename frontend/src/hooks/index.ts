/**
 * Custom React hooks for StackSUSU
 * 
 * Provides reusable hooks for blockchain interactions, circle management,
 * UI state, and utility functions.
 * 
 * @module hooks
 * @example
 * // Import specific hooks
 * import { useContracts, useCircle, useTheme } from '@/hooks';
 * 
 * // Or import all hooks
 * import * as hooks from '@/hooks';
 */

// ============================================================================
// Blockchain & Wallet Hooks
// ============================================================================

/**
 * Hook for interacting with smart contracts
 */
export { useContracts } from './useContracts';

/**
 * Hooks for Stacks wallet balance and transactions
 */
export { useBalance, useTransactions as useStacksTransactions } from './useStacks';

/**
 * Hook for blockchain state and transaction history
 */
export { useBlockchain, useTransactionHistory } from './useBlockchain';

/**
 * Hook for fetching and managing circle details
 */
export { useCircleDetails } from './useCircleDetails';

/**
 * Hook for transaction management and tracking
 */
export { useTransactions } from './useTransactions';

/**
 * Hooks for NFT functionality - user NFTs, marketplace, and details
 */
export { useUserNFTs, useMarketplace, useNFTDetails } from './useNFTs';

// ============================================================================
// Circle Management Hooks
// ============================================================================

/**
 * Hook for circle operations - create, join, contribute, etc.
 */
export { useCircle } from './useCircle';

/**
 * Hook for escrow deposit and release operations
 */
export { useEscrow } from './useEscrow';

/**
 * Hook for reputation score management
 */
export { useReputation } from './useReputation';

// ============================================================================
// UI & State Hooks
// ============================================================================

/**
 * Hook for theme management (light/dark mode)
 */
export { useTheme } from './useTheme';

/**
 * Hook for toast notifications
 */
export { useToast } from './useToast';

/**
 * Hook for form state management and validation
 */
export { default as useForm } from './useForm';

/**
 * Hook for persisting state to localStorage
 */
export { default as useLocalStorage } from './useLocalStorage';

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hooks for debouncing values and callbacks
 */
export { useDebounce, useDebouncedCallback } from './useDebounce';

/**
 * Hook for copying text to clipboard
 */
export { default as useCopyToClipboard } from './useCopyToClipboard';

// ============================================================================
// Type Exports
// ============================================================================

// Re-export hook return types for external consumption
export type { ContractsHookResult } from './useContracts';
export type { CircleHookResult } from './useCircle';
export type { EscrowHookResult } from './useEscrow';
export type { ReputationHookResult } from './useReputation';
