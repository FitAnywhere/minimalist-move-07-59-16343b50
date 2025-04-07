
import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { Loader, RefreshCw } from 'lucide-react';
import { loadVimeoScript, preloadVimeoVideo } from '@/utils/videoLoader';

interface VideoTestimonialProps {
  vimeoId: string;
  hash: string;
  onLoaded?: (vimeoId: string) => void;
  isVisible?: boolean;
  isMobile?: boolean;
  uniqueKey?: string;
  onRetry?: () => void;
  className?: string;
}

const VideoLoader = memo(() => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 rounded-lg">
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-yellow/30 animate-pulse" />
        
        <div className="absolute inset-0 w-20 h-20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-yellow/50 animate-pulse animation-delay-200" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="w-8 h-8 text-yellow animate-spin" />
        </div>
      </div>
      
      <div className="text-white font-medium tracking-wide text-center">
        <p>LOADING VIDEO</p>
        <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-yellow animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
));
VideoLoader.displayName = 'VideoLoader';

const VideoTestimonial = memo(({
  vimeoId,
  hash,
  onLoaded,
  isVisible = false,
  isMobile = false,
  uniqueKey = '',
  onRetry,
  className = ''
}: VideoTestimonialProps) => {
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const maxRetries = 5;

  // Preload video when component mounts
  useEffect(() => {
    preloadVimeoVideo(vimeoId, hash);
    
    // Load Vimeo script if needed
    loadVimeoScript().catch(err => {
      console.error('Error loading Vimeo script:', err);
    });
  }, [vimeoId, hash]);

  // Reset state when uniqueKey changes
  useEffect(() => {
    setShowError(false);
    setLoadAttempts(0);
    setIsLoading(true);
  }, [uniqueKey]);

  const handleLoad = () => {
    setShowError(false);
    setIsLoading(false);
    if (onLoaded) onLoaded(vimeoId);
  };

  const handleError = () => {
    if (loadAttempts < maxRetries) {
      // Exponential backoff retry
      const retryDelay = Math.min(1000 * Math.pow(2, loadAttempts), 30000);
      setLoadAttempts(prev => prev + 1);
      
      setTimeout(() => {
        if (iframeRef.current) {
          const src = iframeRef.current.src;
          iframeRef.current.src = '';
          setTimeout(() => {
            if (iframeRef.current) iframeRef.current.src = src;
          }, 50);
        }
      }, retryDelay);
    } else {
      setShowError(true);
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 bg-black transition-opacity duration-300", 
        isVisible ? "opacity-100 z-5" : "opacity-0 z-1",
        className
      )}
    >
      {showError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-white mb-4">Video could not be loaded</p>
            <button 
              onClick={onRetry} 
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
            src={`https://player.vimeo.com/video/${vimeoId}?h=${hash}&autoplay=1&background=1&loop=1&muted=1&title=0&byline=0&portrait=0&preload=auto`} 
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
            loading="lazy"
          ></iframe>
          
          {isLoading && <VideoLoader />}
        </>
      )}
    </div>
  );
});

VideoTestimonial.displayName = 'VideoTestimonial';
export default VideoTestimonial;
