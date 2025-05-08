
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ScrollToTopOnRefresh = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
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
    // First, handle direct access to box page
    if (sessionStorage.getItem('isBoxPage') === 'true') {
      console.log('Box page direct access detected');
      sessionStorage.removeItem('isBoxPage');
      
      // Ensure we're on the box page
      if (pathname !== '/box') {
        console.log('Redirecting to box page from:', pathname);
        navigate('/box', { replace: true });
      }
    }
    
    // Check for refresh path stored by beforeunload event
    const refreshPath = sessionStorage.getItem('refreshPath');
    if (refreshPath) {
      console.log('Detected page refresh, stored path was:', refreshPath);
      sessionStorage.removeItem('refreshPath');
      
      // If refreshed on box page, ensure we're there
      if (refreshPath.includes('/box') && pathname !== '/box') {
        console.log('Box page was refreshed, restoring navigation');
        navigate('/box', { replace: true });
        // Force scroll to top
        window.scrollTo(0, 0);
        return;
      }
    }

    // This runs on initial mount for regular navigation
    window.scrollTo(0, 0);
    
    // Check if we have a pending redirect from 404.html
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      console.log('Processing redirect path from 404.html:', redirectPath);
      sessionStorage.removeItem('redirectPath');
      
      if (redirectPath.includes('/box')) {
        console.log('Redirecting to box page');
        // Give browser a moment to settle
        setTimeout(() => {
          if (pathname !== '/box') {
            navigate('/box', { replace: true });
          }
          window.scrollTo(0, 0);
        }, 10);
      }
    }
    
  }, [pathname, navigate]);

  return null;
};

export default ScrollToTopOnRefresh;
