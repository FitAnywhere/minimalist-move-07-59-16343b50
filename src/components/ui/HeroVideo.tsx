
import { memo, useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroVideoProps {
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
  loadImmediately?: boolean;
  playOnScroll?: boolean;
  scrollThreshold?: number;
  onLoad?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
}

const HeroVideo = memo(({
  className,
  aspectRatio = 'video',
  loadImmediately = false,
  playOnScroll = true,
  scrollThreshold = 0.2,
  onLoad,
  onPlay,
  onPause
}: HeroVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
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

  // Set up intersection observer to detect when component is in view
  useEffect(() => {
    if (!containerRef.current || !playOnScroll) return;

    const options = {
      rootMargin: '100px',
      threshold: scrollThreshold
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && !isLoaded) {
        // First priority: load the video without playing it
        loadVideo();
      }
      
      if (entry.isIntersecting && isLoaded && !isPlaying && hasInteracted) {
        // If loaded and user has previously interacted, resume playing
        playVideo();
      } else if (!entry.isIntersecting && isPlaying) {
        // Pause video when out of view
        pauseVideo();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoaded, isPlaying, playOnScroll, scrollThreshold, hasInteracted]);

  // Load video when component mounts if loadImmediately is true
  useEffect(() => {
    if (loadImmediately && !isLoaded) {
      loadVideo();
    }
    
    // Add preload hint for the poster image only
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = 'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [loadImmediately]);

  const loadVideo = () => {
    if (!videoRef.current || isLoaded) return;
    
    // Set the video's src attribute to trigger loading
    videoRef.current.load();
    setIsLoaded(true);
    onLoad?.();
  };

  const playVideo = () => {
    if (!videoRef.current || !isLoaded || isPlaying) return;
    
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
          });
      }
    } catch (error) {
      console.error('Error during play:', error);
    }
  };

  const pauseVideo = () => {
    if (!videoRef.current || !isPlaying) return;
    
    videoRef.current.pause();
    setIsPlaying(false);
    onPause?.();
  };

  const handlePlayClick = () => {
    if (!isLoaded) {
      loadVideo();
    }
    
    setHasInteracted(true);
    playVideo();
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden", 
        getAspectRatioClass(), 
        className
      )}
    >
      <video
        ref={videoRef}
        preload="none"
        muted
        playsInline
        loop
        className="w-full h-full object-cover"
        poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
        aria-label="Introduction video"
      >
        <source src="/114 Intor Video Optt.mp4" type="video/mp4" />
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

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
