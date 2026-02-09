/**
 * Retry Utility
 * 
 * Provides retry logic with exponential backoff for failed operations.
 * Useful for network requests that may fail transiently.
 * 
 * @module utils/retry
 */

// ============================================================================
// Types
// ============================================================================

/** Options for retry configuration */
export interface RetryOptions {
  /** Maximum number of retries (default: 3) */
  maxRetries?: number;
  /** Initial delay in ms (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in ms (default: 30000) */
  maxDelay?: number;
  /** Backoff multiplier (default: 2) */
  backoffMultiplier?: number;
  /** Jitter factor for randomization (default: 0.1) */
  jitter?: number;
  /** Function to determine if error is retryable */
  isRetryable?: (error: unknown) => boolean;
  /** Callback on retry attempt */
  onRetry?: (error: unknown, attempt: number) => void;
}

/** Default retry options */
const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: 0.1,
  isRetryable: () => true,
  onRetry: () => {},
};

// ============================================================================
// Utility Functions
// ============================================================================

/** Calculate delay with exponential backoff and jitter */
function calculateDelay(
  attempt: number,
  config: Required<RetryOptions>
): number {
  const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelay);
  
  // Add jitter
  const jitterRange = cappedDelay * config.jitter;
  const jitter = (Math.random() - 0.5) * 2 * jitterRange;
  
  return Math.max(0, Math.round(cappedDelay + jitter));
}

/** Sleep for specified milliseconds */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves to the function's result
 * 
 * @example
 * ```ts
 * const result = await retry(
 *   () => fetch('/api/data'),
 *   {
 *     maxRetries: 3,
 *     initialDelay: 500,
 *     isRetryable: (err) => err instanceof NetworkError
 *   }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      if (attempt === config.maxRetries || !config.isRetryable(error)) {
        throw error;
      }
      
      // Notify about retry
      config.onRetry(error, attempt + 1);
      
      // Wait before retrying
      const delay = calculateDelay(attempt, config);
      await sleep(delay);
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Create a retryable version of a function
 * 
 * @param fn - Async function to wrap
 * @param options - Retry configuration options
 * @returns Retryable version of the function
 * 
 * @example
 * ```ts
 * const fetchWithRetry = retryable(fetch, { maxRetries: 3 });
 * const result = await fetchWithRetry('/api/data');
 * ```
 */
export function retryable<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return ((...args: Parameters<T>) => {
    return retry(() => fn(...args), options);
  }) as T;
}

// ============================================================================
// Specialized Retry Helpers
// ============================================================================

/** Retry options for network requests */
export const networkRetryOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 500,
  maxDelay: 10000,
  backoffMultiplier: 2,
  jitter: 0.1,
  isRetryable: (error) => {
    // Retry on network errors and 5xx server errors
    if (error instanceof TypeError) return true; // Network error
    if (error instanceof Error && 'status' in error) {
      const status = (error as { status: number }).status;
      return status >= 500;
    }
    return false;
  },
};

/** Retry options for blockchain transactions */
export const blockchainRetryOptions: RetryOptions = {
  maxRetries: 5,
  initialDelay: 2000,
  maxDelay: 60000,
  backoffMultiplier: 1.5,
  jitter: 0.2,
  isRetryable: (error) => {
    // Blockchain transactions may fail due to various reasons
    const errorMessage = String(error).toLowerCase();
    // Retry on nonce, fee, and temporary failures
    return (
      errorMessage.includes('nonce') ||
      errorMessage.includes('fee') ||
      errorMessage.includes('conflicting') ||
      errorMessage.includes('temporary')
    );
  },
};

// ============================================================================
// Async Pool with Retry
// ============================================================================

/**
 * Result of a pooled operation
 */
export interface PooledResult<T> {
  /** The result if successful */
  result?: T;
  /** The error if failed */
  error?: unknown;
  /** Number of attempts made */
  attempts: number;
  /** Whether the operation succeeded */
  success: boolean;
}

/**
 * Execute multiple async operations with retry logic
 * 
 * @param tasks - Array of async functions to execute
 * @param options - Retry configuration
 * @returns Promise resolving to array of results
 */
export async function retryPool<T>(
  tasks: Array<() => Promise<T>>,
  options: RetryOptions = {}
): Promise<PooledResult<T>[]> {
  const results: PooledResult<T>[] = [];
  
  await Promise.all(
    tasks.map(async (task, index) => {
      const result: PooledResult<T> = {
        attempts: 0,
        success: false,
      };
      
      try {
        const value = await retry(task, options);
        result.result = value;
        result.success = true;
      } catch (error) {
        result.error = error;
      }
      
      results[index] = result;
    })
  );
  
  return results;
}

// ============================================================================
// Circuit Breaker Pattern
// ============================================================================

/**
 * Circuit breaker states
 */
export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerOptions {
  /** Number of failures before opening circuit */
  failureThreshold?: number;
  /** Time to wait before half-open (ms) */
  halfOpenTime?: number;
  /** Success threshold for closing from half-open */
  successThreshold?: number;
}

/** Circuit breaker state interface */
interface CircuitBreakerStateInternal {
  state: CircuitBreakerState;
  failures: number;
  lastFailure: number;
  successes: number;
}

/**
 * Circuit breaker for preventing cascade failures
 */
export function createCircuitBreaker(options: CircuitBreakerOptions = {}) {
  const config: Required<CircuitBreakerOptions> = {
    failureThreshold: 5,
    halfOpenTime: 30000,
    successThreshold: 2,
    ...options,
  };
  
  const stateData: CircuitBreakerStateInternal = {
    state: 'closed',
    failures: 0,
    lastFailure: 0,
    successes: 0,
  };
  
  function getState(): CircuitBreakerState {
    if (stateData.state === 'open') {
      const timeSinceFailure = Date.now() - stateData.lastFailure;
      if (timeSinceFailure >= config.halfOpenTime) {
        stateData.state = 'half-open';
      }
    }
    return stateData.state;
  }
  
  async function execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = getState();
    
    if (currentState === 'open') {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      onSuccess();
      return result;
    } catch (error) {
      onFailure();
      throw error;
    }
  }
  
  function onSuccess(): void {
    if (stateData.state === 'half-open') {
      stateData.successes++;
      if (stateData.successes >= config.successThreshold) {
        reset();
      }
    }
  }
  
  function onFailure(): void {
    stateData.failures++;
    stateData.lastFailure = Date.now();
    
    if (stateData.state === 'closed' && stateData.failures >= config.failureThreshold) {
      stateData.state = 'open';
    }
    
    if (stateData.state === 'half-open') {
      stateData.state = 'open';
    }
  }
  
  function reset(): void {
    stateData.state = 'closed';
    stateData.failures = 0;
    stateData.successes = 0;
    stateData.lastFailure = 0;
  }
  
  return {
    getState,
    execute,
    reset,
  };
}

export default retry;
