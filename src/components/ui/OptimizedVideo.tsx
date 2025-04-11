
import { useState, useRef, memo } from 'react';
import { Play, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedVideoProps {
  vimeoId: string;
  hash?: string;
  title?: string;
  aspectRatio?: string;
  className?: string;
  placeholderImage: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  background?: boolean;
}

const OptimizedVideo = memo(({
  vimeoId,
  hash,
  title = 'Video',
  aspectRatio = '16:9',
  className,
  placeholderImage,
  autoplay = false,
  loop = false,
  muted = true,
  controls = false,
  background = true,
}: OptimizedVideoProps) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate aspect ratio padding
  const getAspectRatioPadding = () => {
    if (aspectRatio === '16:9') return '56.25%';
    if (aspectRatio === '4:3') return '75%';
    if (aspectRatio === '1:1') return '100%';
    if (aspectRatio === '3:4') return '133.33%';
    return '56.25%'; // Default to 16:9
  };
  
  // Handle play button click
  const handlePlay = () => {
    if (videoLoaded) return;
    setIsLoading(true);
    loadVimeoPlayer();
  };
  
  // Load Vimeo player
  const loadVimeoPlayer = () => {
    if (!containerRef.current || videoLoaded) return;
    
    // Build Vimeo URL with parameters
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
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.loading = 'lazy';
    iframe.title = title;
    
    // Handle iframe load events
    iframe.onload = () => {
      setIsLoading(false);
      setVideoLoaded(true);
    };
    
    iframe.onerror = () => {
      setIsLoading(false);
      console.error('Failed to load video:', vimeoId);
    };
    
    // Clear container and append iframe
    if (containerRef.current) {
      const container = containerRef.current;
      // Remove all children
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(iframe);
    }
  };
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div 
        style={{ paddingBottom: getAspectRatioPadding() }}
        className="relative w-full"
      >
        <div 
          ref={containerRef} 
          className="absolute inset-0 bg-black overflow-hidden"
        >
          {!videoLoaded && (
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={handlePlay}
            >
              {/* Placeholder image */}
              <img 
                src={placeholderImage} 
                alt={`${title} thumbnail`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40">
                <button 
                  aria-label="Play video"
                  className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                >
                  <Play className="w-8 h-8 text-black ml-1" />
                </button>
              </div>
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
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
        </div>
      </div>
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';
export default OptimizedVideo;
