/**
 * Storage utilities for localStorage and sessionStorage
 */

/**
 * Set a value in localStorage
 */
export function setStorage(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a value from localStorage
 */
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Remove a value from localStorage
 */
export function removeStorage(key: string): boolean {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all localStorage
 */
export function clearStorage(): boolean {
  try {
    window.localStorage.clear();
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Set a value in sessionStorage
 */
export function setSession(key: string, value: unknown): boolean {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a value from sessionStorage
 */
export function getSession<T>(key: string, defaultValue: T): T {
  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Remove a value from sessionStorage
 */
export function removeSession(key: string): boolean {
  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all sessionStorage
 */
export function clearSession(): boolean {
  try {
    window.sessionStorage.clear();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage size in bytes
 */
export function getStorageSize(): { local: number; session: number } {
  const getSize = (storage: Storage): number => {
    let total = 0;
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        total += (storage.getItem(key)?.length || 0) * 2; // UTF-16
      }
    }
    return total;
  };

  return {
    local: getSize(window.localStorage),
    session: getSize(window.sessionStorage),
  };
}
