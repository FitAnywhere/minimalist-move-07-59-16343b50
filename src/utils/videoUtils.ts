
/**
 * Consolidated video utility functions
 */

// Check if the connection is slow
export const isSlowConnection = (): boolean => {
  const connection = (navigator as any).connection;
  
  if (!connection) return false;
  
  // Check for slow connection types
  if (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    (connection.effectiveType === '3g' && connection.downlink < 1.5) ||
    connection.saveData
  ) {
    return true;
  }
  
  return false;
};

// Critical video files that should be preloaded
const criticalVideos = [
  '/114 Intor Video Optt.mp4',
  '/114 Librarytraining 1144.mp4',
  '/114 Setup (1080P).mp4',
  '/114Bboxfun 104.mp4'
];

// Prefetch video files only if connection is fast enough
export const prefetchCriticalVideos = (): void => {
  // Don't prefetch on slow connections
  if (isSlowConnection()) return;
  
  // Check if running in browser
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback to prefetch when the browser is idle
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        prefetchVideos();
      },
      { timeout: 5000 }
    );
  } else {
    // Fallback to setTimeout with just the delay value
    setTimeout(prefetchVideos, 5000);
  }
};

// Helper function to actually perform the prefetching
const prefetchVideos = (): void => {
  criticalVideos.forEach(videoUrl => {
    // Create link element for prefetching
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'video';
    link.href = videoUrl;
    link.type = 'video/mp4';
    
    // Add custom attribute to identify this as a video prefetch
    link.setAttribute('data-video-prefetch', 'true');
    
    // Append to document head
    document.head.appendChild(link);
    
    console.log(`Prefetched video: ${videoUrl}`);
  });
};

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

// Initialize all video optimizations
export const initVideoOptimization = (): void => {
  if (typeof window === 'undefined') return;
  
  // Wait for page to load and become idle
  if (document.readyState === 'complete') {
    prefetchCriticalVideos();
    initVideoPreloading();
  } else {
    window.addEventListener('load', () => {
      prefetchCriticalVideos();
      initVideoPreloading();
    });
  }
};

// Simple utility hook interface (for typescript compatibility with existing code)
export interface UseVideoOptimizationOptions {
  threshold?: number;
  rootMargin?: string;
  lazyLoad?: boolean;
  priorityLoad?: boolean;
  enableMobileOptimization?: boolean;
}
