/**
 * Delay and Promise Utilities
 */

/**
 * Creates a promise that resolves after a delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(resolve, ms);
    return () => clearTimeout(timeoutId);
  });
}

/**
 * Creates a promise that never resolves
 */
export function never(): Promise<never> {
  return new Promise(() => {
    // This promise never resolves
  });
}

/**
 * Wraps a value in a promise
 */
export function resolve<T>(value: T | PromiseLike<T>): Promise<T> {
  return Promise.resolve(value);
}

/**
 * Rejects with the given error after a delay
 */
export function rejectAfter<T>(
  error: Error,
  ms: number
): Promise<T> {
  return new Promise((_, reject) => {
    const timeoutId = setTimeout(() => reject(error), ms);
    return () => clearTimeout(timeoutId);
  });
}

/**
 * Creates a cancellable promise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  error?: Error
): Promise<T> {
  const timeoutError = error ?? new Error(`Operation timed out after ${ms}ms`);
  
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(timeoutError), ms);
    
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Attempts a promise multiple times with delay between attempts
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    /** Maximum number of attempts */
    maxAttempts?: number;
    /** Delay between attempts in ms */
    delay?: number;
    /** Function to determine if error is retriable */
    isRetriable?: (error: unknown) => boolean;
    /** Callback on retry */
    onRetry?: (error: unknown, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay: delayMs = 1000,
    isRetriable = () => true,
    onRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts && isRetriable(error)) {
        onRetry?.(error, attempt);
        await delay(delayMs);
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}

/**
 * Executes promises in parallel with a limit on concurrency
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  const queue = items.map((item, index) => ({ item, index }));
  const executing = new Set<Promise<void>>();
  let currentIndex = 0;

  async function executeNext(): Promise<void> {
    if (currentIndex >= queue.length) return;

    const { item, index } = queue[currentIndex];
    currentIndex++;

    const promise = Promise.resolve()
      .then(() => fn(item, index))
      .then((result) => {
        results[index] = result;
      })
      .finally(() => {
        executing.delete(promise);
      });

    executing.add(promise);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }

    await executeNext();
  }

  const initialExecutors = Array.from(
    { length: Math.min(concurrency, queue.length) },
    () => executeNext()
  );

  await Promise.all(initialExecutors);

  return results;
}

/**
 * Awaits all promises, collecting results and errors
 */
export async function settle<T>(
  promises: Promise<T>[]
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>> {
  const results: Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }> = [];

  for (const promise of promises) {
    try {
      const value = await promise;
      results.push({ status: 'fulfilled', value });
    } catch (error) {
      results.push({ status: 'rejected', reason: error });
    }
  }

  return results;
}

/**
 * Runs an async function with a delay
 */
export async function waitAndRun<T>(
  fn: () => Promise<T>,
  delayMs: number
): Promise<T> {
  await delay(delayMs);
  return fn();
}

/**
 * Creates a promise that resolves when condition is true
 */
export function waitUntil(
  condition: () => boolean,
  options: {
    /** Interval to check condition in ms */
    interval?: number;
    /** Maximum time to wait in ms */
    timeout?: number;
  } = {}
): Promise<void> {
  const { interval = 100, timeout = Infinity } = options;
  
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
        return;
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error('Condition not met before timeout'));
        return;
      }
      
      setTimeout(check, interval);
    };
    
    check();
  });
}
