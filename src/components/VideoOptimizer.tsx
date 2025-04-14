
import { useState, useRef, useEffect, memo } from 'react';
import { Loader, RefreshCw } from 'lucide-react';
import videoLoadManager from '@/utils/videoLoadManager';

interface VideoOptimizerProps {
  vimeoId: string;
  hash: string;
  onLoaded: (vimeoId: string) => void;
  isVisible: boolean;
  uniqueKey: string;
  onRetry: () => void;
  className?: string;
  background?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoplay?: boolean;
}

const VideoOptimizer = memo(({
  vimeoId,
  hash,
  onLoaded,
  isVisible,
  uniqueKey,
  onRetry,
  className = '',
  background = true,
  muted = true,
  loop = true,
  autoplay = true
}: VideoOptimizerProps) => {
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const maxRetries = 5;
  const retryDelays = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff

  useEffect(() => {
    // Reset state when key changes (e.g., changing videos)
    setShowError(false);
    setLoadAttempts(0);
    setIsLoading(true);
    setHasStartedLoading(false);
  }, [uniqueKey]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return;
    
    const options = {
      rootMargin: '200px',
      threshold: 0.1
    };
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasStartedLoading) {
        setHasStartedLoading(true);
        loadVideo();
      }
    };
    
    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasStartedLoading]);

  useEffect(() => {
    // Register with video load manager
    if (containerRef.current) {
      videoLoadManager.registerVideo(vimeoId, containerRef.current);
    }
    
    return () => {
      // Cleanup
    };
  }, [vimeoId]);
  
  const loadVideo = () => {
    if (!containerRef.current || !isVisible) return;
    
    // Set data attribute for debugging
    containerRef.current.setAttribute('data-loading', 'true');
    
    // Create iframe only when needed (lazy)
    if (!iframeRef.current) {
      try {
        const iframe = document.createElement('iframe');
        
        // Build URL with parameters
        const params = new URLSearchParams();
        
        if (hash) params.append('h', hash);
        if (autoplay) params.append('autoplay', '1');
        if (background) params.append('background', '1');
        if (loop) params.append('loop', '1');
        if (muted) params.append('muted', '1');
        
        // Add standard parameters
        params.append('title', '0');
        params.append('byline', '0');
        params.append('portrait', '0');
        params.append('dnt', '1');
        params.append('preload', 'none'); // Never preload
        
        const url = `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
        
        iframe.src = url;
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.backgroundColor = "black";
        iframe.title = `Vimeo video ${vimeoId}`;
        iframe.loading = "lazy";
        
        iframe.onload = handleLoad;
        iframe.onerror = handleError;
        
        iframeRef.current = iframe;
        
        if (containerRef.current) {
          containerRef.current.appendChild(iframe);
        }
      } catch (error) {
        console.error(`Error creating iframe for video ${vimeoId}:`, error);
        handleError();
      }
    }
  };

  const handleLoad = () => {
    console.log(`Video ${vimeoId} loaded successfully`);
    setShowError(false);
    setIsLoading(false);
    onLoaded(vimeoId);
    
    if (containerRef.current) {
      containerRef.current.setAttribute('data-loading', 'false');
      containerRef.current.setAttribute('data-loaded', 'true');
    }
    
    videoLoadManager.markVideoLoaded(vimeoId);
  };

  const handleError = () => {
    if (loadAttempts < maxRetries) {
      const retryDelay = retryDelays[loadAttempts] || 3000;
      console.log(`Video ${vimeoId} load failed, retrying in ${retryDelay}ms (attempt ${loadAttempts + 1}/${maxRetries})`);
      
      setLoadAttempts(prev => prev + 1);
      
      setTimeout(() => {
        if (iframeRef.current) {
          // Remove old iframe
          iframeRef.current.remove();
          iframeRef.current = null;
          
          // Try again
          loadVideo();
        }
      }, retryDelay);
    } else {
      console.error(`Video ${vimeoId} failed to load after ${maxRetries} attempts`);
      setShowError(true);
      setIsLoading(false);
      
      if (containerRef.current) {
        containerRef.current.setAttribute('data-loading', 'false');
        containerRef.current.setAttribute('data-loaded', 'error');
      }
      
      videoLoadManager.markVideoError(vimeoId);
    }
  };

  const handleRetryClick = () => {
    setShowError(false);
    setLoadAttempts(0);
    setIsLoading(true);
    
    // Remove existing iframe
    if (iframeRef.current && iframeRef.current.parentNode) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
    
    // Load again
    loadVideo();
    
    onRetry();
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
        backgroundColor: 'black',
        zIndex: 5
      }}
      className={className}
      data-vimeo-id={vimeoId}
      data-loaded={showError ? 'error' : hasStartedLoading ? (isLoading ? 'loading' : 'true') : 'false'}
    >
      {showError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-white mb-4">Video could not be loaded</p>
            <button 
              onClick={handleRetryClick} 
              className="flex items-center gap-2 bg-yellow text-black px-3 py-2 rounded-full text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Video
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* iframe is created dynamically in loadVideo function */}
          
          {isLoading && hasStartedLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-yellow/30 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="h-8 w-8 text-yellow animate-spin" />
                  </div>
                </div>
                <div className="text-white text-sm text-center">
                  <p>Loading video...</p>
                  {loadAttempts > 0 && (
                    <p className="text-yellow-400 text-xs mt-1">
                      Retry {loadAttempts}/{maxRetries}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

VideoOptimizer.displayName = 'VideoOptimizer';
export default VideoOptimizer;
