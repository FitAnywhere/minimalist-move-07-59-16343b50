
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
    // This runs on initial mount
    window.scrollTo(0, 0);
    
    // Handle direct navigation or refresh
    const handleDirectNavigation = () => {
      // Check if this is the initial page load
      const isInitialLoad = !sessionStorage.getItem('app_initialized');
      
      if (isInitialLoad) {
        // Mark that the app has been initialized
        sessionStorage.setItem('app_initialized', 'true');
        // Ensure we're at the top
        window.scrollTo(0, 0);
        
        // If we arrived via redirect from 404.html, make sure the URL is clean
        if (window.location.search.includes('?/')) {
          const targetPath = window.location.search.split('?/')[1].split('&')[0];
          window.history.replaceState(null, null, '/' + targetPath);
          // Force scroll to top after URL cleanup
          setTimeout(() => window.scrollTo(0, 0), 100);
        }
      }
    };
    
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
      // Get last path before refresh
      const lastPath = sessionStorage.getItem('last_path');
      
      // If we're not already on that path, ensure correct navigation
      if (lastPath && lastPath !== pathname && !window.location.pathname.includes(lastPath)) {
        window.history.replaceState(null, null, lastPath);
      }
      
      // Ensure we scroll to top
      window.scrollTo(0, 0);
    }

    // Run direct navigation handling
    handleDirectNavigation();
    
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
