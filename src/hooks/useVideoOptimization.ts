
import { useEffect, useRef, useState, RefObject } from 'react';

interface UseVideoOptimizationOptions {
  threshold?: number;
  rootMargin?: string;
  lazyLoad?: boolean;
  priorityLoad?: boolean;
}

/**
 * Hook for optimizing video loading based on viewport visibility
 */
export function useVideoOptimization(
  options: UseVideoOptimizationOptions = {}
): [RefObject<HTMLDivElement>, boolean, boolean] {
  const {
    threshold = 0.1,
    rootMargin = '200px',
    lazyLoad = true,
    priorityLoad = false
  } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Initialize visibility state based on priority
  useEffect(() => {
    if (priorityLoad) {
      setIsVisible(true);
      setIsLoaded(true);
    }
  }, [priorityLoad]);
  
  // Set up intersection observer to detect when video container enters viewport
  useEffect(() => {
    if (!containerRef.current || priorityLoad || !lazyLoad) return;
    
    // If already visible and loaded, no need to observe
    if (isVisible && isLoaded) return;
    
    const observerOptions = {
      root: null,
      rootMargin,
      threshold
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        setIsLoaded(true);
        
        // Once loaded, disconnect observer to save resources
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      }
    };
    
    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);
    observerRef.current.observe(containerRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [lazyLoad, priorityLoad, rootMargin, threshold, isVisible, isLoaded]);
  
  return [containerRef, isVisible, isLoaded];
}
