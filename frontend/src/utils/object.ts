/**
 * Object utilities
 */

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Set) {
    return new Set(Array.from(obj).map((item) => deepClone(item))) as unknown as T;
  }

  if (obj instanceof Map) {
    return new Map(
      Array.from(obj).map(([key, value]) => [key, deepClone(value)])
    ) as unknown as T;
  }

  if (obj instanceof Error) {
    const error = new Error(obj.message);
    error.name = obj.name;
    error.stack = obj.stack;
    return error as unknown as T;
  }

  const cloned = Object.create(Object.getPrototypeOf(obj));
  for (const key of Object.keys(obj)) {
    (cloned as Record<string, unknown>)[key] = deepClone(
      (obj as Record<string, unknown>)[key]
    );
  }

  return cloned;
}

/**
 * Get nested property value
 */
export function get<T>(
  obj: Record<string, unknown>,
  path: string | string[],
  defaultValue?: T
): T | undefined {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue as T;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result ?? defaultValue) as T;
}

/**
 * Set nested property value
 */
export function set(
  obj: Record<string, unknown>,
  path: string | string[],
  value: unknown
): void {
  const keys = Array.isArray(path) ? path : path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || current[key] === null || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Delete nested property
 */
export function del(obj: Record<string, unknown>, path: string | string[]): boolean {
  const keys = Array.isArray(path) ? path : path.split('.');
  if (keys.length === 0) return false;

  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (current[key] === null || typeof current[key] !== 'object') {
      return false;
    }
    current = current[key] as Record<string, unknown>;
  }

  return delete current[lastKey];
}

/**
 * Check if object has nested property
 */
export function has(obj: Record<string, unknown>, path: string | string[]): boolean {
  const keys = Array.isArray(path) ? path : path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return false;
    }
    if (typeof current !== 'object' || !(key in (current as Record<string, unknown>))) {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return true;
}

/**
 * Pick properties from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit properties from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, unknown>>(
  ...objects: T[]
): T {
  const result = {} as T;

  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        key in result &&
        typeof result[key] === 'object' &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(
          result[key] as Record<string, unknown>,
          value as Record<string, unknown>
        );
      } else {
        (result as Record<string, unknown>)[key] = value;
      }
    }
  }

  return result;
}

/**
 * Get object entries filtered by predicate
 */
export function entries<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: unknown, key: string) => boolean
): [string, unknown][] {
  return Object.entries(obj).filter(([key, value]) => predicate(value, key));
}

/**
 * Map object entries
 */
export function mapValues<T extends Record<string, unknown>, R>(
  obj: T,
  mapper: (value: T[keyof T], key: string) => R
): Record<string, R> {
  const result: Record<string, R> = {};
  for (const key of Object.keys(obj) as Array<keyof T>) {
    result[key as string] = mapper(obj[key], key as string);
  }
  return result;
}

/**
 * Get object size
 */
export function size(obj: Record<string, unknown>): number {
  return Object.keys(obj).length;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Invert object keys and values
 */
export function invert<T extends string | number | symbol>(
  obj: Record<T, string>
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key of Object.keys(obj)) {
    result[obj[key as T]] = key;
  }
  return result;
}

/**
 * Group object by key
 */
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Create object from entries
 */
export function fromEntries<T>(
  entries: [string | number | symbol, unknown][]
): Record<string | number | symbol, unknown> {
  return Object.fromEntries(entries);
}
