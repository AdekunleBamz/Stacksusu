/**
 * Validation Utilities for StackSUSU
 * 
 * Comprehensive validation functions for forms, addresses, amounts, and more.
 * 
 * @module utils/validation
 */

// ============================================================================
// Types
// ============================================================================

/** Validation rule function */
export type ValidationRule<T> = (value: T) => ValidationResult;

/** Validation result */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error message if validation failed */
  message?: string;
}

/** Form validation state */
export interface ValidationState {
  /** Field-level validation errors */
  errors: Record<string, string | null>;
  /** Whether the entire form is valid */
  isValid: boolean;
  /** Whether any field has been touched */
  touched: Record<string, boolean>;
}

// ============================================================================
// STX Amount Validation
// ============================================================================

const MIN_STX_AMOUNT = 0.000001; // Minimum 1 microSTX
const MAX_STX_AMOUNT = 1_000_000_000; // Maximum 1B STX

/**
 * Validate STX amount
 */
export function validateSTXAmount(amount: number): ValidationResult {
  if (amount === 0) {
    return { valid: false, message: 'Amount must be greater than 0' };
  }
  if (amount < MIN_STX_AMOUNT) {
    return { valid: false, message: `Minimum amount is ${MIN_STX_AMOUNT} STX` };
  }
  if (amount > MAX_STX_AMOUNT) {
    return { valid: false, message: `Maximum amount is ${MAX_STX_AMOUNT} STX` };
  }
  if (!Number.isFinite(amount)) {
    return { valid: false, message: 'Invalid number' };
  }
  if (Number.isNaN(amount)) {
    return { valid: false, message: 'Amount cannot be NaN' };
  }
  return { valid: true };
}

/**
 * Validate contribution amount
 */
export function validateContribution(
  contribution: number,
  maxMembers: number
): ValidationResult {
  const amountValidation = validateSTXAmount(contribution);
  if (!amountValidation.valid) {
    return amountValidation;
  }
  
  const totalContribution = contribution * maxMembers;
  if (totalContribution > MAX_STX_AMOUNT) {
    return { 
      valid: false, 
      message: 'Total contribution exceeds maximum allowed' 
    };
  }
  
  return { valid: true };
}

// ============================================================================
// Stacks Address Validation
// ============================================================================

const STACKS_ADDRESS_REGEX = /^(SP|ST)[0-9A-HJ-NP-Z]{38,40}$/;
const STACKS_ADDRESS_LENGTH = 40;

/**
 * Validate Stacks address format
 */
export function validateStacksAddress(address: string): ValidationResult {
  if (!address) {
    return { valid: false, message: 'Address is required' };
  }
  
  if (!STACKS_ADDRESS_REGEX.test(address)) {
    return { 
      valid: false, 
      message: 'Invalid Stacks address format' 
    };
  }
  
  return { valid: true };
}

/**
 * Check if address is mainnet
 */
export function isMainnetAddress(address: string): boolean {
  return address.startsWith('SP');
}

/**
 * Check if address is testnet
 */
export function isTestnetAddress(address: string): boolean {
  return address.startsWith('ST');
}

// ============================================================================
// Circle Validation
// ============================================================================

const CIRCLE_NAME_MIN_LENGTH = 3;
const CIRCLE_NAME_MAX_LENGTH = 50;
const MIN_MEMBERS = 3;
const MAX_MEMBERS = 50;
const MIN_PAYOUT_INTERVAL_DAYS = 1;
const MAX_PAYOUT_INTERVAL_DAYS = 30;

/**
 * Validate circle name
 */
export function validateCircleName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'Circle name is required' };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < CIRCLE_NAME_MIN_LENGTH) {
    return { 
      valid: false, 
      message: `Name must be at least ${CIRCLE_NAME_MIN_LENGTH} characters` 
    };
  }
  
  if (trimmedName.length > CIRCLE_NAME_MAX_LENGTH) {
    return { 
      valid: false, 
      message: `Name must be no more than ${CIRCLE_NAME_MAX_LENGTH} characters` 
    };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>{}[\]\\|]/;
  if (invalidChars.test(trimmedName)) {
    return { 
      valid: false, 
      message: 'Name contains invalid characters' 
    };
  }
  
  return { valid: true };
}

/**
 * Validate member count
 */
