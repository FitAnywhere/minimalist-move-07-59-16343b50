
import { useEffect, useState, useRef, RefObject, useCallback } from 'react';

// Optimized useInView hook with memoized callback
export const useInView = (
  ref: RefObject<HTMLElement>, 
  options = {}, 
  once = true,
  onEnterView?: () => void,
  onExitView?: () => void
) => {
  const [isInView, setIsInView] = useState(false);
  const wasInViewRef = useRef(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    const defaultOptions = { threshold: 0.1, ...options };
    
    const observer = new IntersectionObserver(([entry]) => {
      const isNowInView = entry.isIntersecting;
      const viewStateChanged = wasInViewRef.current !== isNowInView;
      
      if (isNowInView) {
        setIsInView(true);
        if (viewStateChanged) {
          onEnterView?.();
        }
        
        // If once is true, unobserve after entering view
        if (once) {
          observer.unobserve(element);
        }
      } else if (!once) {
        setIsInView(false);
        if (viewStateChanged) {
          onExitView?.();
        }
      }
      
      wasInViewRef.current = isNowInView;
    }, defaultOptions);
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [ref, once, onEnterView, onExitView, options]);
  
  return isInView;
};

// Optimized useParallax hook with passive event listener
export const useParallax = (ref: RefObject<HTMLElement>, speed = 0.1) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    let rafId: number | null = null;
    
    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        element.style.transform = `translateY(${scrollY * speed}px)`;
        rafId = null;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref, speed]);
};

// Optimized useScrollPosition hook with throttling
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const updatePosition = () => {
      if (throttleTimeout.current) return;
      
      throttleTimeout.current = setTimeout(() => {
        setScrollPosition(window.scrollY);
        throttleTimeout.current = null;
      }, 100); // 100ms throttle
    };
    
    window.addEventListener('scroll', updatePosition, { passive: true });
    updatePosition();
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, []);
  
  return scrollPosition;
};

// Remaining hooks kept but with optimized patterns
export const useLazyLoad = (ref: RefObject<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const img = ref.current;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && img.dataset.src) {
        img.src = img.dataset.src;
        img.onload = () => setIsLoaded(true);
        observer.unobserve(img);
      }
    });
    
    observer.observe(img);
    
    return () => observer.disconnect();
  }, [ref]);
  
  return isLoaded;
};

export const useStaggeredFadeIn = (
  containerRef: RefObject<HTMLElement>,
  itemSelector: string,
  delay = 200,
  threshold = 0.1
) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const items = container.querySelectorAll(itemSelector);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(items).forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('fade-in-visible');
              }, index * delay);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    
    observer.observe(container);
    
    return () => {
      observer.disconnect();
    };
  }, [containerRef, itemSelector, delay, threshold]);
};

export const useShakeEffect = (ref: RefObject<HTMLElement>, delay = 0) => {
  useEffect(() => {
    if (!ref.current) return;
    
    setTimeout(() => {
      ref.current?.classList.add('shake-animation');
      
      const handleAnimationEnd = () => {
        ref.current?.classList.remove('shake-animation');
      };
      
      ref.current?.addEventListener('animationend', handleAnimationEnd);
      
      return () => {
        ref.current?.removeEventListener('animationend', handleAnimationEnd);
      };
    }, delay);
  }, [ref, delay]);
};

export const useTextUnderline = (ref: RefObject<HTMLElement>, delay = 0) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            ref.current?.classList.add('underline-animation');
          }, delay);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.2
    });
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, delay]);
};
