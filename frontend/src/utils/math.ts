/**
 * Math utilities
 */

/** Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/** Map value from one range to another */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/** Generate random number in range */
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Generate random integer in range */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

/** Round to specified decimal places */
export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Floor to specified decimal places */
export function floor(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

/** Ceil to specified decimal places */
export function ceil(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

/** Get percentage */
export function percent(value: number, total: number): number {
  return total !== 0 ? (value / total) * 100 : 0;
}

/** Get ratio of value to total */
export function ratio(value: number, total: number): number {
  return total !== 0 ? value / total : 0;
}

/** Sum array of numbers */
export function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

/** Average of array of numbers */
export function average(numbers: number[]): number {
  return numbers.length > 0 ? sum(numbers) / numbers.length : 0;
}

/** Median of array of numbers */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Calculate factorial */
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/** Calculate combinations (nCr) */
export function combinations(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

/** Calculate permutations (nPr) */
export function permutations(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

/** Greatest common divisor */
export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** Least common multiple */
export function lcm(a: number, b: number): number {
  return Math.abs((a * b) / gcd(a, b));
}

/** Convert degrees to radians */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Convert radians to degrees */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/** Calculate distance between two points */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/** Calculate angle between two points */
export function angle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

/** Calculate standard deviation */
export function stdDev(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squaredDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(average(squaredDiffs));
}

/** Format number with thousands separator */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/** Format currency */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

/** Format compact number (1K, 1.5M, etc.) */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
}
