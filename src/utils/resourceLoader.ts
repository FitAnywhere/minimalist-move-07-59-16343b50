
/**
 * Utilities for optimized resource loading
 */

// Add interface for Network Information API
interface NetworkInformation {
  effectiveType: string;
  saveData: boolean;
  [key: string]: any;
}

// Extend Navigator interface to include connection property
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

/**
 * Preload an image with proper error handling
 */
export const preloadImage = (src: string, priority: 'high' | 'low' = 'low'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (priority === 'high') {
      img.fetchPriority = 'high';
    }
    
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

/**
 * Preload multiple images with a concurrency limit
 */
export const preloadImages = async (
  urls: string[],
  options: { concurrency?: number; priority?: 'high' | 'low' } = {}
): Promise<void> => {
  const { concurrency = 3, priority = 'low' } = options;
  
  // Process urls in chunks to limit concurrency
  for (let i = 0; i < urls.length; i += concurrency) {
    const chunk = urls.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(url => 
        preloadImage(url, i < concurrency ? 'high' : 'low')
          .catch(err => console.warn(`Failed to preload image: ${url}`, err))
      )
    );
  }
};

/**
 * Add resource hints to improve performance
 */
export const addResourceHints = (
  resources: Array<{ url: string; type: 'preconnect' | 'dns-prefetch' | 'preload'; as?: string; priority?: 'high' | 'low' }>
): void => {
  resources.forEach(({ url, type, as, priority }) => {
    // Check if hint already exists
    const selector = `link[href="${url}"][rel="${type}"]`;
    if (document.querySelector(selector)) return;
    
    const link = document.createElement('link');
    link.rel = type;
    link.href = url;
    
    if (type === 'preload' && as) {
      link.as = as;
      
      if (priority === 'high') {
        link.setAttribute('fetchpriority', 'high');
      }
    }
    
    document.head.appendChild(link);
  });
};

/**
 * Optimize font loading
 */
export const optimizeFontLoading = (fontUrls: string[]): void => {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Add font-display: swap to all font faces
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap !important;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Detect network connection quality
 */
export const getConnectionQuality = (): 'slow' | 'medium' | 'fast' => {
  // Safely check for Network Information API with proper type casting
  const navigatorWithConnection = navigator as NavigatorWithConnection;
  
  if (navigatorWithConnection.connection) {
    const conn = navigatorWithConnection.connection;
    
    if (conn.saveData) {
      return 'slow';
    }
    
    if (conn.effectiveType === '4g' && !conn.saveData) {
      return 'fast';
    }
    
    if (conn.effectiveType === '3g') {
      return 'medium';
    }
    
    return 'slow';
  }
  
  // Fallback if Network Information API is not available
  return 'medium';
};
