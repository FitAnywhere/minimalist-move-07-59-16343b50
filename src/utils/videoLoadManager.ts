
/**
 * Simple Video Load Manager
 * 
 * A lightweight utility to manage lazy loading of videos
 */

interface VideoRegistration {
  id: string;
  element: HTMLElement;
  loaded: boolean;
  loading: boolean;
  error: boolean;
  visible: boolean;
}

class VideoLoadManager {
  private static instance: VideoLoadManager;
  private videoRegistry: Map<string, VideoRegistration> = new Map();
  private observer: IntersectionObserver;
  
  private constructor() {
    // Initialize intersection observer for all registered videos
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '200px',
        threshold: 0.1
      }
    );
    
    // Log creation of manager
    console.log('[VideoLoadManager] Initialized');
  }
  
  public static getInstance(): VideoLoadManager {
    if (!VideoLoadManager.instance) {
      VideoLoadManager.instance = new VideoLoadManager();
    }
    return VideoLoadManager.instance;
  }
  
  /**
   * Register a video element for intersection observation
   */
  public registerVideo(id: string, element: HTMLElement): void {
    if (this.videoRegistry.has(id)) {
      return;
    }
    
    this.videoRegistry.set(id, {
      id,
      element,
      loaded: false,
      loading: false,
      error: false,
      visible: false
    });
    
    // Start observing this element
    this.observer.observe(element);
    console.log(`[VideoLoadManager] Registered video: ${id}`);
  }
  
  /**
   * Handle intersection events
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      const element = entry.target as HTMLElement;
      const id = element.getAttribute('data-vimeo-id');
      
      if (!id || !this.videoRegistry.has(id)) {
        return;
      }
      
      const registration = this.videoRegistry.get(id)!;
      const wasVisible = registration.visible;
      
      registration.visible = entry.isIntersecting;
      this.videoRegistry.set(id, registration);
      
      // If element just became visible and hasn't loaded yet
      if (!wasVisible && entry.isIntersecting && !registration.loaded && !registration.loading) {
        this.notifyVisibilityChange(id, true);
      } else if (wasVisible && !entry.isIntersecting) {
        this.notifyVisibilityChange(id, false);
      }
    });
  }
  
  /**
   * Add event listener for video state changes
   */
  public addEventListener(id: string, callback: (event: 'loading' | 'loaded' | 'error' | 'visible' | 'hidden') => void): void {
    // Add event listener implementation
    // This would be implemented if needed
  }
  
  /**
   * Mark a video as loaded
   */
  public markVideoLoaded(id: string): void {
    if (!this.videoRegistry.has(id)) {
      return;
    }
    
    const registration = this.videoRegistry.get(id)!;
    registration.loaded = true;
    registration.loading = false;
    this.videoRegistry.set(id, registration);
  }
  
  /**
   * Mark a video as loading
   */
  public markVideoLoading(id: string): void {
    if (!this.videoRegistry.has(id)) {
      return;
    }
    
    const registration = this.videoRegistry.get(id)!;
    registration.loading = true;
    this.videoRegistry.set(id, registration);
  }
  
  /**
   * Mark a video as having an error
   */
  public markVideoError(id: string): void {
    if (!this.videoRegistry.has(id)) {
      return;
    }
    
    const registration = this.videoRegistry.get(id)!;
    registration.error = true;
    registration.loading = false;
    this.videoRegistry.set(id, registration);
  }
  
  /**
   * Check if a video is visible
   */
  public isVideoVisible(id: string): boolean {
    if (!this.videoRegistry.has(id)) {
      return false;
    }
    
    return this.videoRegistry.get(id)!.visible;
  }
  
  /**
   * Notify about visibility changes
   */
  private notifyVisibilityChange(id: string, visible: boolean): void {
    console.log(`[VideoLoadManager] Video ${id} is now ${visible ? 'visible' : 'hidden'}`);
    // This would call registered event listeners if we implemented that system
  }
  
  /**
   * Clean up on destroy
   */
  public destroy(): void {
    this.observer.disconnect();
    this.videoRegistry.clear();
  }
}

// Create and export singleton instance
const videoLoadManager = VideoLoadManager.getInstance();
export default videoLoadManager;
