
// Preload critical images and resources for faster loading
const criticalImages = [
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843343/52_gllnot.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/54_vqvmdl.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843343/51_oorfmr.png"
];

interface PreloadOptions {
  priority?: 'high' | 'low';
  as?: 'image' | 'video' | 'style' | 'script';
  crossorigin?: 'anonymous' | 'use-credentials';
}

class CriticalResourcePreloader {
  private preloadedResources = new Set<string>();
  private isSlowConnection = false;

  constructor() {
    this.checkConnectionSpeed();
  }

  private checkConnectionSpeed(): void {
    const connection = (navigator as any).connection;
    if (connection) {
      this.isSlowConnection = 
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData;
    }
  }

  public preloadImage(src: string, options: PreloadOptions = {}): void {
    if (this.preloadedResources.has(src) || this.isSlowConnection) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = options.as || 'image';
    link.href = src;
    
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }
    
    if (options.priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }
    
    document.head.appendChild(link);
    this.preloadedResources.add(src);
  }

  public preloadCriticalImages(): void {
    if (this.isSlowConnection) return;
    
    criticalImages.forEach((src, index) => {
      this.preloadImage(src, { 
        priority: index < 2 ? 'high' : 'low',
        as: 'image'
      });
    });
  }

  public preloadResource(href: string, options: PreloadOptions): void {
    if (this.preloadedResources.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = options.as || 'script';
    
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }
    
    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }
}

export const criticalResourcePreloader = new CriticalResourcePreloader();

// Initialize critical resource preloading
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      criticalResourcePreloader.preloadCriticalImages();
    });
  } else {
    criticalResourcePreloader.preloadCriticalImages();
  }
}
