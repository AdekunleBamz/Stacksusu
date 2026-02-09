/**
 * Validation utilities
 */

/**
 * Check if email is valid
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Check if URL is valid
 */
export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if phone number is valid
 */
export function isPhone(value: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(value);
}

/**
 * Check if string contains only letters
 */
export function isAlpha(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value);
}

/**
 * Check if string contains only letters and numbers
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Check if string contains only numbers
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Check if string is a valid integer
 */
export function isInteger(value: string): boolean {
  return /^-?\d+$/.test(value);
}

/**
 * Check if string is a valid float
 */
export function isFloat(value: string): boolean {
  return /^-?\d*\.?\d+$/.test(value);
}

/**
 * Check minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

/**
 * Check maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

/**
 * Check exact length
 */
export function exactLength(value: string, length: number): boolean {
  return value.length === length;
}

/**
 * Check minimum value
 */
export function minValue(value: number, min: number): boolean {
  return value >= min;
}

/**
 * Check maximum value
 */
export function maxValue(value: number, max: number): boolean {
  return value <= max;
}

/**
 * Check if value is in array
 */
export function inArray<T>(value: T, array: T[]): boolean {
  return array.includes(value);
}

/**
 * Check if string matches pattern
 */
export function matches(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Check if strings are equal
 */
export function equals(value: string, other: string): boolean {
  return value === other;
}

/**
 * Check if credit card is valid (Luhn algorithm)
 */
export function isCreditCard(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Check if strong password
 */
export function isStrongPassword(value: string): boolean {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(value)
  );
}

/**
 * Check if valid username
 */
export function isUsername(value: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(value);
}

/**
 * Check if valid ZIP code (US)
 */
export function isZipCode(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value);
}

/**
 * Check if valid IP address
 */
export function isIpAddress(value: string): boolean {
  const parts = value.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && part === num.toString();
  });
}

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Create validation result
 */
export function createValidationResult(
  valid: boolean,
  errors: string[]
): ValidationResult {
  return { valid, errors };
}
