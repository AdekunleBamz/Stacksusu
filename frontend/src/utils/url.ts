/**
 * URL utilities
 */

/**
 * Parse URL string
 */
export function parseURL(url: string): URL {
  return new URL(url);
}

/**
 * Get query parameters as object
 */
export function getQueryParams(url: string): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Build URL with query params
 */
export function buildURL(base: string, params: Record<string, string | number | undefined>): string {
  const urlObj = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlObj.searchParams.set(key, String(value));
    }
  });
  return urlObj.toString();
}

/**
 * Add query param to URL
 */
export function addQueryParam(url: string, key: string, value: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
}

/**
 * Remove query param from URL
 */
export function removeQueryParam(url: string, key: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
}

/**
 * Get URL hash
 */
export function getURLHash(url: string): string {
  const urlObj = new URL(url);
  return urlObj.hash;
}

/**
 * Check if URL is absolute
 */
export function isAbsoluteURL(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Check if URL is valid
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Get path from URL
 */
export function getPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return '';
  }
}

/**
 * URL encode component
 */
export function encodeURIComponent(str: string): string {
  return encodeURIComponent(str);
}

/**
 * URL decode component
 */
export function decodeURIComponent(str: string): string {
  return decodeURIComponent(str);
}

/**
 * URL encode full
 */
export function encodeURL(str: string): string {
  return encodeURI(str);
}

/**
 * URL decode full
 */
export function decodeURL(str: string): string {
  return decodeURI(str);
}
