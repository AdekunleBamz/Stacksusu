/**
 * Promise utilities
 */

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, onRetry } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delayMs = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
        onRetry?.(lastError, attempt);
        await delay(delayMs);
      }
    }
  }

  throw lastError!;
}

/**
 * Run multiple promises with timeout
 */
export async function raceWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

/**
 * Run promises with concurrency limit
 */
export async function concurrent<T, R>(
  tasks: (() => Promise<R>)[],
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  const executing = new Set<Promise<void>>();

  for (const task of tasks) {
    const promise = (async () => {
      results.push(await task());
    })();

    executing.add(promise);
    promise.finally(() => executing.delete(promise));

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Execute promises sequentially
 */
export async function sequential<T, R>(
  tasks: (() => Promise<R>)[]
): Promise<R[]> {
  const results: R[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

/**
 * Create a promise that resolves after a condition is met
 */
export function waitFor<T>(
  condition: () => T | Promise<T>,
  options: {
    timeout?: number;
    interval?: number;
  } = {}
): Promise<T> {
  const { timeout = 10000, interval = 100 } = options;
  let timedOut = false;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      timedOut = true;
      reject(new Error('waitFor timed out'));
    }, timeout);
  });

  const checkPromise = new Promise<T>((resolve, reject) => {
    const check = async () => {
      try {
        const result = await condition();
        if (!timedOut) {
          if (result) {
            resolve(result);
          } else {
            setTimeout(check, interval);
          }
        }
      } catch (error) {
        reject(error);
      }
    };
    check();
  });

  return Promise.race([checkPromise, timeoutPromise]);
}

/**
 * Create a deferred promise
 */
export function deferred<T = void>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Flatten array of promises
 */
export async function flattenPromises<T>(
  promises: Promise<T>[]
): Promise<T[]> {
  const results = await Promise.all(promises);
  return results.flat();
}
