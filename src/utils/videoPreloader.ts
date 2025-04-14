
/**
 * Centralized utility for video preloading
 */

interface PreloadOptions {
  importance?: 'high' | 'low';
  type?: 'preload' | 'prefetch';
  fetchpriority?: 'high' | 'low' | 'auto';
}

// Critical videos that should be preloaded as soon as possible
export const CRITICAL_VIDEOS = [
  { id: '1067255623', importance: 'high' as const, fetchpriority: 'high' as const }, // Hero video
  { id: '1067257145', importance: 'low' as const, fetchpriority: 'low' as const }, // TRX video
  { id: '1067257124', importance: 'low' as const, fetchpriority: 'low' as const }, // Bands video 
  { id: '1067256372', importance: 'low' as const, fetchpriority: 'low' as const }, // Testimonial videos
  { id: '1067256325', importance: 'low' as const, fetchpriority: 'low' as const },
  { id: '1067256399', importance: 'low' as const, fetchpriority: 'low' as const },
  { id: '1073152410', importance: 'low' as const, fetchpriority: 'low' as const } // TrainingVault video
];

// Check if the Vimeo API script is already loaded
export const isVimeoApiLoaded = (): boolean => {
  return !!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
};

// Load the Vimeo Player API
export const loadVimeoApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isVimeoApiLoaded()) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    script.id = 'vimeo-player-api';
    
    script.onload = () => {
      console.log("Vimeo Player API loaded");
      resolve();
    };
    
    script.onerror = () => {
      console.error("Failed to load Vimeo Player API");
      reject(new Error("Failed to load Vimeo Player API"));
    };
    
    document.head.appendChild(script);
  });
};

// Add preload hints for critical videos
export const preloadVideos = (videoIds: Array<string | {id: string, importance?: 'high' | 'low', fetchpriority?: 'high' | 'low' | 'auto'}>): void => {
  videoIds.forEach((item, index) => {
    const id = typeof item === 'string' ? item : item.id;
    const importance = typeof item === 'string' ? (index === 0 ? 'high' : 'low') : (item.importance || 'low');
    const fetchpriority = typeof item === 'string' ? (index === 0 ? 'high' : 'low') : (item.fetchpriority || (importance === 'high' ? 'high' : 'low'));
    
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
      
      // Set fetchpriority attribute to help the browser prioritize resources
      if (fetchpriority) {
        link.setAttribute('fetchpriority', fetchpriority);
      }
      
      link.href = `https://player.vimeo.com/video/${id}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      console.log(`Preloaded video: ${id} with importance: ${importance}, fetchpriority: ${fetchpriority}`);
    }
  });
};

// Initialize video preloading
export const initVideoPreloading = (): void => {
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      loadVimeoApi()
        .then(() => preloadVideos(CRITICAL_VIDEOS))
        .catch(error => console.error("Error in video preloading:", error));
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      loadVimeoApi()
        .then(() => preloadVideos(CRITICAL_VIDEOS))
        .catch(error => console.error("Error in video preloading:", error));
    }, 100);
  }
};
