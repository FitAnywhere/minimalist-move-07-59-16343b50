
import { useEffect, useRef } from 'react';

type SectionVisibilityMap = Record<string, boolean>;

interface UseSectionObserverProps {
  sectionIds: string[];
  rootMargin?: string;
  threshold?: number;
  onVisibilityChange?: (id: string, isVisible: boolean) => void;
}

/**
 * Custom hook to observe when sections enter/exit the viewport
 */
export const useSectionObserver = ({
  sectionIds,
  rootMargin = '200px 0px',
  threshold = 0.1,
  onVisibilityChange
}: UseSectionObserverProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsVisibilityRef = useRef<SectionVisibilityMap>({});

  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      root: null,
      rootMargin,
      threshold
    };

    // Initialize the IntersectionObserver
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const isVisible = entry.isIntersecting;
        
        // Update visibility state
        sectionsVisibilityRef.current[id] = isVisible;
        
        // Notify callback if provided
        if (onVisibilityChange && id) {
          onVisibilityChange(id, isVisible);
        }
        
        // Stop observing sections that have become visible
        if (isVisible && observerRef.current) {
          observerRef.current.unobserve(entry.target);
        }
      });
    }, options);

    // Start observing each section
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionIds, rootMargin, threshold, onVisibilityChange]);

  return {
    sectionsVisibility: sectionsVisibilityRef.current
  };
};
