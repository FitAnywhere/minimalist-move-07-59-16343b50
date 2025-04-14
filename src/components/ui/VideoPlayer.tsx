
import { useState, useRef, useEffect, memo } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  priority?: boolean;
  playMode?: 'always' | 'onView';
  width?: number;
  height?: number;
  fetchpriority?: 'high' | 'low' | 'auto';
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onLoadedMetadata?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}

const VideoPlayer = memo(({
  src,
  poster,
  className,
  aspectRatio = 'video',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  preload = 'none', // Changed default to 'none' for true lazy loading
  priority = false,
  playMode = 'onView',
  width,
  height,
  fetchpriority = 'low', // Default to low priority fetch
  onPlay,
  onPause,
  onEnded,
  onLoadedMetadata
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'video':
      default: return 'aspect-video';
    }
  };

  // Setup intersection observer to detect when video enters viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      rootMargin: '100px', // Start loading slightly before visible
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const wasVisible = isVisible;
      setIsVisible(entry.isIntersecting);
      
      // Only trigger video loading when it becomes visible for the first time
      if (!wasVisible && entry.isIntersecting && !isLoaded && videoRef.current) {
        if (priority || (playMode === 'onView' && autoPlay)) {
          loadVideo();
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible, isLoaded, priority, autoPlay, playMode]);

  // Function to actually load the video
  const loadVideo = () => {
    if (!videoRef.current || isLoaded) return;
    
    // Set the source programmatically
    if (!videoRef.current.src) {
      videoRef.current.src = src;
    }
    
    // Explicitly call load() to start loading the video
    videoRef.current.load();
    setIsLoaded(true);
    
    // Update data attribute for debugging
    containerRef.current?.setAttribute('data-loaded', 'true');
    
    // Auto-play if needed
    if ((isVisible && autoPlay && playMode === 'onView') || 
        (autoPlay && playMode === 'always') || 
        hasUserInteracted) {
      playVideo();
    }
  };

  const playVideo = () => {
    if (!videoRef.current) return;
    
    // Ensure video is loaded before attempting to play
    if (!isLoaded) {
      loadVideo();
    }

    try {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            onPlay?.();
          })
          .catch(error => {
            console.error('Play failed:', error);
          });
      }
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  const handlePlayClick = () => {
    setHasUserInteracted(true);
    playVideo();
  };

  // Handle play/pause when visibility changes (for "onView" mode)
  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    if (playMode === 'onView') {
      if (isVisible && autoPlay) {
        playVideo();
      } else if (!isVisible && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      }
    }
  }, [isVisible, isLoaded, autoPlay, playMode, isPlaying, onPause]);

  // Handle play/pause/ended events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
        onEnded?.();
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [loop, onEnded, onPause]);

  // Special case for priority videos that should load early
  useEffect(() => {
    if (priority && !isLoaded) {
      loadVideo();
    }
  }, [priority, isLoaded]);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", getAspectRatioClass(), className)}
      data-loaded={isLoaded ? "true" : "false"}
      data-playing={isPlaying ? "true" : "false"}
      data-visible={isVisible ? "true" : "false"}
    >
      <video
        ref={videoRef}
        preload={preload}
        muted={muted}
        playsInline
        loop={loop}
        controls={controls && isPlaying}
        poster={poster}
        className="w-full h-full object-cover"
        aria-label="Video player"
        width={width}
        height={height}
        fetchpriority={fetchpriority}
        loading="lazy"
        onLoadedMetadata={(event) => {
          setIsLoaded(true);
          onLoadedMetadata?.(event);
        }}
      >
        {/* Source is now set dynamically via JavaScript when in viewport */}
        {isLoaded && <source src={src} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity duration-300"
          onClick={handlePlayClick}
        >
          <button
            className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
            aria-label="Play video"
            type="button"
          >
            <Play className="w-8 h-8 text-black ml-1" />
          </button>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
