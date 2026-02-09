/**
 * Time Utilities
 * Functions for time and date manipulation
 */

/**
 * Formats a date relative to now (e.g., "5 minutes ago")
 */
export function formatRelativeTime(date: Date | number | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 0) {
    return 'in the future';
  }
  
  if (diffSeconds < 60) {
    return 'just now';
  }
  
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }
  
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }
  
  if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
  
  if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  }
  
  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  }
  
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}

/**
 * Formats duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  
  return `${seconds}s`;
}

/**
 * Formats duration in seconds to detailed format
 */
export function formatDurationDetailed(seconds: number): string {
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor((seconds % 31536000) / 2592000);
  const days = Math.floor((seconds % 2592000) / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}mo`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.slice(0, 3).join(' ');
}

/**
 * Returns time until a date
 */
export function getTimeUntil(date: Date | number | string): string {
  const target = new Date(date);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'now';
  }

  return formatDuration(diffMs);
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | number | string): boolean {
  const target = new Date(date);
  const today = new Date();
  
  return (
    target.getDate() === today.getDate() &&
    target.getMonth() === today.getMonth() &&
    target.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is yesterday
 */
export function isYesterday(date: Date | number | string): boolean {
  const target = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    target.getDate() === yesterday.getDate() &&
    target.getMonth() === yesterday.getMonth() &&
    target.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Checks if a date is tomorrow
 */
export function isTomorrow(date: Date | number | string): boolean {
  const target = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return (
    target.getDate() === tomorrow.getDate() &&
    target.getMonth() === tomorrow.getMonth() &&
    target.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * Gets the start of the day for a date
 */
export function getStartOfDay(date: Date | number | string): Date {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target;
}

/**
 * Gets the end of the day for a date
 */
export function getEndOfDay(date: Date | number | string): Date {
  const target = new Date(date);
  target.setHours(23, 59, 59, 999);
  return target;
}

/**
 * Gets the start of the week for a date
 */
export function getStartOfWeek(date: Date | number | string, weekStart = 0): Date {
  const target = new Date(date);
  const day = target.getDay();
  const diff = (day + 7 - weekStart) % 7;
  target.setDate(target.getDate() - diff);
  target.setHours(0, 0, 0, 0);
  return target;
}

/**
 * Gets the end of the week for a date
 */
export function getEndOfWeek(date: Date | number | string, weekStart = 0): Date {
  const start = getStartOfWeek(date, weekStart);
  start.setDate(start.getDate() + 6);
  start.setHours(23, 59, 59, 999);
  return start;
}

/**
 * Gets the start of the month for a date
 */
export function getStartOfMonth(date: Date | number | string): Date {
  const target = new Date(date);
  target.setDate(1);
  target.setHours(0, 0, 0, 0);
  return target;
}

/**
 * Gets the end of the month for a date
 */
export function getEndOfMonth(date: Date | number | string): Date {
  const target = new Date(date);
  target.setMonth(target.getMonth() + 1);
  target.setDate(0);
  target.setHours(23, 59, 59, 999);
  return target;
}

/**
 * Adds days to a date
 */
export function addDays(date: Date | number | string, days: number): Date {
  const target = new Date(date);
  target.setDate(target.getDate() + days);
  return target;
}

/**
 * Adds hours to a date
 */
export function addHours(date: Date | number | string, hours: number): Date {
  const target = new Date(date);
  target.setHours(target.getHours() + hours);
  return target;
}

/**
 * Adds minutes to a date
 */
export function addMinutes(date: Date | number | string, minutes: number): Date {
  const target = new Date(date);
  target.setMinutes(target.getMinutes() + minutes);
  return target;
}

/**
 * Adds seconds to a date
 */
export function addSeconds(date: Date | number | string, seconds: number): Date {
  const target = new Date(date);
  target.setSeconds(target.getSeconds() + seconds);
  return target;
}

/**
 * Gets the difference in days between two dates
 */
export function diffDays(date1: Date | number | string, date2: Date | number | string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / 86400000);
}

/**
 * Gets the difference in hours between two dates
 */
export function diffHours(date1: Date | number | string, date2: Date | number | string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / 3600000);
}

/**
 * Gets the difference in minutes between two dates
 */
export function diffMinutes(date1: Date | number | string, date2: Date | number | string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / 60000);
}

/**
 * Gets the difference in seconds between two dates
 */
export function diffSeconds(date1: Date | number | string, date2: Date | number | string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / 1000);
}

/**
 * Formats a date in ISO format
 */
export function formatISO(date: Date | number | string): string {
  return new Date(date).toISOString();
}

/**
 * Formats a date for display
 */
export function formatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Formats a time for display
 */
export function formatTime(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }
): string {
  return new Date(date).toLocaleTimeString('en-US', options);
}

/**
 * Formats a date and time for display
 */
export function formatDateTime(
  date: Date | number | string,
  dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }
): string {
  const d = new Date(date);
  return `${d.toLocaleDateString('en-US', dateOptions)} at ${d.toLocaleTimeString('en-US', timeOptions)}`;
}

/**
 * Parses a date string
 */
export function parseDate(dateString: string): Date | null {
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Checks if a date is valid
 */
export function isValidDate(date: Date | number | string): boolean {
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * Gets the day of the week name
 */
export function getDayName(date: Date | number | string): string {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Gets the month name
 */
export function getMonthName(date: Date | number | string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Checks if two dates are the same day
 */
export function isSameDay(date1: Date | number | string, date2: Date | number | string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Checks if a date is in the past
 */
export function isPast(date: Date | number | string): boolean {
  return new Date(date) < new Date();
}

/**
 * Checks if a date is in the future
 */
export function isFuture(date: Date | number | string): boolean {
  return new Date(date) > new Date();
}