export function validateMemberCount(count: number): ValidationResult {
  if (!Number.isInteger(count)) {
    return { valid: false, message: 'Member count must be a whole number' };
  }
  
  if (count < MIN_MEMBERS) {
    return { 
      valid: false, 
      message: `Circle must have at least ${MIN_MEMBERS} members` 
    };
  }
  
  if (count > MAX_MEMBERS) {
    return { 
      valid: false, 
      message: `Circle cannot have more than ${MAX_MEMBERS} members` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate payout interval
 */
export function validatePayoutInterval(days: number): ValidationResult {
  if (!Number.isInteger(days)) {
    return { valid: false, message: 'Interval must be a whole number' };
  }
  
  if (days < MIN_PAYOUT_INTERVAL_DAYS) {
    return { 
      valid: false, 
      message: `Interval must be at least ${MIN_PAYOUT_INTERVAL_DAYS} day(s)` 
    };
  }
  
  if (days > MAX_PAYOUT_INTERVAL_DAYS) {
    return { 
      valid: false, 
      message: `Interval cannot exceed ${MAX_PAYOUT_INTERVAL_DAYS} days` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate circle configuration
 */
export interface CircleConfig {
  name: string;
  contribution: number;
  maxMembers: number;
  payoutIntervalDays: number;
  contributionMode: number;
  minReputation: number;
}

export function validateCircleConfig(config: CircleConfig): ValidationState {
  const errors: Record<string, string | null> = {};
  let isValid = true;
  const touched: Record<string, boolean> = {};
  
  const validations: [string, ValidationRule<any>][] = [
    ['name', () => validateCircleName(config.name)],
    ['contribution', () => validateSTXAmount(config.contribution)],
    ['maxMembers', () => validateMemberCount(config.maxMembers)],
    ['payoutIntervalDays', () => validatePayoutInterval(config.payoutIntervalDays)],
  ];
  
  for (const [field, validate] of validations) {
    touched[field] = true;
    const result = validate(config[field as keyof CircleConfig]);
    errors[field] = result.valid ? null : result.message || null;
    if (!result.valid) isValid = false;
  }
  
  return { errors, isValid, touched };
}

// ============================================================================
// Form Validation Helpers
// ============================================================================

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule<string> => {
    return (value: string) => ({
      valid: value.trim().length > 0,
      message,
    });
  },
  
  email: (message = 'Invalid email address'): ValidationRule<string> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (value: string) => ({
      valid: emailRegex.test(value),
      message,
    });
  },
  
  minLength: (length: number, message?: string): ValidationRule<string> => {
    return (value: string) => ({
      valid: value.length >= length,
      message: message || `Must be at least ${length} characters`,
    });
  },
  
  maxLength: (length: number, message?: string): ValidationRule<string> => {
    return (value: string) => ({
      valid: value.length <= length,
      message: message || `Must be no more than ${length} characters`,
    });
  },
  
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => {
    return (value: string) => ({
      valid: regex.test(value),
      message,
    });
  },
  
  min: (min: number, message?: string): ValidationRule<number> => {
    return (value: number) => ({
      valid: value >= min,
      message: message || `Must be at least ${min}`,
    });
  },
  
  max: (max: number, message?: string): ValidationRule<number> => {
    return (value: number) => ({
      valid: value <= max,
      message: message || `Must be no more than ${max}`,
    });
  },
};

/**
 * Compose multiple validation rules
 */
export function composeRules<T>(
  ...rules: ValidationRule<T>[]
): ValidationRule<T> {
  return (value: T) => {
    for (const rule of rules) {
      const result = rule(value);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  };
}

/**
 * Validate form with composed rules
 */
export function validateForm<T extends Record<string, any>>(
  values: T,
  rules: Record<keyof T, ValidationRule<any>>
): ValidationState {
  const errors: Record<string, string | null> = {};
  const touched: Record<string, boolean> = {};
  let isValid = true;
  
  for (const key of Object.keys(values)) {
    const value = values[key];
    const fieldRules = rules[key];
    
    if (fieldRules) {
      touched[key] = true;
      const result = fieldRules(value);
      errors[key] = result.valid ? null : result.message || null;
      if (!result.valid) isValid = false;
    }
  }
  
  return { errors, isValid, touched };
}

// ============================================================================
// Password Validation
// ============================================================================

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { 
      valid: false, 
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` 
    };
  }
  
  if (!PASSWORD_REGEX.test(password)) {
    return { 
      valid: false, 
      message: 'Password must include uppercase, lowercase, number, and special character' 
    };
  }
  
  return { valid: true };
}

/**
 * Check password strength score (0-4)
 */
export function getPasswordStrength(password: string): number {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  
  return Math.min(score, 4);
}

// ============================================================================
// URL Validation
// ============================================================================

const URL_REGEX = /^https?:\/\/[^\s<>"{}|\\^`[\]]+$/;

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { valid: false, message: 'URL is required' };
  }
  
  if (!URL_REGEX.test(url)) {
    return { valid: false, message: 'Invalid URL format' };
  }
  
  return { valid: true };
}

// ============================================================================
// Contract ID Validation
// ============================================================================

const CONTRACT_ID_REGEX = /^[A-Z0-9\-_]\.[a-zA-Z0-9\-_]+$/;

/**
 * Validate Clarity contract ID format (address.contract-name)
 */
export function validateContractId(contractId: string): ValidationResult {
  if (!contractId) {
    return { valid: false, message: 'Contract ID is required' };
  }
  
  if (!CONTRACT_ID_REGEX.test(contractId)) {
    return { 
      valid: false, 
      message: 'Invalid contract ID format (expected: address.contract-name)' 
    };
  }
  
  const [address, name] = contractId.split('.');
  const addressValidation = validateStacksAddress(address);
  if (!addressValidation.valid) {
    return { valid: false, message: 'Invalid address in contract ID' };
  }
  
  if (name.length === 0 || name.length > 128) {
    return { 
      valid: false, 
      message: 'Contract name must be between 1 and 128 characters' 
    };
  }
  
  return { valid: true };
}

// ============================================================================
// Reputation Score Validation
// ============================================================================

const MIN_REPUTATION = 0;
const MAX_REPUTATION = 1000;

/**
 * Validate reputation score
 */
export function validateReputationScore(score: number): ValidationResult {
  if (Number.isNaN(score)) {
    return { valid: false, message: 'Invalid reputation score' };
  }
  
  if (score < MIN_REPUTATION) {
    return { 
      valid: false, 
      message: `Score cannot be less than ${MIN_REPUTATION}` 
    };
  }
  
  if (score > MAX_REPUTATION) {
    return { 
      valid: false, 
      message: `Score cannot exceed ${MAX_REPUTATION}` 
    };
  }
  
  return { valid: true };
}
