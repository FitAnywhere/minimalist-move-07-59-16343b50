/**
 * Centralized utility for video preloading
 */

import { isSlowConnection } from './videoUtils';

interface PreloadOptions {
  importance?: 'high' | 'low';
  type?: 'preload' | 'prefetch';
}

// Only the critical hero video is high priority
export const CRITICAL_VIDEOS = [
  { id: 'hero', src: '/114 Intor Video Optt.mp4', importance: 'high' as const },
  // Other videos are now low priority to save bandwidth
  { id: 'training', src: '/114 Librarytraining 1144.mp4', importance: 'low' as const },
  { id: 'setup', src: '/114 Setup (1080P).mp4', importance: 'low' as const },
  { id: 'boxfun', src: '/114Bboxfun 104.mp4', importance: 'low' as const }
];

// Load the Vimeo Player API - only if needed and connection is good
export const loadVimeoApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip on slow connections
    if (isSlowConnection()) {
      console.log("Skipping Vimeo API load on slow connection");
      resolve();
      return;
    }
    
    // Skip if already loaded
    if (document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      console.log("Vimeo Player API already loaded");
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

// Add preload hints for critical videos - but be conservative
export const preloadVideos = (videos = CRITICAL_VIDEOS): void => {
  // Skip preloading on slow connections
  if (isSlowConnection()) {
    console.log("Skipping video preloading on slow connection");
    return;
  }

  // On mobile, only preload the hero video metadata
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    // Only preload metadata for the hero video on mobile
    const heroVideo = videos.find(v => v.importance === 'high');
    if (heroVideo) {
      preloadVideoMetadata(heroVideo.src);
    }
    return;
  }

  // On desktop with good connection, proceed with normal preloading
  videos.forEach((video) => {
    const { src, importance } = video;
    
    // Check if already preloaded
    const existingLink = document.querySelector(`link[href="${src}"]`);
    if (existingLink) return;
    
    // For high importance, preload, for low importance, prefetch
    const link = document.createElement('link');
    
    if (importance === 'high') {
      link.rel = 'preload';
      link.as = 'video';
      link.type = 'video/mp4';
    } else {
      link.rel = 'prefetch';
      link.as = 'video';
      link.type = 'video/mp4';
    }
    
    link.href = src;
    link.dataset.importance = importance;
    document.head.appendChild(link);
    
    console.log(`Preloaded video: ${src} with importance: ${importance}`);
  });
};

// Preload just video metadata to make initial playback faster
export const preloadVideoMetadata = (src: string): void => {
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.src = src;
  video.style.display = 'none';
  video.muted = true;
  
  // Remove after metadata is loaded
  video.onloadedmetadata = () => {
    console.log(`Preloaded metadata for ${src}`);
    video.remove();
  };
  
  // Remove after 3 seconds regardless (safety cleanup)
  setTimeout(() => {
    if (document.body.contains(video)) {
      video.remove();
    }
  }, 3000);
  
  document.body.appendChild(video);
};

// Initialize video preloading - more conservative approach
export const initVideoPreloading = (): void => {
  // Do nothing on slow connections
  if (isSlowConnection()) return;
  
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      // For mobile, only load metadata of hero video
      if (window.innerWidth < 768) {
        const heroVideo = CRITICAL_VIDEOS.find(v => v.importance === 'high');
        if (heroVideo) {
          preloadVideoMetadata(heroVideo.src);
        }
      } else {
        // For desktop, load Vimeo API and preload videos
        loadVimeoApi()
          .then(() => preloadVideos())
          .catch(error => console.error("Error in video preloading:", error));
      }
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      if (window.innerWidth < 768) {
        const heroVideo = CRITICAL_VIDEOS.find(v => v.importance === 'high');
        if (heroVideo) {
          preloadVideoMetadata(heroVideo.src);
        }
      } else {
        loadVimeoApi()
          .then(() => preloadVideos())
          .catch(error => console.error("Error in video preloading:", error));
      }
    }, 100);
  }
};
