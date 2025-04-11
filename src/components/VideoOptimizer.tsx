
import { useState, useRef, useEffect, memo } from 'react';
import { Loader, RefreshCw } from 'lucide-react';
import videoLoadManager from '@/utils/videoOptimization';
import EnhancedVimeoPlayer from '@/components/ui/EnhancedVimeoPlayer';

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // EnhancedVimeoPlayer already handles retries internally
  
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
    
    return () => {
      // Cleanup
    };
  }, [vimeoId]);

  const handleLoad = () => {
    console.log(`Video ${vimeoId} loaded successfully`);
    setShowError(false);
    setIsLoading(false);
    onLoaded(vimeoId);
  };

  const handleError = () => {
    console.log(`Video ${vimeoId} reported an error, will auto-retry`);
    setLoadAttempts(prev => prev + 1);
    // EnhancedVimeoPlayer handles retries, we just track attempt count
  };

  const handleRetryClick = () => {
    setShowError(false);
    setLoadAttempts(0);
    setIsLoading(true);
    onRetry();
  };

  // Use EnhancedVimeoPlayer component for better handling
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
      <EnhancedVimeoPlayer 
        vimeoId={vimeoId}
        hash={hash}
        title={`Testimonial video ${vimeoId}`}
        autoplay={autoplay}
        loop={loop}
        muted={muted}
        background={background}
        className="w-full h-full"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
});

VideoOptimizer.displayName = 'VideoOptimizer';
export default VideoOptimizer;
