
/**
 * Simplified video load manager for handling video elements.
 * This replaces the previous videoOptimization utility with a minimal implementation.
 */

// Type definition for event handler
type VideoStateChangeHandler = (event: 'loading' | 'loaded' | 'error') => void;

class VideoLoadManager {
  private registeredVideos: Map<string, HTMLElement> = new Map();
  private eventListeners: Map<string, VideoStateChangeHandler[]> = new Map();
  private placeholderImages: Map<string, string> = new Map();

  /**
   * Register a video element with the manager
   */
  registerVideo(
    videoId: string, 
    element: HTMLElement,
    placeholderImage?: string
  ): void {
    this.registeredVideos.set(videoId, element);
    
    if (placeholderImage) {
      this.placeholderImages.set(videoId, placeholderImage);
    }
    
    // Log registration for debugging
    console.log(`Video ${videoId} registered with load manager`);
  }

  /**
   * Remove a video from the manager
   */
  unregisterVideo(videoId: string): void {
    this.registeredVideos.delete(videoId);
    this.eventListeners.delete(videoId);
    this.placeholderImages.delete(videoId);
  }

  /**
   * Add event listener for video state changes
   */
  addEventListener(videoId: string, handler: VideoStateChangeHandler): void {
    if (!this.eventListeners.has(videoId)) {
      this.eventListeners.set(videoId, []);
    }
    
    const listeners = this.eventListeners.get(videoId);
    if (listeners && !listeners.includes(handler)) {
      listeners.push(handler);
    }
  }

  /**
   * Remove event listener
   */
  removeEventListener(videoId: string, handler: VideoStateChangeHandler): void {
    const listeners = this.eventListeners.get(videoId);
    
    if (listeners) {
      const index = listeners.indexOf(handler);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Get the registered element for a video ID
   */
  getVideoElement(videoId: string): HTMLElement | undefined {
    return this.registeredVideos.get(videoId);
  }

  /**
   * Get the placeholder image for a video ID
   */
  getPlaceholderImage(videoId: string): string | undefined {
    return this.placeholderImages.get(videoId);
  }

  /**
   * Trigger an event for a specific video
   */
  triggerEvent(videoId: string, event: 'loading' | 'loaded' | 'error'): void {
    const listeners = this.eventListeners.get(videoId);
    
    if (listeners) {
      listeners.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in video event handler for ${videoId}:`, error);
        }
      });
    }
  }
}

// Create and export a singleton instance
const videoLoadManager = new VideoLoadManager();
export default videoLoadManager;
