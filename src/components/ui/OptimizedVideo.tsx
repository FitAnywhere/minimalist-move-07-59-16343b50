
import { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import VideoContainer from './video/VideoContainer';
import VideoLoadingIndicator from './video/VideoLoadingIndicator';
import VideoErrorState from './video/VideoErrorState';
import VideoPlayButton from './video/VideoPlayButton';

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

  // Set up intersection observer to detect when video enters viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      root: null, // viewport
      rootMargin: '100px', // start loading slightly before visible
      threshold: 0.1 // trigger when 10% of element is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Initialize Vimeo player when user interacts and element is in view
  const loadVideo = () => {
    if (!containerRef.current || loadState === 'loading' || loadState === 'loaded') return;
    
    setLoadState('loading');
    setUserInteracted(true);
    
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
    if (!userInteracted) {
      loadVideo();
    } else if (loadState === 'error') {
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
    <VideoContainer className={cn(className)} aspectRatio={aspectRatio}>
      {/* Loading state */}
      {loadState === 'loading' && (
        <VideoLoadingIndicator retryCount={retryCount} maxRetries={5} />
      )}

      {/* Error state */}
      {loadState === 'error' && (
        <VideoErrorState onRetry={handleRetry} />
      )}

      {/* Idle state with placeholder and play button */}
      {loadState === 'idle' && (
        <VideoPlayButton 
          onClick={handlePlayClick} 
          placeholderImage={placeholderImage} 
          title={title} 
        />
      )}
    </VideoContainer>
  );
};

export default memo(OptimizedVideo);
