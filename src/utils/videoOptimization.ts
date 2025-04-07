// Interface for network information
interface NetworkInformation {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// Extended navigator interface that includes connection property
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

// Video loading state tracking
interface VideoLoadState {
  id: string;
  loading: boolean;
  loaded: boolean;
  error: boolean;
  retryCount: number;
  lastRetryTime: number;
  visible: boolean;
  nearViewport: boolean;
  thumbnailUrl?: string;
  element?: HTMLElement;
}

// Video preload queue management
class VideoLoadManager {
  private static instance: VideoLoadManager;
  private videoStates: Map<string, VideoLoadState> = new Map();
  private loadQueue: string[] = [];
  private isProcessingQueue = false;
  private maxConcurrentLoads = 2;
  private currentLoads = 0;
  private viewportObserver: IntersectionObserver;
  private preloadObserver: IntersectionObserver;
  private vimeoApiLoaded = false;
  private vimeoApiLoading = false;
  private networkIsLow = false;
  private autoRetryInterval: number | null = null;
  private retryDelays = [1000, 2000, 3000, 5000, 8000, 13000, 21000]; // Fibonacci sequence for exponential backoff

  private constructor() {
    // Initialize observers
    this.viewportObserver = new IntersectionObserver(
      this.handleViewportIntersection.bind(this),
      { threshold: 0.1 }
    );
    
    this.preloadObserver = new IntersectionObserver(
      this.handlePreloadIntersection.bind(this),
      { rootMargin: '1000px 0px' }
    );
    
    // Check network conditions
    this.checkNetworkConditions();
    
    // Set up auto-retry mechanism
    this.setupAutoRetry();
    
    // Load Vimeo API
    this.loadVimeoApi();
    
    // Set up resize and visibility change listeners
    window.addEventListener('resize', this.checkVisibleVideos.bind(this));
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  public static getInstance(): VideoLoadManager {
    if (!VideoLoadManager.instance) {
      VideoLoadManager.instance = new VideoLoadManager();
    }
    return VideoLoadManager.instance;
  }

  // Load Vimeo API with retry logic
  private loadVimeoApi(): Promise<void> {
    if (this.vimeoApiLoaded) {
      return Promise.resolve();
    }
    
    if (this.vimeoApiLoading) {
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.vimeoApiLoaded) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          if (!this.vimeoApiLoaded) {
            console.error('Vimeo API load timeout, retrying...');
            this.vimeoApiLoading = false;
            this.loadVimeoApi();
          }
          resolve();
        }, 10000);
      });
    }
    
    this.vimeoApiLoading = true;
    
    return new Promise((resolve) => {
      // Check if script already exists
      if (document.getElementById('vimeo-player-api')) {
        this.vimeoApiLoaded = true;
        this.vimeoApiLoading = false;
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'vimeo-player-api';
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Vimeo API loaded successfully');
        this.vimeoApiLoaded = true;
        this.vimeoApiLoading = false;
        resolve();
        
        // Process any pending videos
        this.processLoadQueue();
      };
      
      script.onerror = () => {
        console.error('Failed to load Vimeo API, retrying...');
        this.vimeoApiLoading = false;
        
        // Remove failed script
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        
        // Retry with exponential backoff
        setTimeout(() => {
          this.loadVimeoApi();
          resolve();
        }, 2000);
      };
      
      document.head.appendChild(script);
    });
  }

  // Check network conditions
  private checkNetworkConditions(): void {
    const nav = navigator as NavigatorWithConnection;
    
    if (nav.connection) {
      // Check current network conditions
      this.updateNetworkStatus(nav.connection);
      
      // Listen for changes in network conditions
      nav.connection.addEventListener('change', () => {
        if (nav.connection) {
          this.updateNetworkStatus(nav.connection);
        }
      });
    } else {
      // Fallback for browsers without NetworkInformation API
      // Use a conservative approach
      this.networkIsLow = false;
      this.maxConcurrentLoads = 2;
    }
  }

  private updateNetworkStatus(connection: NetworkInformation): void {
    const { effectiveType, downlink, rtt, saveData } = connection;
    
    // Adjust loading strategy based on network conditions
    if (
      effectiveType === 'slow-2g' ||
      effectiveType === '2g' ||
      (effectiveType === '3g' && downlink < 1.5) ||
      saveData ||
      rtt > 500
    ) {
      console.log('Detected slow network, optimizing for low bandwidth');
      this.networkIsLow = true;
      this.maxConcurrentLoads = 1;
    } else {
      this.networkIsLow = false;
      this.maxConcurrentLoads = effectiveType === '3g' ? 2 : 3;
    }
    
    console.log(`Network conditions: ${effectiveType}, concurrent loads: ${this.maxConcurrentLoads}`);
  }

  // Set up automatic retry for failed videos
  private setupAutoRetry(): void {
    // Clear any existing interval
    if (this.autoRetryInterval !== null) {
      window.clearInterval(this.autoRetryInterval);
    }
    
    // Set up new interval (every 30 seconds)
    this.autoRetryInterval = window.setInterval(() => {
      this.retryFailedVideos();
    }, 30000);
  }

  private retryFailedVideos(): void {
    console.log('Running automatic retry for failed videos');
    let retriedAny = false;
    
    this.videoStates.forEach((state, id) => {
      // Only retry videos that:
      // 1. Have errored
      // 2. Are visible or near viewport
      // 3. Haven't exceeded max retries
      // 4. Last retry was more than 30 seconds ago
      if (
        state.error &&
        (state.visible || state.nearViewport) &&
        state.retryCount < this.retryDelays.length &&
        Date.now() - state.lastRetryTime > 30000
      ) {
        console.log(`Auto-retrying video ${id}`);
        this.retryVideo(id);
        retriedAny = true;
      }
    });
    
    if (!retriedAny) {
      console.log('No videos eligible for auto-retry');
    }
  }

  // Handle visibility change (tab focus/unfocus)
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      // When tab becomes visible again, check for videos to load
      this.checkVisibleVideos();
    } else {
      // When tab is hidden, we could pause non-essential video loading
      // But we'll let currently loading videos finish
    }
  }

  // Observer callback for viewport intersection
  private handleViewportIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('data-vimeo-id');
      if (!id) return;
      
      const state = this.videoStates.get(id);
      if (!state) return;
      
      const wasVisible = state.visible;
      state.visible = entry.isIntersecting;
      this.videoStates.set(id, state);
      
      if (!wasVisible && state.visible) {
        // Video just became visible, prioritize loading
        this.prioritizeVideo(id);
      }
    });
    
    this.processLoadQueue();
  }

  // Observer callback for preload intersection (videos approaching viewport)
  private handlePreloadIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('data-vimeo-id');
      if (!id) return;
      
      const state = this.videoStates.get(id);
      if (!state) return;
      
      state.nearViewport = entry.isIntersecting;
      this.videoStates.set(id, state);
      
      if (state.nearViewport && !state.loading && !state.loaded) {
        // Add to load queue if approaching viewport
        this.addToLoadQueue(id);
      }
    });
    
    this.processLoadQueue();
  }

  // Prioritize a video in the loading queue
  private prioritizeVideo(id: string): void {
    const queueIndex = this.loadQueue.indexOf(id);
    
    // If not in queue, add it
    if (queueIndex === -1) {
      this.addToLoadQueue(id);
      return;
    }
    
    // If already at front of queue, do nothing
    if (queueIndex === 0) return;
    
    // Otherwise, move to front of queue
    this.loadQueue.splice(queueIndex, 1);
    this.loadQueue.unshift(id);
    
    // If we're not currently processing the queue, start
    if (!this.isProcessingQueue) {
      this.processLoadQueue();
    }
  }

  // Add a video to the load queue
  private addToLoadQueue(id: string): void {
    if (!this.loadQueue.includes(id)) {
      const state = this.videoStates.get(id);
      
      // Don't add videos that are already loaded
      if (state && !state.loaded && !state.loading) {
        // Add visible videos to the front of the queue
        if (state.visible) {
          this.loadQueue.unshift(id);
        } else {
          this.loadQueue.push(id);
        }
      }
    }
    
    // If we're not currently processing the queue, start
    if (!this.isProcessingQueue) {
      this.processLoadQueue();
    }
  }

  // Process the video load queue
  private processLoadQueue(): void {
    if (this.isProcessingQueue || this.loadQueue.length === 0 || this.currentLoads >= this.maxConcurrentLoads) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    // Ensure Vimeo API is loaded before processing
    this.loadVimeoApi().then(() => {
      this.loadNextInQueue();
    });
  }

  private loadNextInQueue(): void {
    // If the queue is empty or we've reached max concurrent loads, stop
    if (this.loadQueue.length === 0 || this.currentLoads >= this.maxConcurrentLoads) {
      this.isProcessingQueue = false;
      return;
    }
    
    const id = this.loadQueue.shift()!;
    const state = this.videoStates.get(id);
    
    if (!state || state.loading || state.loaded) {
      // Skip if already loading/loaded or state not found
      this.loadNextInQueue();
      return;
    }
    
    // Update state to loading
    state.loading = true;
    this.videoStates.set(id, state);
    this.currentLoads++;
    
    console.log(`Loading video ${id}, current loads: ${this.currentLoads}/${this.maxConcurrentLoads}`);
    
    // Notify subscribers that video is loading
    this.notifyVideoStateChange(id, 'loading');
    
    // Start loading the video (implementation depends on how videos are loaded)
    // For example, this might involve creating an iframe, triggering a load event, etc.
    // For now, we'll just simulate successful loading after a delay
    setTimeout(() => {
      // Update state to loaded
      const updatedState = this.videoStates.get(id);
      if (updatedState) {
        updatedState.loading = false;
        updatedState.loaded = true;
        this.videoStates.set(id, updatedState);
      }
      
      // Notify subscribers that video is loaded
      this.notifyVideoStateChange(id, 'loaded');
      
      // Decrement current loads and continue processing queue
      this.currentLoads--;
      this.loadNextInQueue();
    }, 500);
  }

  // Retry loading a specific video
  public retryVideo(id: string): void {
    const state = this.videoStates.get(id);
    if (!state) return;
    
    if (state.retryCount >= this.retryDelays.length) {
      console.log(`Video ${id} has exceeded maximum retry attempts`);
      return;
    }
    
    // Update retry count and timestamp
    state.error = false;
    state.loading = false;
    state.loaded = false;
    state.retryCount++;
    state.lastRetryTime = Date.now();
    this.videoStates.set(id, state);
    
    console.log(`Retrying video ${id}, attempt ${state.retryCount}`);
    
    // Calculate delay based on retry count (exponential backoff)
    const delay = this.retryDelays[state.retryCount - 1];
    
    // Add to queue after delay
    setTimeout(() => {
      this.addToLoadQueue(id);
    }, delay);
  }

  // Register a video element for tracking and loading
  public registerVideo(
    id: string, 
    element: HTMLElement, 
    thumbnailUrl?: string
  ): void {
    // Check if already registered
    if (this.videoStates.has(id)) {
      return;
    }
    
    // Add data attribute for observers
    element.setAttribute('data-vimeo-id', id);
    
    // Create initial state
    const state: VideoLoadState = {
      id,
      loading: false,
      loaded: false,
      error: false,
      retryCount: 0,
      lastRetryTime: 0,
      visible: false,
      nearViewport: false,
      thumbnailUrl,
      element
    };
    
    this.videoStates.set(id, state);
    
    // Start observing the element
    this.viewportObserver.observe(element);
    this.preloadObserver.observe(element);
    
    // Check if element is already visible
    if (this.isElementInViewport(element)) {
      state.visible = true;
      this.prioritizeVideo(id);
    } else if (this.isElementNearViewport(element)) {
      state.nearViewport = true;
      this.addToLoadQueue(id);
    }
  }
  
  // Helpers to check element visibility
  private isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -rect.height &&
      rect.left >= -rect.width &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
    );
  }
  
  private isElementNearViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const verticalMargin = 1000; // 1000px margin
    const horizontalMargin = 500; // 500px margin
    
    return (
      rect.top >= -(rect.height + verticalMargin) &&
      rect.left >= -(rect.width + horizontalMargin) &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height + verticalMargin &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width + horizontalMargin
    );
  }

  // Check all registered videos for visibility
  private checkVisibleVideos(): void {
    this.videoStates.forEach((state, id) => {
      if (state.element) {
        const wasVisible = state.visible;
        const wasNearViewport = state.nearViewport;
        
        state.visible = this.isElementInViewport(state.element);
        state.nearViewport = this.isElementNearViewport(state.element);
        
        if (!wasVisible && state.visible) {
          // Element just became visible
          this.prioritizeVideo(id);
        } else if (!wasNearViewport && state.nearViewport) {
          // Element is approaching viewport
          this.addToLoadQueue(id);
        }
      }
    });
  }

  // Event notification system
  private listeners: { [id: string]: ((event: 'loading' | 'loaded' | 'error') => void)[] } = {};
  
  public addEventListener(id: string, callback: (event: 'loading' | 'loaded' | 'error') => void): void {
    if (!this.listeners[id]) {
      this.listeners[id] = [];
    }
    this.listeners[id].push(callback);
  }
  
  public removeEventListener(id: string, callback: (event: 'loading' | 'loaded' | 'error') => void): void {
    if (!this.listeners[id]) return;
    const index = this.listeners[id].indexOf(callback);
    if (index !== -1) {
      this.listeners[id].splice(index, 1);
    }
  }
  
  private notifyVideoStateChange(id: string, event: 'loading' | 'loaded' | 'error'): void {
    if (!this.listeners[id]) return;
    this.listeners[id].forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in video state change listener for ${id}:`, error);
      }
    });
  }

  // Clean up resources
  public destroy(): void {
    // Clear observers
    this.viewportObserver.disconnect();
    this.preloadObserver.disconnect();
    
    // Clear event listeners
    window.removeEventListener('resize', this.checkVisibleVideos.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Clear auto-retry interval
    if (this.autoRetryInterval !== null) {
      window.clearInterval(this.autoRetryInterval);
    }
    
    // Clear all state
    this.videoStates.clear();
    this.loadQueue = [];
    this.isProcessingQueue = false;
    this.currentLoads = 0;
  }
}

// Create and export singleton instance
const videoLoadManager = VideoLoadManager.getInstance();
export default videoLoadManager;
