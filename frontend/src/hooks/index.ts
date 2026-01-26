/**
 * Custom React hooks for StackSUSU
 * 
 * @module hooks
 */

// Blockchain & wallet hooks
export { useContracts } from './useContracts';
export { useBalance, useTransactions as useStacksTransactions } from './useStacks';
export { useBlockchain, useTransactionHistory } from './useBlockchain';
export { useCircleDetails } from './useCircleDetails';
export { useTransactions } from './useTransactions';
export { useUserNFTs, useMarketplace, useNFTDetails } from './useNFTs';

// Circle management hooks
export { useCircle } from './useCircle';
export { useEscrow } from './useEscrow';
export { useReputation } from './useReputation';

// UI & state hooks
export { useTheme } from './useTheme';
export { useToast } from './useToast';
export { default as useForm } from './useForm';
export { default as useLocalStorage } from './useLocalStorage';

// Utility hooks
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { default as useCopyToClipboard } from './useCopyToClipboard';

// Additional utility hooks
export { useThrottle } from './useThrottle';
export { useToggle, useDisclosure } from './useToggle';
export { useCountdown, useTimer, useStopwatch } from './useCountdown';
export { useClipboard } from './useClipboard';
export { usePrevious, useHasChanged, useHistory, useValueDirection, useInitialValue } from './usePrevious';
export { useInterval, useTimeout, usePolling } from './useInterval';
export { useMediaQuery, useBreakpoint, usePreferences } from './useMediaQuery';
export { useScrollPosition, useScrollThreshold, useScrollLock, useScrollTo, useSaveScrollPosition } from './useScrollPosition';
export { useDocumentTitle, useNotificationTitle, useFlashTitle } from './useDocumentTitle';
export { useKeyboard, useEscapeKey, useEnterKey, useArrowKeys, useCommandPalette } from './useKeyboard';
