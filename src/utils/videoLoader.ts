import { useEffect, useState, useRef, RefObject, useCallback } from 'react';

// Type definitions for Vimeo
type VimeoPlayerOptions = {
  id?: number | string;
  url?: string;
  width?: number | string;
  height?: number | string;
  autopause?: boolean;
  autoplay?: boolean;
  background?: boolean;
  controls?: boolean;
  dnt?: boolean;
  keyboard?: boolean;
  loop?: boolean;
  muted?: boolean;
  pip?: boolean;
  playsinline?: boolean;
  responsive?: boolean;
  speed?: boolean;
  texttrack?: string;
  title?: boolean;
  transparent?: boolean;
  quality?: string;
};

export type VimeoPlayer = {
  destroy: () => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  ready: () => Promise<void>;
  loadVideo: (id: number | string) => Promise<void>;
  getVideoTitle: () => Promise<string>;
};

// Keep track of Vimeo script loading status globally
let isVimeoLoading = false;
let isVimeoLoaded = false;
const loadCallbacks: Array<() => void> = [];

/**
 * Loads the Vimeo Player API script if not already loaded
 * Uses a global singleton pattern to prevent multiple script loads
 */
export const loadVimeoScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isVimeoLoaded && window.Vimeo) {
      resolve();
      return;
    }
    
    // If loading in progress, add to callback queue
    if (isVimeoLoading) {
      loadCallbacks.push(() => resolve());
      return;
    }
    
    // Check if script already exists
    if (document.getElementById('vimeo-player-script')) {
      isVimeoLoaded = true;
      resolve();
      return;
    }
    
    // Start loading
    isVimeoLoading = true;
    
    const script = document.createElement('script');
    script.id = 'vimeo-player-script';
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    
    script.onload = () => {
      isVimeoLoaded = true;
      isVimeoLoading = false;
      
      // Notify all waiting callbacks
      loadCallbacks.forEach(callback => callback());
      loadCallbacks.length = 0; // Clear the array
      
      resolve();
    };
    
    script.onerror = (err) => {
      isVimeoLoading = false;
      loadCallbacks.length = 0; // Clear the array
      reject(err);
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Preloads a Vimeo video by adding a preload link
 */
export const preloadVimeoVideo = (videoId: string, hash?: string, priority: 'high' | 'low' = 'low'): void => {
  // Check if this video is already being preloaded
  if (document.querySelector(`link[href*="${videoId}"]`)) {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = priority === 'high' ? 'preload' : 'prefetch';
  link.as = 'fetch';
  link.href = hash 
    ? `https://player.vimeo.com/video/${videoId}?h=${hash}`
    : `https://player.vimeo.com/video/${videoId}`;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Custom hook for reliable Vimeo video playing with better error handling
 */
export const useVimeoPlayer = (
  containerRef: RefObject<HTMLElement>,
  videoId: string | number,
  options: VimeoPlayerOptions = {},
  hash?: string
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(options.muted ?? true);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 5;

  // Initialize player with exponential backoff retry
  const initializePlayer = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      await loadVimeoScript();
      
      if (!window.Vimeo?.Player) {
        throw new Error('Vimeo Player API failed to load');
      }
      
      // Clean up existing player if it exists
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      
      const defaultOptions: VimeoPlayerOptions = {
        width: '100%',
        height: '100%',
        loop: false,
        autoplay: false,
        muted: isMuted,
        controls: false,
        responsive: true,
        dnt: true,
        background: false,
        transparent: true,
        ...options
      };
      
      // Add ID or URL based on what's provided
      const playerOptions = typeof videoId === 'string' && videoId.includes('http')
        ? { ...defaultOptions, url: videoId }
        : { ...defaultOptions, id: videoId };
      
      // Create new player
      const player = new window.Vimeo.Player(containerRef.current, playerOptions) as VimeoPlayer;
      playerRef.current = player;
      
      // Set up event handlers
      player.on('ready', () => {
        setIsReady(true);
        setIsLoading(false);
        retryCountRef.current = 0; // Reset retry count on success
      });
      
      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      player.on('ended', () => {
        setIsPlaying(false);
        player.pause().catch(err => console.error('Error pausing vimeo after end:', err));
      });
      
      player.on('error', (error) => {
        console.error('Vimeo player error:', error);
        handlePlayerError();
      });
      
    } catch (error) {
      console.error('Error initializing Vimeo player:', error);
      handlePlayerError();
    }
  }, [containerRef, videoId, options, isMuted]);

  // Handle errors with exponential backoff
  const handlePlayerError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    if (retryCountRef.current < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
      retryCountRef.current += 1;
      
      console.log(`Retrying Vimeo player initialization (${retryCountRef.current}/${maxRetries}) in ${delay/1000}s`);
      
      setTimeout(() => {
        setIsLoading(true);
        setHasError(false);
        initializePlayer();
      }, delay);
    }
  }, [initializePlayer]);

  // Player controls
  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.play().catch(err => {
        console.error('Error playing Vimeo:', err);
      });
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.pause().catch(err => {
        console.error('Error pausing Vimeo:', err);
      });
    }
  }, [isReady]);

  const toggleMute = useCallback(() => {
    if (playerRef.current && isReady) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      
      playerRef.current.setMuted(newMutedState).catch(err => {
        console.error('Error setting Vimeo mute state:', err);
      });
    }
  }, [isReady, isMuted]);

  // Initialize on mount
  useEffect(() => {
    // Preload the video
    if (typeof videoId === 'string') {
      preloadVimeoVideo(videoId, hash);
    } else {
      preloadVimeoVideo(videoId.toString());
    }
    
    initializePlayer();
    
    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, hash, initializePlayer]);

  return {
    isLoading,
    isPlaying,
    isMuted,
    hasError,
    isReady,
    play,
    pause,
    toggleMute,
    retry: () => {
      setIsLoading(true);
      setHasError(false);
      retryCountRef.current = 0;
      initializePlayer();
    }
  };
};

