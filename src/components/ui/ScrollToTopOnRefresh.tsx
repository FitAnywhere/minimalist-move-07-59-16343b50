
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnRefresh = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Handle route changes
    if (prevPathRef.current !== pathname) {
      window.scrollTo(0, 0);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // This runs only on initial mount to handle direct URL access
    window.scrollTo(0, 0);
    
    // Set up page visibility change detection for better refresh handling
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User has returned to the page - might be a refresh
        window.scrollTo(0, 0);
      }
    };
    
    // Handle beforeunload for refresh detection
    const handleBeforeUnload = () => {
      // Set a session storage flag that we're refreshing
      sessionStorage.setItem('page_refreshing', 'true');
      // Also set the current path so we know where to redirect back to
      sessionStorage.setItem('last_path', pathname);
    };
    
    // Check if coming from refresh and handle accordingly
    const isRefresh = sessionStorage.getItem('page_refreshing') === 'true';
    if (isRefresh) {
      // Clear the flag
      sessionStorage.removeItem('page_refreshing');
      // Ensure we scroll to top
      window.scrollTo(0, 0);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRefresh;
