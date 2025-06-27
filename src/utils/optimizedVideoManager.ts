
import { debounce } from '@/utils/eventOptimizers';

interface VideoState {
  id: string;
  loading: boolean;
  loaded: boolean;
  error: boolean;
  retryCount: number;
  visible: boolean;
  element?: HTMLElement;
}

class OptimizedVideoManager {
  private static instance: OptimizedVideoManager;
  private videoStates: Map<string, VideoState> = new Map();
  private observer: IntersectionObserver;
  private debouncedResize: () => void;

  private constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.1, rootMargin: '200px' }
    );
    
    this.debouncedResize = debounce(this.handleResize.bind(this), 300);
    window.addEventListener('resize', this.debouncedResize);
  }

  public static getInstance(): OptimizedVideoManager {
    if (!OptimizedVideoManager.instance) {
      OptimizedVideoManager.instance = new OptimizedVideoManager();
    }
    return OptimizedVideoManager.instance;
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('data-video-id');
      if (!id) return;
      
      const state = this.videoStates.get(id);
      if (state) {
        state.visible = entry.isIntersecting;
        this.videoStates.set(id, state);
      }
    });
  }

  private handleResize(): void {
    // Handle resize logic for video elements
    this.videoStates.forEach((state, id) => {
      if (state.element && state.visible) {
        // Recalculate video positioning if needed
        const rect = state.element.getBoundingClientRect();
        if (rect.height === 0 || rect.width === 0) {
          state.visible = false;
          this.videoStates.set(id, state);
        }
      }
    });
  }

  public registerVideo(id: string, element: HTMLElement): void {
    if (this.videoStates.has(id)) return;
    
    element.setAttribute('data-video-id', id);
    
    const state: VideoState = {
      id,
      loading: false,
      loaded: false,
      error: false,
      retryCount: 0,
      visible: false,
      element
    };
    
    this.videoStates.set(id, state);
    this.observer.observe(element);
  }

  public unregisterVideo(id: string): void {
    const state = this.videoStates.get(id);
    if (state?.element) {
      this.observer.unobserve(state.element);
    }
    this.videoStates.delete(id);
  }

  public isVideoVisible(id: string): boolean {
    return this.videoStates.get(id)?.visible || false;
  }

  public destroy(): void {
    this.observer.disconnect();
    window.removeEventListener('resize', this.debouncedResize);
    this.videoStates.clear();
  }
}

export default OptimizedVideoManager.getInstance();
