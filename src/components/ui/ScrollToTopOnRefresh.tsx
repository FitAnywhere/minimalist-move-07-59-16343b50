
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnRefresh = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Handle route changes
    if (!isInitialRender.current && prevPathRef.current !== pathname) {
      window.scrollTo(0, 0);
      prevPathRef.current = pathname;
    }

    // Mark initial render complete
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [pathname]);

  useEffect(() => {
    // This runs on initial mount
    window.scrollTo(0, 0);
    
    // Special handling for the box page
    if (window.location.pathname === '/box') {
      console.log('On Box page - ensuring proper page load behavior');
      
      // Ensure URL is clean (no query params that might be leftovers)
      if (window.location.search) {
        window.history.replaceState(null, null, '/box');
      }
      
      // Force scroll to top
      window.scrollTo(0, 0);
    }
    
    // Handle direct navigation or refresh
    const handleDirectNavigation = () => {
      const isPageRefresh = performance.navigation && 
        (performance.navigation.type === 1 || 
        sessionStorage.getItem('page_refreshing') === 'true');
      
      if (isPageRefresh) {
        sessionStorage.removeItem('page_refreshing');
        console.log('Page was refreshed, ensuring correct path:', window.location.pathname);
        
        // Specifically handle Box page refresh
        if (window.location.pathname === '/box' || 
            window.location.pathname.includes('/box')) {
          // Force correct URL if needed
          if (window.location.pathname !== '/box') {
            window.history.replaceState(null, null, '/box');
          }
          
          // Extra scroll enforcement with slight delay to ensure rendering completes
          setTimeout(() => window.scrollTo(0, 0), 100);
        }
      }
    };
    
    // Set up beforeunload for refresh detection
    const handleBeforeUnload = () => {
      // Set a session storage flag that we're refreshing
      sessionStorage.setItem('page_refreshing', 'true');
      // Also set the current path so we know where to redirect back to
      sessionStorage.setItem('last_path', pathname);
    };
    
    handleDirectNavigation();
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // If we landed here via redirect from 404.html
    if (sessionStorage.getItem('redirectPath')) {
      const redirectPath = sessionStorage.getItem('redirectPath');
      console.log('Handling redirect from 404.html to:', redirectPath);
      sessionStorage.removeItem('redirectPath');
      
      // Give browser a moment to settle
      setTimeout(() => {
        // Force the correct path
        window.history.replaceState(null, null, redirectPath);
        
        // Extra enforcement for the Box page
        if (redirectPath?.includes('box')) {
          // Force to /box if the path contains box but isn't exactly /box
          if (redirectPath !== '/box') {
            window.history.replaceState(null, null, '/box');
          }
          setTimeout(() => window.scrollTo(0, 0), 100); 
        }
      }, 10);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRefresh;
