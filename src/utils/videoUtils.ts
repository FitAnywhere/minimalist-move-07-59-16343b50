
/**
 * Utility functions for video optimization
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

// Load video metadata but not content
export const preloadVideoMetadata = (videoUrl: string): void => {
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.src = videoUrl;
  
  // Remove after metadata is loaded
  video.onloadedmetadata = () => {
    video.remove();
  };
  
  // Remove after 3 seconds regardless (safety cleanup)
  setTimeout(() => {
    if (document.body.contains(video)) {
      video.remove();
    }
  }, 3000);
};

// Initialize video optimization on page load
export const initVideoOptimization = (): void => {
  if (typeof window === 'undefined') return;
  
  // Wait for page to load and become idle
  if (document.readyState === 'complete') {
    prefetchCriticalVideos();
  } else {
    window.addEventListener('load', () => {
      prefetchCriticalVideos();
    });
  }
};
