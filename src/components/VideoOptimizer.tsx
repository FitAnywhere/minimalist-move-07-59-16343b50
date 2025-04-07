
import { useState, useRef, useEffect, memo } from 'react';
import { Loader, RefreshCw } from 'lucide-react';
import videoLoadManager from '@/utils/videoOptimization';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxRetries = 5;
  const retryDelays = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff

  useEffect(() => {
    // Reset state when key changes (e.g., changing videos)
    setShowError(false);
    setLoadAttempts(0);
    setIsLoading(true);
  }, [uniqueKey]);

  useEffect(() => {
    // Register with video load manager
    if (containerRef.current) {
      videoLoadManager.registerVideo(vimeoId, containerRef.current);
    }
    
    // Setup error listener
    const handleVideoError = () => {
      if (loadAttempts < maxRetries) {
        const retryDelay = retryDelays[loadAttempts] || 3000;
        console.log(`Video ${vimeoId} load failed, retrying in ${retryDelay}ms (attempt ${loadAttempts + 1}/${maxRetries})`);
        
        setLoadAttempts(prev => prev + 1);
        
        setTimeout(() => {
          if (iframeRef.current) {
            const src = iframeRef.current.src;
            iframeRef.current.src = '';
            
            // Short delay before setting src again
            setTimeout(() => {
              if (iframeRef.current) {
                iframeRef.current.src = src;
              }
            }, 50);
          }
        }, retryDelay);
      } else {
        console.error(`Video ${vimeoId} failed to load after ${maxRetries} attempts`);
        setShowError(true);
        setIsLoading(false);
      }
    };
    
    return () => {
      // Cleanup
    };
  }, [vimeoId, loadAttempts, maxRetries, retryDelays]);

  const handleLoad = () => {
    console.log(`Video ${vimeoId} loaded successfully`);
    setShowError(false);
    setIsLoading(false);
    onLoaded(vimeoId);
  };

  const handleError = () => {
    handleVideoError();
  };

  const handleRetryClick = () => {
    setShowError(false);
    setLoadAttempts(0);
    setIsLoading(true);
    onRetry();
  };

  // Build URL with parameters
  const buildVimeoUrl = () => {
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
    params.append('preload', 'metadata');
    
    return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
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
          <iframe 
            ref={iframeRef}
            key={uniqueKey} 
            src={buildVimeoUrl()} 
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'black'
            }} 
            title={`Testimonial video ${vimeoId}`} 
            onLoad={handleLoad}
            onError={handleError}
            loading="eager"
          ></iframe>
          
          {isLoading && (
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
