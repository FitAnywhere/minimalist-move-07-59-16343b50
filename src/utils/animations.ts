
import { useEffect, useState, useRef, RefObject, useCallback } from 'react';

// Optimized useInView hook with memoized callback and better performance
export const useInView = (
  ref: RefObject<HTMLElement>, 
  options = {}, 
  once = true,
  onEnterView?: () => void,
  onExitView?: () => void
) => {
  const [isInView, setIsInView] = useState(false);
  const wasInViewRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    const defaultOptions = { threshold: 0.1, ...options };
    
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
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
    }, defaultOptions);
    
    observerRef.current.observe(element);
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref, once, onEnterView, onExitView, options]);
  
  return isInView;
};

// Optimized useParallax hook with passive event listener and request animation frame
export const useParallax = (ref: RefObject<HTMLElement>, speed = 0.1) => {
  const rafIdRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
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

// Memoized and optimized useScrollPosition hook
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  const handleScroll = useCallback(() => {
    if (throttleTimeoutRef.current) return;
    
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 100) { // 10fps throttle
      throttleTimeoutRef.current = setTimeout(() => {
        throttleTimeoutRef.current = null;
        handleScroll();
      }, 100 - (now - lastUpdateTimeRef.current));
      return;
    }
    
    lastUpdateTimeRef.current = now;
    
    rafIdRef.current = requestAnimationFrame(() => {
      setScrollPosition(window.scrollY);
    });
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleScroll]);
  
  return scrollPosition;
};

// Optimized useLazyLoad hook with better memory management
export const useLazyLoad = (ref: RefObject<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const img = ref.current;
    
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && img.dataset.src) {
        const src = img.dataset.src;
        
        // Create a new image to preload
        const newImage = new Image();
        newImage.onload = () => {
          img.src = src;
          setIsLoaded(true);
          observerRef.current?.unobserve(img);
        };
        newImage.src = src;
      }
    });
    
    observerRef.current.observe(img);
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref]);
  
  return isLoaded;
};

// Optimized useStaggeredFadeIn with better performance
export const useStaggeredFadeIn = (
  containerRef: RefObject<HTMLElement>,
  itemSelector: string,
  delay = 200,
  threshold = 0.1
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationStartedRef = useRef(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStartedRef.current) {
            const items = container.querySelectorAll(itemSelector);
            animationStartedRef.current = true;
            
            Array.from(items).forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('fade-in-visible');
              }, index * delay);
            });
            
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    
    observerRef.current.observe(container);
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [containerRef, itemSelector, delay, threshold]);
};

// Simplified hooks to reduce file size and improve performance
export const useShakeEffect = (ref: RefObject<HTMLElement>, delay = 0) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    const timerId = setTimeout(() => {
      element.classList.add('shake-animation');
      
      const handleAnimationEnd = () => {
        element.classList.remove('shake-animation');
      };
      
      element.addEventListener('animationend', handleAnimationEnd, { once: true });
      
      return () => {
        element.removeEventListener('animationend', handleAnimationEnd);
      };
    }, delay);
    
    return () => clearTimeout(timerId);
  }, [ref, delay]);
};

export const useTextUnderline = (ref: RefObject<HTMLElement>, delay = 0) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            element.classList.add('underline-animation');
          }, delay);
          observer.unobserve(element);
        }
      },
      { threshold: 0.2 }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [ref, delay]);
};
