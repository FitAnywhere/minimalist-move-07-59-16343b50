
import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Loader, RefreshCw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import videoLoadManager from '@/utils/videoOptimization';

interface EnhancedVimeoPlayerProps {
  vimeoId: string;
  hash?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  background?: boolean;
  responsive?: boolean;
  className?: string;
  aspectRatio?: string; // e.g. "16:9", "1:1", "4:3"
  onLoad?: () => void;
  onError?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  placeholderImage?: string;
}

type VideoLoadState = 'idle' | 'loading' | 'loaded' | 'error';

const MAX_RETRIES = Infinity; // Set to Infinity for unlimited retries
const RETRY_DELAY_BASE = 2000; // Base delay in ms
const RETRY_DELAY_MAX = 30000; // Maximum delay in ms

const EnhancedVimeoPlayer = memo(({
  vimeoId,
  hash,
  title,
  autoplay = false,
  loop = false,
  muted = true,
  controls = false,
  background = true,
  responsive = true,
  className = '',
  aspectRatio = '16:9',
  onLoad,
  onError,
  onPlay,
  onPause,
  onEnd,
  placeholderImage
}: EnhancedVimeoPlayerProps) => {
  const [loadState, setLoadState] = useState<VideoLoadState>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const vimeoPlayerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mountedRef = useRef<boolean>(true);
  
  // Handle aspect ratio calculation
  const getAspectRatioPadding = () => {
    if (!aspectRatio) return '56.25%'; // Default to 16:9
    
    const [width, height] = aspectRatio.split(':').map(Number);
    if (!width || !height) return '56.25%';
    
    return `${(height / width) * 100}%`;
  };

  // Calculate exponential backoff with jitter for retries
  const getRetryDelay = useCallback((retryAttempt: number) => {
    const exponentialDelay = Math.min(
      RETRY_DELAY_MAX,
      RETRY_DELAY_BASE * Math.pow(1.5, retryAttempt)
    );
    // Add jitter: random value between 75% and 100% of the calculated delay
    return exponentialDelay * (0.75 + Math.random() * 0.25);
  }, []);

  // Set mounted ref to false when component unmounts
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Safely remove iframe from container
  const safeRemoveIframe = useCallback(() => {
    if (iframeRef.current) {
      try {
        // Only attempt to remove if it's still in the DOM and has a parent
        if (iframeRef.current.parentNode) {
          iframeRef.current.parentNode.removeChild(iframeRef.current);
        }
      } catch (error) {
        console.error('Error removing iframe:', error);
      }
      // Clear the ref regardless of removal success
      iframeRef.current = null;
    }
  }, []);

  // Initialize Vimeo player
  const initializePlayer = useCallback(() => {
    if (!containerRef.current || loadState === 'loading' || loadState === 'loaded' || !mountedRef.current) return;
    
    setLoadState('loading');
    
    try {
      // First, ensure any existing iframe is properly removed
      safeRemoveIframe();
      
      // Build URL with parameters
      let url = `https://player.vimeo.com/video/${vimeoId}`;
      const params = new URLSearchParams();
      
      if (hash) params.append('h', hash);
      if (autoplay) params.append('autoplay', '1');
      if (background) params.append('background', '1');
      if (loop) params.append('loop', '1');
      if (muted) params.append('muted', '1');
      if (controls || showControls) params.append('controls', '1');
      
      // Add standard parameters
      params.append('title', '0');
      params.append('byline', '0');
      params.append('portrait', '0');
      params.append('dnt', '1');
      params.append('quality', 'auto'); // Let Vimeo optimize quality
      
      url = `${url}?${params.toString()}`;
      
      // Double-check that the container still exists and component is mounted
      if (!containerRef.current || !mountedRef.current) {
        return;
      }
      
      // Create iframe if it doesn't exist
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      iframe.allowFullscreen = true;
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.title = title || `Vimeo video player: ${vimeoId}`;
      iframe.loading = 'eager';
      
      iframeRef.current = iframe;
      
      // Set up event listeners for iframe
      iframe.onload = handleIframeLoad;
      iframe.onerror = handleIframeError;
      
      // Before appending, make sure the container is empty
      if (containerRef.current) {
        try {
          // Clear any existing children from container
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
          
          // Append the new iframe
          containerRef.current.appendChild(iframe);
        } catch (error) {
          console.error('Error manipulating container DOM:', error);
          setLoadState('error');
        }
      }
    } catch (error) {
      console.error('Error creating Vimeo iframe:', error);
      handleIframeError();
    }
  }, [vimeoId, hash, autoplay, background, loop, muted, controls, showControls, title, safeRemoveIframe]);

  // Handle iframe load success
  const handleIframeLoad = useCallback(() => {
    if (!mountedRef.current) return;
    
    console.log(`Vimeo player ${vimeoId} loaded successfully`);
    setLoadState('loaded');
    setRetryCount(0); // Reset retry count on successful load
    
    try {
      // Initialize Vimeo player API if available
      if (window.Vimeo && window.Vimeo.Player && iframeRef.current) {
        vimeoPlayerRef.current = new window.Vimeo.Player(iframeRef.current);
        
        // Set up event listeners
        vimeoPlayerRef.current.on('play', () => {
          if (mountedRef.current) {
            setIsPlaying(true);
            onPlay?.();
          }
        });
        
        vimeoPlayerRef.current.on('pause', () => {
          if (mountedRef.current) {
            setIsPlaying(false);
            onPause?.();
          }
        });
        
        vimeoPlayerRef.current.on('ended', () => {
          if (mountedRef.current) {
            setIsPlaying(false);
            onEnd?.();
          }
        });
        
        vimeoPlayerRef.current.on('error', handleIframeError);
      }
    } catch (error) {
      console.error('Error initializing Vimeo Player API:', error);
      // Still consider the video loaded even if API fails
      // as the iframe might still work
    }
    
    onLoad?.();
  }, [vimeoId, onLoad, onPlay, onPause, onEnd]);

  // Handle iframe load error
  const handleIframeError = useCallback(() => {
    if (!mountedRef.current) return;
    
    console.error(`Vimeo player ${vimeoId} failed to load (attempt ${retryCount + 1})`);
    setLoadState('error');
    
    // Handle retry logic
    setRetryCount(prev => prev + 1);
    
    // Since we want unlimited retries, we'll always attempt to retry
    const nextRetryDelay = getRetryDelay(retryCount);
    console.log(`Will retry in ${Math.round(nextRetryDelay / 1000)} seconds`);
    
    // Notify error callback if provided
    onError?.();
    
    // Schedule retry with exponential backoff
    const retryTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      
      // Safely remove iframe
      safeRemoveIframe();
      
      // Reset to idle state to trigger a fresh load
      setLoadState('idle');
    }, nextRetryDelay);
    
    // Clean up timer if component unmounts
    return () => clearTimeout(retryTimer);
  }, [vimeoId, retryCount, getRetryDelay, onError, safeRemoveIframe]);

  // Handle retry button click
  const handleManualRetry = useCallback(() => {
    if (!mountedRef.current) return;
    
    console.log(`Manual retry for video ${vimeoId}`);
    
    // Safely remove iframe
    safeRemoveIframe();
    
    // Reset state and trigger reload
    setLoadState('idle');
    
    // Short delay before attempting reload
    setTimeout(() => {
      if (mountedRef.current) {
        initializePlayer();
      }
    }, 100);
  }, [vimeoId, initializePlayer, safeRemoveIframe]);

  // Manual play button handler
  const handlePlayClick = useCallback(() => {
    if (!mountedRef.current) return;
    
    if (loadState === 'loaded' && vimeoPlayerRef.current) {
      vimeoPlayerRef.current.play().catch(console.error);
    } else if (loadState === 'idle') {
      initializePlayer();
    } else if (loadState === 'error') {
      handleManualRetry();
    }
    
    // If we have controls, show them when user interacts
    if (controls) {
      setShowControls(true);
    }
  }, [loadState, controls, initializePlayer, handleManualRetry]);

  // Effect to initialize player when idle
  useEffect(() => {
    if (loadState === 'idle' && mountedRef.current) {
      // Small delay to avoid rapid re-initialization
      const initTimer = setTimeout(() => {
        if (mountedRef.current) {
          initializePlayer();
        }
      }, 100);
      
      return () => clearTimeout(initTimer);
    }
  }, [loadState, initializePlayer]);

  // Register with video load manager on mount
  useEffect(() => {
    if (!containerRef.current || !mountedRef.current) return;
    
    // Register this video with the load manager
    videoLoadManager.registerVideo(
      vimeoId, 
      containerRef.current,
      placeholderImage
    );
    
    // Add event listener for state changes
    const handleStateChange = (event: 'loading' | 'loaded' | 'error') => {
      if (event === 'loading' && loadState !== 'loading' && mountedRef.current) {
        initializePlayer();
      }
    };
    
    videoLoadManager.addEventListener(vimeoId, handleStateChange);
    
    return () => {
      videoLoadManager.removeEventListener(vimeoId, handleStateChange);
    };
  }, [vimeoId, placeholderImage, loadState, initializePlayer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy();
          vimeoPlayerRef.current = null;
        } catch (error) {
          console.error('Error destroying Vimeo player:', error);
        }
      }
      
      // Ensure iframe is removed when component unmounts
      safeRemoveIframe();
    };
  }, [safeRemoveIframe]);

  // Render different UI based on load state
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Aspect ratio container */}
      <div 
        style={{ paddingBottom: getAspectRatioPadding() }}
        className="relative w-full"
      >
        {/* Video container */}
        <div 
          ref={containerRef} 
          className="absolute inset-0 bg-black overflow-hidden"
        >
          {/* Loading state */}
          {loadState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-yellow/30 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="w-8 h-8 text-yellow animate-spin" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white text-sm font-medium">Loading video...</p>
                  {retryCount > 0 && (
                    <p className="text-yellow-400 text-xs mt-1">
                      Retry attempt {retryCount}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {loadState === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-white text-center">Video is temporarily unavailable</p>
                <button
                  onClick={handleManualRetry}
                  className="flex items-center space-x-2 bg-yellow text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors animate-pulse"
                >
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  <span>Automatic retry in progress...</span>
                </button>
                
                {/* Show fallback image if provided */}
                {placeholderImage && (
                  <div className="mt-4 w-full max-w-xs">
                    <img 
                      src={placeholderImage} 
                      alt="Video thumbnail" 
                      className="w-full rounded-lg border border-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Idle state with placeholder and play button */}
          {loadState === 'idle' && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black z-10 cursor-pointer"
              onClick={handlePlayClick}
            >
              {placeholderImage ? (
                <div className="absolute inset-0">
                  <img 
                    src={placeholderImage} 
                    alt="Video thumbnail" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button 
                      className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors transform hover:scale-105 duration-300 animate-pulse"
                      aria-label="Play video"
                    >
                      <Play className="w-8 h-8 text-black ml-1" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 text-black ml-1" />
                </button>
              )}
            </div>
          )}
          
          {/* Fallback image when video is in error state but still trying to load */}
          {loadState === 'error' && placeholderImage && (
            <div className="absolute inset-0 z-5">
              <img 
                src={placeholderImage} 
                alt="Video thumbnail fallback" 
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

EnhancedVimeoPlayer.displayName = 'EnhancedVimeoPlayer';
export default EnhancedVimeoPlayer;
