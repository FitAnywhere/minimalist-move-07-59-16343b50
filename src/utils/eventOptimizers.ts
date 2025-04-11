
/**
 * Utility functions to optimize event handling
 */

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 150
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per the specified wait period.
 * 
 * @param func The function to throttle
 * @param limit The number of milliseconds to throttle invocations to
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit = 100
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const context = this;
    const timeSinceLastCall = now - lastCall;
    
    // First check if we're outside the limit window
    if (timeSinceLastCall >= limit) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      func.apply(context, args);
      lastCall = now;
    } else {
      // If we're inside the limit window and no timeout is scheduled,
      // schedule a timeout to execute at the end of the limit window
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          timeoutId = null;
          func.apply(context, args);
        }, limit - timeSinceLastCall);
      }
    }
  };
}

/**
 * Creates a requestAnimationFrame-based throttled function that's useful for animations
 * and visual updates to ensure they run at optimal times in the browser's render cycle.
 * 
 * @param func The function to RAF-throttle 
 * @returns A RAF-throttled version of the function
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          func.apply(context, lastArgs);
        }
        rafId = null;
      });
    }
  };
}
