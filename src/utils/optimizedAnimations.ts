
import { useEffect, useState, useRef, RefObject, useCallback } from 'react';

interface InViewOptions extends IntersectionObserverInit {
  once?: boolean;
  onEnterView?: () => void;
  onExitView?: () => void;
}

/**
 * Optimized useInView hook with better performance
 */
export const useInView = (
  ref: RefObject<HTMLElement>, 
  options: InViewOptions = {}
) => {
  const { 
    threshold = 0.1, 
    root = null, 
    rootMargin = '0px', 
    once = true,
    onEnterView,
    onExitView
  } = options;
  
  const [isInView, setIsInView] = useState(false);
  const wasInViewRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const observerOptions = { threshold, root, rootMargin };
    
    observerRef.current = new IntersectionObserver(([entry]) => {
      const isNowInView = entry.isIntersecting;
      const viewStateChanged = wasInViewRef.current !== isNowInView;
      
      if (isNowInView) {
        setIsInView(true);
        if (viewStateChanged && onEnterView) {
          onEnterView();
        }
        
        // If once is true, unobserve after entering view
        if (once) {
          observerRef.current?.unobserve(element);
        }
      } else if (!once) {
        setIsInView(false);
        if (viewStateChanged && onExitView) {
          onExitView();
        }
      }
      
      wasInViewRef.current = isNowInView;
    }, observerOptions);
    
    observerRef.current.observe(element);
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref, threshold, root, rootMargin, once, onEnterView, onExitView]);
  
  return isInView;
};

/**
 * Optimized useParallax hook with requestAnimationFrame for better performance
 */
export const useParallax = (ref: RefObject<HTMLElement>, speed = 0.1) => {
  const rafIdRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      
      rafIdRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        element.style.transform = `translateY(${scrollY * speed}px)`;
        isScrollingRef.current = false;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [ref, speed]);
};

/**
 * Hook for lazy loading images with IntersectionObserver
 */
export const useLazyLoadImage = (options: { rootMargin?: string; threshold?: number } = {}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { rootMargin = '200px', threshold = 0.1 } = options;
  
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.dataset.src) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && img.dataset.src) {
            const dataSrc = img.dataset.src;
            
            // Create a new image object to preload
            const tempImg = new Image();
            tempImg.onload = () => {
              if (img) {
                img.src = dataSrc;
                setIsLoaded(true);
              }
            };
            tempImg.src = dataSrc;
            
            observer.unobserve(img);
          }
        });
      },
      { rootMargin, threshold }
    );
    
    observer.observe(img);
    
    return () => {
      if (img) observer.unobserve(img);
    };
  }, [rootMargin, threshold]);
  
  return { imgRef, isLoaded };
};

/**
 * Hook for lazy loading content with IntersectionObserver
 */
export const useLazyLoad = (
  options: { rootMargin?: string; threshold?: number; onVisible?: () => void } = {}
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const { rootMargin = '200px', threshold = 0.1, onVisible } = options;
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (onVisible) onVisible();
            observer.unobserve(element);
          }
        });
      },
      { rootMargin, threshold }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, onVisible]);
  
  return { elementRef, isVisible };
};

/**
 * Optimized staggered animation hook
 */
export const useStaggeredAnimation = (
  containerRef: RefObject<HTMLElement>,
  options: {
    itemSelector: string;
    delayIncrement?: number;
    visibleClass?: string;
    threshold?: number;
    rootMargin?: string;
  }
) => {
  const {
    itemSelector,
    delayIncrement = 100,
    visibleClass = 'animate-fade-in',
    threshold = 0.1,
    rootMargin = '0px'
  } = options;
  
  const animatedRef = useRef(false);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container || animatedRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            
            const items = container.querySelectorAll(itemSelector);
            
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add(visibleClass);
              }, index * delayIncrement);
            });
            
            observer.unobserve(container);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    observer.observe(container);
    
    return () => observer.disconnect();
  }, [containerRef, itemSelector, delayIncrement, visibleClass, threshold, rootMargin]);
};
