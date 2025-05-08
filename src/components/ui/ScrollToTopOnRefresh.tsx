
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnRefresh = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top when path changes
    window.scrollTo(0, 0);
    
    // Handle page refresh scrolling
    const handleBeforeUnload = () => {
      // Set a session storage flag that we're refreshing
      sessionStorage.setItem('page_refreshing', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check if we're coming from a refresh
    const isRefresh = sessionStorage.getItem('page_refreshing') === 'true';
    if (isRefresh) {
      // Clear the flag and ensure we're at the top
      sessionStorage.removeItem('page_refreshing');
      window.scrollTo(0, 0);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRefresh;
