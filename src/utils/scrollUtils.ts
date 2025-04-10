
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
