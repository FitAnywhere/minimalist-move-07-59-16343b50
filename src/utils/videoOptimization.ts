
/**
 * Video load management system
 * Lightweight manager for coordinating video loading
 */

interface VideoRegistration {
  id: string;
  element: HTMLElement;
  placeholderImage?: string;
  callbacks: Array<(event: 'loading' | 'loaded' | 'error') => void>;
}

class VideoLoadManager {
  private registeredVideos: Map<string, VideoRegistration> = new Map();
  
  // Register a video for management
  registerVideo(
    id: string, 
    element: HTMLElement,
    placeholderImage?: string
  ): void {
    if (this.registeredVideos.has(id)) {
      // Update existing registration
      const existing = this.registeredVideos.get(id)!;
      existing.element = element;
      if (placeholderImage) {
        existing.placeholderImage = placeholderImage;
      }
    } else {
      // Create new registration
      this.registeredVideos.set(id, {
        id,
        element,
        placeholderImage,
        callbacks: []
      });
    }
  }
  
  // Add event listener for a specific video
  addEventListener(
    id: string,
    callback: (event: 'loading' | 'loaded' | 'error') => void
  ): void {
    if (this.registeredVideos.has(id)) {
      const registration = this.registeredVideos.get(id)!;
      registration.callbacks.push(callback);
    } else {
      console.warn(`No video registered with ID: ${id}`);
    }
  }
  
  // Remove event listener for a specific video
  removeEventListener(
    id: string,
    callback: (event: 'loading' | 'loaded' | 'error') => void
  ): void {
    if (this.registeredVideos.has(id)) {
      const registration = this.registeredVideos.get(id)!;
      registration.callbacks = registration.callbacks.filter(cb => cb !== callback);
    }
  }
  
  // Notify all registered callbacks for a specific video
  notifyListeners(id: string, event: 'loading' | 'loaded' | 'error'): void {
    if (this.registeredVideos.has(id)) {
      const registration = this.registeredVideos.get(id)!;
      registration.callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in video event callback for ${id}:`, error);
        }
      });
    }
  }
  
  // Get all registered videos
  getAllRegisteredVideos(): VideoRegistration[] {
    return Array.from(this.registeredVideos.values());
  }
  
  // Get a specific video registration
  getVideoRegistration(id: string): VideoRegistration | undefined {
    return this.registeredVideos.get(id);
  }
  
  // Remove a video registration
  unregisterVideo(id: string): void {
    this.registeredVideos.delete(id);
  }
}

// Create a singleton instance
const videoLoadManager = new VideoLoadManager();
export default videoLoadManager;
