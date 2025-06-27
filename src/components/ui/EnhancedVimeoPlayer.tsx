import { useState, useRef, useEffect, memo } from 'react';
import { Loader, RefreshCw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import optimizedVideoManager from '@/utils/optimizedVideoManager';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Handle aspect ratio calculation
  const getAspectRatioPadding = () => {
    if (!aspectRatio) return '56.25%'; // Default to 16:9
    
    const [width, height] = aspectRatio.split(':').map(Number);
    if (!width || !height) return '56.25%';
    
    return `${(height / width) * 100}%`;
  };

  // Initialize Vimeo player
  const initializePlayer = () => {
    if (!containerRef.current || loadState === 'loading' || loadState === 'loaded') return;
    
    setLoadState('loading');
    
    try {
      // Build URL with parameters
      let url = `https://player.vimeo.com/video/${vimeoId}`;
      const params = new URLSearchParams();
      
      if (hash) params.append('h', hash);
      if (autoplay) params.append('autoplay', '1');
      if (background) params.append('background', '1');
      if (loop) params.append('loop', '1');
      if (muted) params.append('muted', '1');
      if (!controls) params.append('controls', '0');
      
      // Add standard parameters
      params.append('title', '0');
      params.append('byline', '0');
      params.append('portrait', '0');
      params.append('dnt', '1');
      
      url = `${url}?${params.toString()}`;
      
      // Create iframe if it doesn't exist
      if (!iframeRef.current) {
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
        
        if (containerRef.current) {
          containerRef.current.appendChild(iframe);
        }
      } else {
        // If iframe exists, update source
        iframeRef.current.src = url;
      }
    } catch (error) {
      console.error('Error creating Vimeo iframe:', error);
      handleIframeError();
    }
  };

  // Handle iframe load success
  const handleIframeLoad = () => {
    console.log(`Vimeo player ${vimeoId} loaded successfully`);
    setLoadState('loaded');
    
    try {
      // Initialize Vimeo player API if available
      if (window.Vimeo && window.Vimeo.Player && iframeRef.current) {
        vimeoPlayerRef.current = new window.Vimeo.Player(iframeRef.current);
        
        // Set up event listeners
        vimeoPlayerRef.current.on('play', () => {
          setIsPlaying(true);
          onPlay?.();
        });
        
        vimeoPlayerRef.current.on('pause', () => {
          setIsPlaying(false);
          onPause?.();
        });
        
        vimeoPlayerRef.current.on('ended', () => {
          setIsPlaying(false);
          onEnd?.();
        });
        
        vimeoPlayerRef.current.on('error', handleIframeError);
      }
    } catch (error) {
      console.error('Error initializing Vimeo Player API:', error);
      // Still consider the video loaded even if API fails
      // as the iframe might still work
    }
    
    onLoad?.();
  };

  // Handle iframe load error
  const handleIframeError = () => {
    console.error(`Vimeo player ${vimeoId} failed to load`);
    setLoadState('error');
    
    // Remove iframe if it exists
    if (iframeRef.current && iframeRef.current.parentNode) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
    
    onError?.();
  };

  // Handle retry button click
  const handleRetry = () => {
    if (loadState !== 'error') return;
    
    setRetryCount(prev => prev + 1);
    setLoadState('idle');
    
    // Clean up old iframe if it exists
    if (iframeRef.current && iframeRef.current.parentNode) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
    
    // Wait a bit before retrying
    setTimeout(() => {
      initializePlayer();
    }, 500);
  };

  // Manual play button handler
  const handlePlayClick = () => {
    if (loadState === 'loaded' && vimeoPlayerRef.current) {
      vimeoPlayerRef.current.play().catch(console.error);
    } else if (loadState === 'idle') {
      initializePlayer();
    } else if (loadState === 'error') {
      handleRetry();
    }
  };

  // Register with optimized video manager on mount
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Register this video with the optimized manager
    optimizedVideoManager.registerVideo(vimeoId, containerRef.current);
    
    // Check if video should be loaded based on visibility
    const checkVisibility = () => {
      if (optimizedVideoManager.isVideoVisible(vimeoId) && loadState === 'idle') {
        initializePlayer();
      }
    };
    
    // Initial check
    checkVisibility();
    
    // Set up periodic visibility check
    const intervalId = setInterval(checkVisibility, 1000);
    
    return () => {
      clearInterval(intervalId);
      optimizedVideoManager.unregisterVideo(vimeoId);
    };
  }, [vimeoId, loadState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Vimeo player:', error);
        }
      }
    };
  }, []);

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
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-yellow/30 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="w-8 h-8 text-yellow animate-spin" />
                  </div>
                </div>
                <p className="text-white text-sm font-medium">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {loadState === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
              <div className="flex flex-col items-center justify-center space-y-3">
                <p className="text-white text-center">Video could not be loaded</p>
                <button
                  onClick={handleRetry}
                  className="flex items-center space-x-2 bg-yellow text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Video</span>
                </button>
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
                      className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
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
        </div>
      </div>
    </div>
  );
});

EnhancedVimeoPlayer.displayName = 'EnhancedVimeoPlayer';
export default EnhancedVimeoPlayer;
