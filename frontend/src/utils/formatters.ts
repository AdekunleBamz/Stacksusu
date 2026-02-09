/**
 * Unified Formatters for StackSUSU
 * Centralized formatting utilities for STX amounts, addresses, dates, and more
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ============================================================================
// Constants
// ============================================================================

const MICRO_STX_PER_STX = 1_000_000;
const STX_DECIMALS = 6;

// ============================================================================
// STX Amount Formatting
// ============================================================================

/**
 * Convert microSTX to STX
 */
export function microSTXToSTX(microSTX: number | string): number {
  const value = typeof microSTX === 'string' ? parseInt(microSTX, 10) : microSTX;
  return value / MICRO_STX_PER_STX;
}

/**
 * Convert STX to microSTX
 */
export function stxToMicroSTX(stx: number): string {
  return Math.floor(stx * MICRO_STX_PER_STX).toString();
}

/**
 * Format STX amount with full precision
 */
export function formatSTX(
  microSTX: number | string,
  decimals: number = STX_DECIMALS,
  showUnit: boolean = true
): string {
  const stx = microSTXToSTX(microSTX);
  const formatted = stx.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
  return showUnit ? `${formatted} STX` : formatted;
}

/**
 * Format STX with compact notation (e.g., 1.2M STX)
 */
export function formatSTXCompact(microSTX: number | string): string {
  const stx = microSTXToSTX(microSTX);
  
  if (stx >= 1_000_000) {
    return `${(stx / 1_000_000).toFixed(2)}M STX`;
  }
  if (stx >= 1_000) {
    return `${(stx / 1_000).toFixed(2)}K STX`;
  }
  return formatSTX(microSTX, 2);
}

/**
 * Format STX without unit suffix
 */
export function formatSTXValue(microSTX: number | string): string {
  const stx = microSTXToSTX(microSTX);
  
  if (stx >= 1_000_000) {
    return `${(stx / 1_000_000).toFixed(1)}M`;
  }
  if (stx >= 1_000) {
    return `${(stx / 1_000).toFixed(1)}K`;
  }
  return stx.toFixed(2);
}

// ============================================================================
// Address Formatting
// ============================================================================

const MAINNET_PREFIX = 'SP';
const TESTNET_PREFIX = 'ST';

/**
 * Validate Stacks address
 */
export function isValidStacksAddress(address: string): boolean {
  if (!address) return false;
  const pattern = /^(SP|ST)[0-9A-HJ-NP-Z]{38,40}$/;
  return pattern.test(address);
}

/**
 * Check if address is mainnet format
 */
export function isMainnetAddress(address: string): boolean {
  return address.startsWith(MAINNET_PREFIX);
}

/**
 * Format address with truncation
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get explorer URL for address
 */
export function getExplorerAddressUrl(address: string, chain: 'mainnet' | 'testnet' = 'mainnet'): string {
  const baseUrl = chain === 'mainnet' 
    ? 'https://explorer.hiro.so/address' 
    : 'https://explorer.hiro.so/address';
  return `${baseUrl}/${address}?chain=${chain}`;
}

// ============================================================================
// Transaction Formatting
// ============================================================================

/**
 * Get explorer URL for transaction
 */
export function getExplorerTxUrl(txId: string, chain: 'mainnet' | 'testnet' = 'mainnet'): string {
  const baseUrl = chain === 'mainnet'
    ? 'https://explorer.hiro.so/txid'
    : 'https://explorer.hiro.so/txid';
  return `${baseUrl}/${txId}?chain=${chain}`;
}

/**
 * Format transaction hash with truncation
 */
export function formatTxId(txId: string, chars: number = 8): string {
  if (!txId) return '';
  return `${txId.slice(0, chars)}...${txId.slice(-chars)}`;
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date with locale
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'MMM d, yyyy'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// ============================================================================
// Block Time Formatting
// ============================================================================

const BLOCK_TIME_MINUTES = 10;
const BLOCKS_PER_DAY = 144;

/**
 * Convert blocks to approximate time
 */
export function blocksToTime(blocks: number): string {
  const minutes = blocks * BLOCK_TIME_MINUTES;
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `~${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `~${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `~${minutes} min`;
}

/**
 * Convert blocks to countdown format
 */
export function blocksToCountdown(blocks: number): string {
  if (blocks <= 0) return 'Now';
  
  const minutes = blocks * BLOCK_TIME_MINUTES;
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days > 0) {
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
  if (hours > 0) {
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Convert time (days) to blocks
 */
export function daysToBlocks(days: number): number {
  return Math.ceil(days * BLOCKS_PER_DAY);
}

/**
 * Format block height
 */
export function formatBlockHeight(height: number): string {
  return height.toLocaleString();
}

// ============================================================================
// Percentage Formatting
// ============================================================================

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format basis points to percentage
 */
export function bpsToPercent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format large numbers with suffixes
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

// ============================================================================
// String Formatting
// ============================================================================

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Pluralize word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

// ============================================================================
// Color Generation
// ============================================================================

/**
 * Generate deterministic color from string
 */
export function stringToColor(str: string): string {
  if (!str) return '#6366f1';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Get initials from string
 */
export function getInitials(str: string, length: number = 2): string {
  if (!str) return '??';
  return str
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, length)
    .join('');
}
