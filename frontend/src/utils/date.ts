/**
 * Date utilities
 */

import { format, formatDistance, parseISO, isValid, isToday, isYesterday, isTomorrow, addDays, addHours, addMinutes, addSeconds, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
}

/**
 * Format date as ISO string
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

/**
 * Format date as short date
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

/**
 * Format date as long date
 */
export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM d, yyyy');
}

/**
 * Format time
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

/**
 * Check if date is today
 */
export function isDateToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isToday(d);
}

/**
 * Check if date is yesterday
 */
export function isDateYesterday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isYesterday(d);
}

/**
 * Check if date is tomorrow
 */
export function isDateTomorrow(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isTomorrow(d);
}

/**
 * Add days to date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return addDays(d, days);
}

/**
 * Add hours to date
 */
export function addHoursToDate(date: Date | string, hours: number): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return addHours(d, hours);
}

/**
 * Add minutes to date
 */
export function addMinutesToDate(date: Date | string, minutes: number): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return addMinutes(d, minutes);
}

/**
 * Add seconds to date
 */
export function addSecondsToDate(date: Date | string, seconds: number): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return addSeconds(d, seconds);
}

/**
 * Get difference in days
 */
export function diffDays(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInDays(d2, d1);
}

/**
 * Get difference in hours
 */
export function diffHours(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInHours(d2, d1);
}

/**
 * Get difference in minutes
 */
export function diffMinutes(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInMinutes(d2, d1);
}

/**
 * Parse date string
 */
export function parseDate(dateString: string): Date | null {
  const date = parseISO(dateString);
  return isValid(date) ? date : null;
}

/**
 * Create date from components
 */
export function createDate(year: number, month: number, day: number, hours = 0, minutes = 0, seconds = 0): Date {
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}
