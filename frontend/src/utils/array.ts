/**
 * Array utilities
 */

/**
 * Check if value is array
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Check if array is empty
 */
export function isEmptyArray<T>(value: unknown): boolean {
  return isArray<T>(value) && value.length === 0;
}

/**
 * Check if array is not empty
 */
export function isNotEmptyArray<T>(value: unknown): value is T[] {
  return isArray<T>(value) && value.length > 0;
}

/**
 * Get array item by index (with bounds checking)
 */
export function getArrayItem<T>(array: T[], index: number): T | undefined {
  return array[index];
}

/**
 * Get first item in array
 */
export function first<T>(array: T[]): T | undefined {
  return array[0];
}

/**
 * Get last item in array
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array (mutates in place)
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Shuffle array (returns new array)
 */
export function shuffleCopy<T>(array: T[]): T[] {
  return shuffle([...array]);
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [array];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flatten array one level
 */
export function flatten<T>(array: T[][]): T[] {
  return array.flat();
}

/**
 * Flatten array deeply
 */
export function deepFlatten<T>(array: unknown[]): T[] {
  return array.flat(Infinity) as T[];
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Get range of numbers
 */
export function range(start: number, end?: number, step = 1): number[] {
  const actualStart = end !== undefined ? start : 0;
  const actualEnd = end !== undefined ? end : start;
  
  const result: number[] = [];
  for (let i = actualStart; step > 0 ? i < actualEnd : i > actualEnd; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Fill array with value
 */
export function fill<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

/**
 * Create array with mapped values
 */
export function mapFill<T, U>(length: number, mapper: (index: number) => U): U[] {
  return Array.from({ length }, (_, i) => mapper(i));
}

/**
 * Intersect arrays
 */
export function intersect<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => array2.includes(item));
}

/**
 * Union of arrays
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

/**
 * Difference of arrays
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter((item) => !array2.includes(item));
}

/**
 * Check if arrays are equal
 */
export function arraysEqual<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) return false;
  return array1.every((item, index) => item === array2[index]);
}

/**
 * Partition array into two groups
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const trueGroup: T[] = [];
  const falseGroup: T[] = [];
  
  for (const item of array) {
    if (predicate(item)) {
      trueGroup.push(item);
    } else {
      falseGroup.push(item);
    }
  }
  
  return [trueGroup, falseGroup];
}

/**
 * Pluck property from array
 */
export function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return array.map((item) => item[key]);
}

/**
 * Get nested property from array of objects
 */
export function deepPluck<T>(array: T[], path: string): unknown[] {
  return array.map((item) => {
    const keys = path.split('.');
    let value: unknown = item;
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key];
    }
    return value;
  });
}

/**
 * Remove falsy values from array
 */
export function compact<T>(array: T[]): T[] {
  return array.filter((item) => Boolean(item));
}

/**
 * Count occurrences in array
 */
export function countOccurrences<T>(array: T[], value: T): number {
  return array.reduce((count, item) => count + (item === value ? 1 : 0), 0);
}

/**
 * Get frequency map
 */
export function frequency<T>(array: T[]): Record<string, number> {
  return array.reduce((freq, item) => {
    const key = String(item);
    freq[key] = (freq[key] || 0) + 1;
    return freq;
  }, {} as Record<string, number>);
}
