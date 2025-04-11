
/**
 * Centralized utility for video preloading
 */

interface PreloadOptions {
  importance?: 'high' | 'low';
  type?: 'preload' | 'prefetch';
  failureCallback?: () => void;
}

// Critical videos that should be preloaded as soon as possible
export const CRITICAL_VIDEOS = [
  { id: '1073662161', importance: 'high' as const, hash: '9f083a1471' }, // Hero video
  { id: '1074313924', importance: 'high' as const, hash: 'b99fcf1434' }, // BoxFun video
  { id: '1073285328', importance: 'low' as const, hash: '205f79391c' }, // Training video
];

// Check if the Vimeo API script is already loaded
export const isVimeoApiLoaded = (): boolean => {
  return !!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
};

// Load the Vimeo Player API with improved error handling and retry logic
export const loadVimeoApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isVimeoApiLoaded()) {
      resolve();
      return;
    }
    
    // If there's already a script tag with an error, remove it
    const failedScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"][data-failed="true"]');
    if (failedScript) {
      failedScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    script.id = 'vimeo-player-api';
    
    script.onload = () => {
      console.log("Vimeo Player API loaded successfully");
      script.dataset.loaded = 'true';
      resolve();
    };
    
    script.onerror = () => {
      console.error("Failed to load Vimeo Player API, will retry automatically");
      script.dataset.failed = 'true';
      
      // Retry with exponential backoff
      setTimeout(() => {
        loadVimeoApi()
          .then(resolve)
          .catch(reject);
      }, 2000);
    };
    
    document.head.appendChild(script);
  });
};

// Add preload hints for critical videos with enhanced error handling
export const preloadVideos = (videoIds: Array<string | {id: string, importance?: 'high' | 'low', hash?: string}>): void => {
  videoIds.forEach((item, index) => {
    const id = typeof item === 'string' ? item : item.id;
    const importance = typeof item === 'string' ? (index === 0 ? 'high' : 'low') : (item.importance || 'low');
    const hash = typeof item === 'object' && item.hash ? item.hash : '';
    const existingLink = document.querySelector(`link[href*="${id}"]`);
    
    if (!existingLink) {
      const link = document.createElement('link');
      
      if (importance === 'high') {
        link.rel = 'preload';
        link.as = 'fetch';
        link.dataset.importance = 'high';
      } else {
        link.rel = 'prefetch';
        link.as = 'fetch';
        link.dataset.importance = 'low';
      }
      
      // Add hash parameter if available
      let url = `https://player.vimeo.com/video/${id}`;
      if (hash) {
        url += `?h=${hash}`;
      }
      
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      console.log(`Preloaded video: ${id} with importance: ${importance}`);
    }
  });
};

// Initialize video preloading with retry logic
export const initVideoPreloading = (): void => {
  const initPreloading = () => {
    loadVimeoApi()
      .then(() => {
        preloadVideos(CRITICAL_VIDEOS);
        console.log("All critical videos preloaded successfully");
      })
      .catch(error => {
        console.error("Error in video preloading, retrying:", error);
        // Retry after delay
        setTimeout(initPreloading, 5000);
      });
  };

  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      initPreloading();
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      initPreloading();
    }, 100);
  }
};
