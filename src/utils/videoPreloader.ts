
/**
 * Video preloading utilities
 * Re-exports functions from the consolidated videoUtils module
 */

import { 
  prefetchCriticalVideos, 
  initVideoPreloading, 
  initVideoOptimization 
} from './videoUtils';

// Re-export the video utilities needed for preloading
export { 
  prefetchCriticalVideos, 
  initVideoPreloading, 
  initVideoOptimization 
};

// For backward compatibility, create an initialize function that calls all preloading functions
export const initialize = (): void => {
  initVideoOptimization();
};

/**
 * Initializes video preloading
 * This is just a wrapper around the consolidated initVideoPreloading function
 * for backward compatibility
 */
export default {
  initialize: initVideoPreloading
};
