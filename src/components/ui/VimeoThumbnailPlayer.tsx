
import { useState, useEffect, useRef } from 'react';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VimeoThumbnailPlayerProps {
  vimeoId: string;
  thumbnailUrl: string;
  aspectRatio?: string;
  className?: string;
  hash?: string;
  loop?: boolean;
  background?: boolean;
  muted?: boolean;
  autoplay?: boolean;
}

const VimeoThumbnailPlayer = ({
  vimeoId,
  thumbnailUrl,
  aspectRatio = '16:9',
  className = '',
  hash = '',
  loop = true,
  background = true,
  muted = true,
  autoplay = true,
}: VimeoThumbnailPlayerProps) => {
  const [videoState, setVideoState] = useState<'thumbnail' | 'loading' | 'playing' | 'error'>('thumbnail');
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Calculate padding based on aspect ratio
  const getPaddingValue = () => {
    if (aspectRatio === '1:1') return '100%';
    if (aspectRatio === '4:3') return '75%';
    if (aspectRatio === '9:16') return '177.78%';
    return '56.25%'; // Default 16:9
  };

  // Build Vimeo URL with parameters
  const buildVimeoUrl = () => {
    const params = new URLSearchParams();
    
    if (hash) params.append('h', hash);
    if (autoplay) params.append('autoplay', '1');
    if (background) params.append('background', '1');
    if (loop) params.append('loop', '1');
    if (muted) params.append('muted', '1');
    
    // Standard parameters
    params.append('title', '0');
    params.append('byline', '0');
    params.append('portrait', '0');
    params.append('dnt', '1');
    
    return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
  };

  // Handle video loading with delay
  useEffect(() => {
    if (videoState === 'thumbnail') {
      // Deliberate delay before loading video
      const timer = setTimeout(() => {
        setVideoState('loading');

        // Create iframe after delay
        setTimeout(() => {
          if (!containerRef.current) return;
          
          const iframe = document.createElement('iframe');
          iframe.src = buildVimeoUrl();
          iframe.style.position = 'absolute';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
          iframe.title = `Vimeo video ${vimeoId}`;
          
          // Set event listeners
          iframe.onload = () => {
            setVideoState('playing');
          };
          
          iframe.onerror = () => {
            setVideoState('error');
          };
          
          // Store reference and append to DOM
          iframeRef.current = iframe;
          
          // Clear container first (safety)
          const container = containerRef.current;
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
          
          container.appendChild(iframe);
        }, 50);
      }, 500); // 500ms delay before attempting to load video
      
      return () => clearTimeout(timer);
    }
  }, [videoState, vimeoId, hash, autoplay, background, loop, muted]);

  // Handle retry attempts
  const handleRetry = () => {
    // Remove existing iframe
    if (iframeRef.current && containerRef.current) {
      containerRef.current.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
    
    setRetryCount(prev => prev + 1);
    setVideoState('thumbnail');
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Aspect ratio container */}
      <div 
        style={{ paddingBottom: getPaddingValue() }}
        className="relative w-full"
      >
        {/* Thumbnail image - always visible until video is playing */}
        {videoState !== 'playing' && (
          <div className="absolute inset-0 bg-black">
            <img 
              src={thumbnailUrl} 
              alt="Video thumbnail" 
              className="w-full h-full object-cover"
            />
            
            {/* Loading overlay */}
            {videoState === 'loading' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader className="w-8 h-8 text-yellow animate-spin mb-2" />
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}
            
            {/* Error overlay */}
            {videoState === 'error' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="flex flex-col items-center text-center px-4">
                  <AlertCircle className="w-8 h-8 text-yellow mb-2" />
                  <p className="text-white mb-3">Video could not be loaded</p>
                  <button 
                    onClick={handleRetry}
                    className="flex items-center gap-2 bg-yellow text-black px-4 py-2 rounded-full text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Video
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Video container */}
        <div 
          ref={containerRef}
          className="absolute inset-0 bg-black"
        ></div>
      </div>
    </div>
  );
};

export default VimeoThumbnailPlayer;