/**
 * Custom hook for reliable MP4 video loading with Vimeo fallback
 */
export const useVideoPlayer = (
  videoRef: RefObject<HTMLVideoElement>,
  vimeoContainerRef: RefObject<HTMLDivElement>,
  localVideoUrl: string,
  vimeoId: string | number,
  options: { 
    timeoutMs?: number,
    vimeoHash?: string,
    vimeoOptions?: VimeoPlayerOptions
  } = {}
) => {
  const { timeoutMs = 5000, vimeoHash, vimeoOptions = {} } = options;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useVimeoFallback, setUseVimeoFallback] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get Vimeo player controls when using fallback
  const vimeo = useVimeoPlayer(
    vimeoContainerRef, 
    vimeoId,
    {
      muted: isMuted,
      ...vimeoOptions
    },
    vimeoHash
  );
  
  // Initial video setup
  useEffect(() => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    setHasError(false);
    
    const video = videoRef.current;
    
    const handleCanPlayThrough = () => {
      if (!useVimeoFallback) {
        setIsLoading(false);
        console.log('MP4 video loaded successfully');
        
        // Clear the timeout since video loaded successfully
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };
    
    const handleError = () => {
      console.error('MP4 video failed to load, switching to Vimeo fallback');
      setUseVimeoFallback(true);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
      if (video) {
        video.currentTime = 0;
      }
    };
    
    // Set up event listeners
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    
    // Set a timeout for MP4 loading - if it takes too long, switch to Vimeo
    timeoutRef.current = setTimeout(() => {
      if (video.readyState < 4) {
        console.log('MP4 video taking too long to load, switching to Vimeo fallback');
        setUseVimeoFallback(true);
      }
    }, timeoutMs);
    
    return () => {
      // Clean up event listeners
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [vimeoId, timeoutMs, useVimeoFallback]);
  
  // Effect for fallback Vimeo loading status
  useEffect(() => {
    if (useVimeoFallback) {
      if (vimeo.isLoading) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
        setHasError(vimeo.hasError);
      }
      
      setIsPlaying(vimeo.isPlaying);
    }
  }, [useVimeoFallback, vimeo.isLoading, vimeo.hasError, vimeo.isPlaying]);
  
  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    if (isLoading) return;
    
    if (useVimeoFallback) {
      if (isPlaying) {
        vimeo.pause();
      } else {
        vimeo.play();
      }
    } else if (videoRef.current) {
      const video = videoRef.current;
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        video.play().then(() => {
          setIsPlaying(true);
          // Auto-hide controls after playback starts
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          controlsTimeoutRef.current = setTimeout(() => {
            if (!isHovering) {
              setShowControls(false);
            }
          }, 2000);
        }).catch(err => console.error('Error playing MP4:', err));
      }
    }
  }, [isPlaying, isLoading, useVimeoFallback, isHovering, vimeo]);
  
  // Handle mute/unmute
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (useVimeoFallback) {
      vimeo.toggleMute();
    } else if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  }, [isMuted, useVimeoFallback, vimeo]);
  
  // Handle hover state for controls
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  }, [isPlaying]);
  
  // Retry when both sources fail
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setUseVimeoFallback(false);
    
    // Retry with MP4 first
    if (videoRef.current) {
      const video = videoRef.current;
      video.load();
      
      // Set timeout to switch to Vimeo if MP4 fails again
      timeoutRef.current = setTimeout(() => {
        if (video.readyState < 4) {
          setUseVimeoFallback(true);
        }
      }, timeoutMs);
    }
  }, [timeoutMs]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    isLoading,
    isPlaying,
    isMuted,
    hasError,
    useVimeoFallback,
    showControls,
    togglePlayPause,
    toggleMute,
    handleMouseEnter,
    handleMouseLeave,
    handleRetry
  };
};
