/**
 * String utilities
 */

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * Convert to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase();
}

/**
 * Convert to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-_\s]+/g, '_')
    .toLowerCase();
}

/**
 * Convert to PascalCase
 */
export function pascalCase(str: string): string {
  return capitalize(camelCase(str));
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Pad string on both sides
 */
export function pad(str: string, length: number, char = ' '): string {
  const padding = Math.max(0, length - str.length);
  const left = Math.floor(padding / 2);
  const right = padding - left;
  return char.repeat(left) + str + char.repeat(right);
}

/**
 * Pad start of string
 */
export function padStart(str: string, length: number, char = ' '): string {
  return str.padStart(length, char);
}

/**
 * Pad end of string
 */
export function padEnd(str: string, length: number, char = ' '): string {
  return str.padEnd(length, char);
}

/**
 * Repeat string
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * Reverse string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if string contains substring
 */
export function includes(str: string, search: string, position = 0): boolean {
  return str.includes(search, position);
}

/**
 * Check if string starts with substring
 */
export function startsWith(str: string, search: string, position = 0): boolean {
  return str.startsWith(search, position);
}

/**
 * Check if string ends with substring
 */
export function endsWith(str: string, search: string, length?: number): boolean {
  return str.endsWith(search, length);
}

/**
 * Remove accents/diacritics
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Slugify string
 */
export function slugify(str: string): string {
  return kebabCase(removeAccents(str));
}

/**
 * Strip HTML tags
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML entities
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    '&#039;': "'",
  };
  return str.replace(/&|<|>|"|&#039;/g, (c) => map[c]);
}

/**
 * Count words in string
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count lines in string
 */
export function countLines(str: string): number {
  return str.split('\n').length;
}

/**
 * Limit words in string
 */
export function limitWords(str: string, limit: number, suffix = '...'): string {
  const words = str.trim().split(/\s+/);
  if (words.length <= limit) return str;
  return words.slice(0, limit).join(' ') + suffix;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

/**
 * Generate initials from name
 */
export function getInitials(name: string, maxLength = 2): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  
  if (parts.length === 1) {
    return parts[0].slice(0, maxLength).toUpperCase();
  }
  
  return parts.slice(0, maxLength).map(p => p[0]).join('').toUpperCase();
}
