
import { useState, useEffect, useRef, RefObject } from 'react';
import { debounce, throttle } from './performance';

interface InViewOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

/**
 * Optimized hook that detects when an element is in the viewport
 * Uses debouncing and throttling for better performance
 * 
 * @param elementRef Reference to the element to observe
 * @param options IntersectionObserver options
 * @param runOnce Whether to run the callback only once
 * @param onEnterView Callback when element enters the viewport
 * @param onLeaveView Callback when element leaves the viewport
 * @returns Boolean indicating if the element is in view
 */
export function useInView(
  elementRef: RefObject<Element>,
  options: InViewOptions = {},
  runOnce: boolean = true,
  onEnterView?: () => void,
  onLeaveView?: () => void
): boolean {
  const [isInView, setIsInView] = useState(false);
  const hasTriggeredRef = useRef(false);
  
  const { root = null, rootMargin = '0px', threshold = 0, once = runOnce } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleIntersection = throttle((entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        setIsInView(true);
        if (onEnterView) onEnterView();
        
        if (once) {
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
          }
          
          // Disconnect observer if it should only run once
          if (observer && hasTriggeredRef.current) {
            observer.disconnect();
          }
        }
      } else {
        if (!once) {
          setIsInView(false);
          if (onLeaveView) onLeaveView();
        }
      }
    }, 100);

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [elementRef, root, rootMargin, threshold, once, onEnterView, onLeaveView]);

  return isInView;
}

/**
 * Optimized scroll handler using debouncing
 * 
 * @param callback Function to call on scroll
 * @param delay Debounce delay in ms
 * @returns Cleanup function
 */
export function useOptimizedScroll(callback: () => void, delay: number = 150): () => void {
  useEffect(() => {
    const handleScroll = debounce(() => {
      callback();
    }, delay);

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [callback, delay]);

  return () => {};
}

/**
 * Optimized resize handler using debouncing
 * 
 * @param callback Function to call on resize
 * @param delay Debounce delay in ms
 * @returns Cleanup function
 */
export function useOptimizedResize(callback: () => void, delay: number = 150): () => void {
  useEffect(() => {
    const handleResize = debounce(() => {
      callback();
    }, delay);

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [callback, delay]);

  return () => {};
}
