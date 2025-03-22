
import { useRef, useState, useEffect, memo } from 'react';
import { Loader } from 'lucide-react';
import { Skeleton } from './skeleton';
import { Progress } from './progress';

interface VimeoPlayerProps {
  videoId: string;
  playerId: string;
  className?: string;
  isInView: boolean;
  priority?: boolean;
}

const VimeoPlayer = memo(({
  videoId,
  playerId,
  className = "",
  isInView,
  priority = false
}: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const wasInViewRef = useRef(isInView);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Initialize loading animation
  useEffect(() => {
    if (isLoading) {
      const duration = priority ? 1500 : 2500; // faster loading for priority videos
      const interval = 100;
      const increment = 100 / (duration / interval);
      
      const timer = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + increment;
          // Cap at 90% until actually loaded
          return isPlayerReady ? 100 : Math.min(newProgress, 90);
        });
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isLoading, isPlayerReady, priority]);

  // Initialize player
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = typeof event.data === 'object' ? event.data : JSON.parse(event.data);
        
        if (data.event === "ready" && iframeRef.current) {
          if (window.Vimeo && window.Vimeo.Player) {
            const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
            setPlayer(vimeoPlayer);
            
            // Ensure video is initially paused but at 0.1 seconds for thumbnail
            vimeoPlayer.pause().then(() => {
              vimeoPlayer.setCurrentTime(0.1).then(() => {
                setIsPlayerReady(true);
                console.log("Vimeo player is ready");
                
                // Complete the loading progress
                setLoadingProgress(100);
                setTimeout(() => {
                  setIsLoading(false);
                }, 300); // small delay for smooth transition
              });
            });
            
            // Add event listeners
            vimeoPlayer.on('play', () => {
              setIsPlaying(true);
              console.log("Video can play now");
            });
            
            vimeoPlayer.on('pause', () => {
              setIsPlaying(false);
            });
            
            vimeoPlayer.on('ended', () => {
              console.log("Video ended, resetting to 0.1 seconds");
              // When video ends, reset to beginning and show play button again
              setIsPlaying(false); // Ensure we set isPlaying to false first
              vimeoPlayer.setCurrentTime(0.1).then(() => {
                // Additional confirmation that we're properly stopped
                vimeoPlayer.pause().then(() => {
                  console.log("Video reset to 0.1 seconds and paused");
                });
              });
            });
          }
        }
      } catch (e) {
        // Silent error handling to avoid console spam
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle play button click
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!player) return;
    
    if (isPlaying) {
      player.pause();
    } else {
      player.play().catch(() => {
        console.log("Failed to play video");
      });
    }
  };

  // Control video playback based on visibility
  useEffect(() => {
    if (!player) return;

    const viewStateChanged = wasInViewRef.current !== isInView;
    wasInViewRef.current = isInView;
    
    // Pause when moving out of view
    if (!isInView && viewStateChanged && isPlaying) {
      player.pause();
    }
  }, [isInView, player, isPlaying]);

  // Build iframe query params
  const buildIframeSrc = () => {
    const params = new URLSearchParams({
      h: 'd77ee52644',
      title: '0',
      byline: '0',
      portrait: '0',
      badge: '0',
      autopause: '0',
      background: '1',
      loop: '0',
      player_id: playerId,
      app_id: '58479',
      dnt: '1'
    });
    
    // Add autoplay for hero section (priority) video only if supported
    if (priority) {
      params.append('preload', 'auto');
    }
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  };

  return (
    <div className={`relative ${className}`}>
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-sm z-30">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Loader className="w-10 h-10 text-yellow animate-spin mb-4" />
              <div className="w-3/4 max-w-xs">
                <Progress 
                  value={loadingProgress} 
                  className="h-2 bg-gray-200" 
                />
              </div>
              <p className="text-black/70 mt-3 text-sm font-medium">
                {loadingProgress < 100 ? 'Loading video...' : 'Ready'}
              </p>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          src={buildIframeSrc()}
          style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            border: 'none',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }} 
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
          title="FitAnywhere"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          importance={priority ? "high" : "auto"}
        ></iframe>
        
        {isPlayerReady && !isPlaying && !isLoading && (
          <button 
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200 z-20"
            aria-label="Play video"
          >
            <div className="w-16 h-16 bg-yellow/90 rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-200">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black ml-1">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
});

// Display name for React DevTools
VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
