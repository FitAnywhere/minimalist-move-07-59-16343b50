
/**
 * Utility functions for handling scrolling behavior
 */

// Handle smooth scrolling to a target element
export const scrollToElement = (targetId: string, offset = 100): void => {
  setTimeout(() => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  }, 100);
};

// Set up optimized event listener for anchor links
export const setupAnchorClickHandler = (): () => void => {
  const handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.hostname === window.location.hostname) {
      e.preventDefault();
      scrollToElement(anchor.hash);
      history.pushState(null, '', anchor.hash);
    }
  };
  
  document.addEventListener('click', handleAnchorClick, { passive: false });
  
  return () => {
    document.removeEventListener('click', handleAnchorClick);
  };
};

// Handle scroll to top functionality
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Handle navigation from external pages with targets
export const handleExternalNavigation = (location: any): void => {
  if (location.state?.fromExternalPage) {
    if (location.state.targetSection) {
      scrollToElement(`#${location.state.targetSection}`);
    } else {
      scrollToTop();
    }
  } else if (window.location.hash) {
    scrollToElement(window.location.hash);
  }
};

// Enable better touch/swipe detection for carousels
export const enableSmoothCarouselScrolling = (carouselElement: HTMLElement): (() => void) => {
  let startX: number;
  let isDragging = false;
  
  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touchX = e.touches[0].clientX;
    const diffX = startX - touchX;
    
    // Prevent page scroll while swiping carousel
    if (Math.abs(diffX) > 5) {
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = () => {
    isDragging = false;
  };
  
  if (carouselElement) {
    carouselElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    carouselElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    carouselElement.addEventListener('touchend', handleTouchEnd);
  }
  
  return () => {
    if (carouselElement) {
      carouselElement.removeEventListener('touchstart', handleTouchStart);
      carouselElement.removeEventListener('touchmove', handleTouchMove);
      carouselElement.removeEventListener('touchend', handleTouchEnd);
    }
  };
};
