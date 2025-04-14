
import { useState, useRef, useEffect, memo } from 'react';
import { Loader, Play, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedVideoProps {
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

const OptimizedVideo = ({
  vimeoId,
  hash,
  title,
  autoplay = true,
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
}: OptimizedVideoProps) => {
  const [loadState, setLoadState] = useState<VideoLoadState>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // Handle aspect ratio calculation
  const getAspectRatioPadding = () => {
    if (!aspectRatio) return '56.25%'; // Default to 16:9
    
    const [width, height] = aspectRatio.split(':').map(Number);
    if (!width || !height) return '56.25%';
    
    return `${(height / width) * 100}%`;
  };

  // Set up intersection observer to detect when video enters viewport
  // with a large margin to start loading before it becomes visible
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      root: null, // viewport
      rootMargin: '200px', // start loading slightly before visible
      threshold: 0.1 // trigger when 10% of element is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const isNowInView = entry.isIntersecting;
      setIsInView(isNowInView);
      
      // Once it's been visible, remember that
      if (isNowInView && !hasBeenVisible) {
        setHasBeenVisible(true);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasBeenVisible]);

  // Only load video when user interacts OR element has been in view AND autoplay is true
  useEffect(() => {
    if ((userInteracted || (hasBeenVisible && autoplay)) && loadState === 'idle') {
      loadVideo();
    }
  }, [userInteracted, hasBeenVisible, autoplay, loadState]);

  // Initialize Vimeo player when conditions are met
  const loadVideo = () => {
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
      params.append('preload', 'none'); // Prevent preloading
      
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
        iframe.loading = 'lazy';
        
        // Set up event listeners for iframe
        iframe.onload = handleVideoLoaded;
        iframe.onerror = handleVideoError;
        
        iframeRef.current = iframe;
        
        if (containerRef.current) {
          containerRef.current.appendChild(iframe);
        }
      }
    } catch (error) {
      console.error('Error creating Vimeo iframe:', error);
      handleVideoError();
    }
  };

  const handleVideoLoaded = () => {
    setLoadState('loaded');
    onLoad?.();
  };

  const handleVideoError = () => {
    setLoadState('error');
    
    // Remove iframe if it exists
    if (iframeRef.current && iframeRef.current.parentNode) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
    
    onError?.();
  };

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
    setTimeout(loadVideo, 500);
  };

  const handlePlayClick = () => {
    setUserInteracted(true);
    
    if (loadState === 'error') {
      handleRetry();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up iframe if it exists
      if (iframeRef.current && iframeRef.current.parentNode) {
        iframeRef.current.parentNode.removeChild(iframeRef.current);
      }
    };
  }, []);

  // Render different UI based on load state
  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      data-load-state={loadState}
      data-in-view={isInView}
    >
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
                  aria-label="Retry loading video"
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
                    alt={title || "Video thumbnail"}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    width="640" 
                    height="360"
                    fetchpriority="high"
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
};

export default memo(OptimizedVideo);
