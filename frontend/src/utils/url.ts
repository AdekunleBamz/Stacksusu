/**
 * URL Utilities
 * Functions for URL manipulation and parsing
 */

/**
 * Parses a URL and returns its components
 */
export interface URLComponents {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

export function parseURL(url: string): URLComponents | null {
  try {
    const parsed = new URL(url);
    return {
      href: parsed.href,
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
    };
  } catch {
    return null;
  }
}

/**
 * Extracts query parameters from a URL
 */
export function getQueryParams(url: string): Record<string, string> {
  try {
    const parsed = new URL(url);
    const params: Record<string, string> = {};
    
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch {
    return {};
  }
}

/**
 * Builds a URL with query parameters
 */
export function buildUrl(
  base: string,
  params: Record<string, string | number | boolean | undefined | null>
): string {
  try {
    const url = new URL(base);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
    
    return url.toString();
  } catch {
    return base;
  }
}

/**
 * Adds or updates query parameters
 */
export function updateUrlParams(
  url: string,
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const currentParams = getQueryParams(url);
  const mergedParams = { ...currentParams, ...params };
  
  // Remove undefined/null values
  Object.keys(mergedParams).forEach((key) => {
    if (mergedParams[key] === undefined || mergedParams[key] === null) {
      delete mergedParams[key];
    }
  });
  
  return buildUrl(url.split('?')[0], mergedParams);
}

/**
 * Removes query parameters from URL
 */
export function removeUrlParams(url: string, keys: string[]): string {
  const params = getQueryParams(url);
  
  keys.forEach((key) => {
    delete params[key];
  });
  
  return buildUrl(url.split('?')[0], params);
}

/**
 * Encodes URL components safely
 */
export function encodeUrlComponent(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Decodes URL components safely
 */
export function decodeUrlComponent(value: string): string {
  return decodeURIComponent(value);
}

/**
 * Gets a relative URL from base path
 */
export function getRelativeUrl(from: string, to: string): string {
  const fromParts = from.split('/').filter(Boolean);
  const toParts = to.split('/').filter(Boolean);
  
  // Remove filename if present
  if (fromParts.length > 0 && !fromParts[fromParts.length - 1]?.includes('.')) {
    fromParts.push('');
  }
  
  let i = 0;
  while (i < fromParts.length - 1 && i < toParts.length && fromParts[i] === toParts[i]) {
    i++;
  }
  
  const upCount = fromParts.length - i - 1;
  const downParts = toParts.slice(i);
  
  const result = [];
  
  for (let j = 0; j < upCount; j++) {
    result.push('..');
  }
  
  result.push(...downParts);
  
  return result.length === 0 ? './' : result.join('/');
}

/**
 * Checks if a URL is absolute (has protocol)
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(url);
}

/**
 * Checks if a URL is relative
 */
export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url);
}

/**
 * Resolves a relative URL against a base URL
 */
export function resolveUrl(base: string, relative: string): string {
  if (isAbsoluteUrl(relative)) {
    return relative;
  }
  
  try {
    return new URL(relative, base).toString();
  } catch {
    return relative;
  }
}

/**
 * Extracts the filename from a URL path
 */
export function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1] || '';
  } catch {
    return '';
  }
}

/**
 * Extracts the file extension from a URL
 */
export function getFileExtensionFromUrl(url: string): string {
  const filename = getFilenameFromUrl(url);
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Creates a slug from a string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Shortens a URL for display
 */
export function shortenUrl(url: string, maxLength = 50): string {
  try {
    const parsed = new URL(url);
    const display = `${parsed.hostname}${parsed.pathname}`;
    
    if (display.length <= maxLength) {
      return display;
    }
    
    // Shorten path
    const parts = display.split('/').filter(Boolean);
    if (parts.length > 2) {
      return `${parts[0]}/.../${parts[parts.length - 1]}`;
    }
    
    return display.slice(0, maxLength - 3) + '...';
  } catch {
    return url.slice(0, maxLength);
  }
}
