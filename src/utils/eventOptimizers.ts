
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
  let lastExecution = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const context = this;
    const elapsed = now - lastCall;
    
    if (elapsed >= limit) {
      lastCall = now;
      func.apply(context, args);
      lastExecution = now;
    } else {
      // For events that need to catch the final position (like scroll end)
      // Clear the timeout if there is one
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      // Set a timeout for the end of the throttling period
      timeout = setTimeout(() => {
        // Only execute if enough time has passed since the last execution
        if (Date.now() - lastExecution >= limit) {
          func.apply(context, args);
          lastExecution = Date.now();
        }
        timeout = null;
      }, limit - elapsed);
    }
  };
}

/**
 * Creates passive event listeners for common events to improve scroll performance
 * @param element The element to attach listeners to
 * @param events Object mapping event names to handlers
 */
export function addPassiveEventListeners(
  element: HTMLElement | Window | Document,
  events: Record<string, (e: Event) => void>
): () => void {
  // Events that benefit from passive listeners
  const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
  
  // Store cleanup functions
  const cleanupFunctions: Array<() => void> = [];
  
  Object.entries(events).forEach(([eventName, handler]) => {
    const options = passiveEvents.includes(eventName) ? { passive: true } : undefined;
    
    element.addEventListener(eventName, handler, options);
    cleanupFunctions.push(() => {
      element.removeEventListener(eventName, handler);
    });
  });
  
  // Return a cleanup function that removes all listeners
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}
