
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that handles scrolling to the top of the page on refresh
 * and initial page load, but not on navigation within the app
 */
const ScrollToTopOnRefresh = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if this is a page load/refresh using navigation type
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigation/type
    if (performance.navigation && (
      performance.navigation.type === 0 || // TYPE_NAVIGATE
      performance.navigation.type === 1    // TYPE_RELOAD
    )) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Also scroll to top when the pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRefresh;
