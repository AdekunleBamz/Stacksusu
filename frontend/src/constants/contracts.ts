/**
 * Contract constants for StackSUSU
 * Contains addresses, configuration values, and blockchain constants
 */

// ============================================================================
// Network Configuration
// ============================================================================

export const NETWORK_CONFIG = {
  MAINNET_API_URL: 'https://api.mainnet.hiro.so',
  TESTNET_API_URL: 'https://api.testnet.hiro.so',
  EXPLORER_URL: 'https://explorer.stacks.co',
} as const;

// ============================================================================
// Contract Addresses
// ============================================================================

export const CONTRACT_ADDRESS = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N';

export const CONTRACTS = {
  CORE: `${CONTRACT_ADDRESS}.stacksusu-core-v7`,
  ADMIN: `${CONTRACT_ADDRESS}.stacksusu-admin-v7`,
  ESCROW: `${CONTRACT_ADDRESS}.stacksusu-escrow-v7`,
  NFT: `${CONTRACT_ADDRESS}.stacksusu-nft-v7`,
  GOVERNANCE: `${CONTRACT_ADDRESS}.stacksusu-governance-v7`,
  REFERRAL: `${CONTRACT_ADDRESS}.stacksusu-referral-v7`,
  REPUTATION: `${CONTRACT_ADDRESS}.stacksusu-reputation-v7`,
  EMERGENCY: `${CONTRACT_ADDRESS}.stacksusu-emergency-v7`,
  TRAITS: `${CONTRACT_ADDRESS}.stacksusu-traits-v5`,
} as const;

// ============================================================================
// Block Time Constants
// ============================================================================

export const BLOCK_TIMES = {
  /** Average block time in seconds (Stacks ~10 minutes) */
  AVG_BLOCK_TIME_SECONDS: 600,
  /** Blocks per hour */
  BLOCKS_PER_HOUR: 6,
  /** Blocks per day */
  BLOCKS_PER_DAY: 144,
  /** Blocks per week */
  BLOCKS_PER_WEEK: 1008,
  /** Blocks per month (30 days) */
  BLOCKS_PER_MONTH: 4320,
} as const;

// ============================================================================
// Circle Configuration
// ============================================================================

export const CIRCLE_CONFIG = {
  /** Minimum contribution in microSTX (0.1 STX) */
  MIN_CONTRIBUTION: 100_000,
  /** Maximum contribution in microSTX (10,000 STX) */
  MAX_CONTRIBUTION: 10_000_000_000,
  /** Minimum members per circle */
  MIN_MEMBERS: 2,
  /** Maximum members per circle */
  MAX_MEMBERS: 20,
  /** Platform fee percentage (basis points, 100 = 1%) */
  PLATFORM_FEE_BPS: 100,
} as const;

// ============================================================================
// Escrow Configuration
// ============================================================================

export const ESCROW_CONFIG = {
  /** Escrow fee percentage */
  FEE_PERCENTAGE: 0.01,
  /** Minimum deposit in microSTX */
  MIN_DEPOSIT: 100_000,
  /** Maximum deposit in microSTX */
  MAX_DEPOSIT: 100_000_000_000,
  /** Default lock duration in blocks */
  DEFAULT_LOCK_BLOCKS: 144,
} as const;

// ============================================================================
// Referral Configuration
// ============================================================================

export const REFERRAL_CONFIG = {
  /** Base reward percentage */
  BASE_REWARD_PERCENTAGE: 0.02,
  /** Maximum referral codes per user */
  MAX_CODES_PER_USER: 5,
} as const;

// ============================================================================
// Reputation Configuration
// ============================================================================

export const REPUTATION_CONFIG = {
  /** Points earned for successful contribution */
  CONTRIBUTION_POINTS: 10,
  /** Points earned for completing a circle */
  COMPLETION_POINTS: 50,
  /** Points deducted for missed contribution */
  MISSED_PENALTY: 25,
  /** Minimum reputation for premium features */
  PREMIUM_THRESHOLD: 100,
} as const;

// ============================================================================
// Error Codes
// ============================================================================

export const ERROR_CODES = {
  ERR_NOT_AUTHORIZED: 100,
  ERR_INVALID_AMOUNT: 101,
  ERR_CIRCLE_NOT_FOUND: 102,
  ERR_ALREADY_MEMBER: 103,
  ERR_NOT_MEMBER: 104,
  ERR_CIRCLE_FULL: 105,
  ERR_INVALID_STATE: 106,
  ERR_INSUFFICIENT_BALANCE: 107,
  ERR_ALREADY_CONTRIBUTED: 108,
  ERR_PAYOUT_NOT_DUE: 109,
  ERR_ESCROW_LOCKED: 110,
  ERR_PAUSED: 111,
} as const;
