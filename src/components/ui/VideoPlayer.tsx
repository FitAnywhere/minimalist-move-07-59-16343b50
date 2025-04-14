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
  preload = 'metadata',
  priority = false,
  playMode = 'onView',
  width,
  height,
  onPlay,
  onPause,
  onEnded,
  onLoadedMetadata
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay && playMode === 'always');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get aspect ratio style
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'video':
      default: return 'aspect-video';
    }
  };

  // Setup intersection observer to detect when video is in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      rootMargin: '100px', // Start loading slightly before video enters viewport
      threshold: 0.1 // 10% visibility to trigger
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Load video when it becomes visible or if it has priority
  useEffect(() => {
    if ((isVisible || priority) && videoRef.current && !isLoaded) {
      // If preload is set to 'none', we'll only load the poster
      // If not, it will load based on the preload attribute
      if (preload !== 'none') {
        videoRef.current.load();
      }
      setIsLoaded(true);
    }
  }, [isVisible, priority, isLoaded, preload]);

  // Handle playback based on visibility and playMode
  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    // For "always" mode, play regardless of visibility once loaded
    if (playMode === 'always' && autoPlay) {
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              onPlay?.();
            })
            .catch(error => {
              console.error('Auto-play failed:', error);
              // On mobile, especially Safari, we might need user interaction
              // The play button will be shown in this case
            });
        }
      } catch (error) {
        console.error('Error during auto-play:', error);
      }
    }
    // For "onView" mode, play only when visible
    else if (playMode === 'onView') {
      if (isVisible && autoPlay) {
        try {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                onPlay?.();
              })
              .catch(error => {
                console.error('Play on view failed:', error);
              });
          }
        } catch (error) {
          console.error('Error playing video on view:', error);
        }
      } else if (!isVisible && isPlaying) {
        // Pause when out of view
        videoRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      }
    }
  }, [isVisible, isLoaded, autoPlay, playMode, isPlaying, onPlay, onPause]);

  // Handle play button click
  const handlePlayClick = () => {
    if (!videoRef.current) return;

    // Ensure video is loaded before trying to play
    if (!isLoaded) {
      videoRef.current.load();
      setIsLoaded(true);
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

  // Handle video ended event
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

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", getAspectRatioClass(), className)}
      data-loaded={isLoaded}
      data-playing={isPlaying}
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
        onLoadedMetadata={(event) => {
          setIsLoaded(true);
          onLoadedMetadata?.(event);
        }}
      >
        <source src={src} type="video/mp4" />
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
