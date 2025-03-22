
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
  const [loadError, setLoadError] = useState(false);
  const playerInitAttempted = useRef(false);

  // Initialize player when Vimeo API is available
  useEffect(() => {
    if (!playerInitAttempted.current && iframeRef.current && window.Vimeo?.Player) {
      playerInitAttempted.current = true;
      try {
        console.log(`Initializing Vimeo player for ${playerId}`);
        const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
        setPlayer(vimeoPlayer);
        
        // Set up player event listeners
        vimeoPlayer.on('ready', () => {
          console.log(`Vimeo player ${playerId} is ready`);
          setIsPlayerReady(true);
          setLoadingProgress(100);
          
          // Ensure video is initially paused but at 0.1 seconds for thumbnail
          vimeoPlayer.pause().then(() => {
            vimeoPlayer.setCurrentTime(0.1).then(() => {
              setTimeout(() => {
                setIsLoading(false);
              }, 300);
            }).catch(err => {
              console.log(`Error setting current time for ${playerId}:`, err);
              setIsLoading(false);
            });
          }).catch(err => {
            console.log(`Error pausing ${playerId}:`, err);
            setIsLoading(false);
          });
        });
        
        vimeoPlayer.on('play', () => {
          setIsPlaying(true);
          console.log(`Video ${playerId} is playing`);
        });
        
        vimeoPlayer.on('pause', () => {
          setIsPlaying(false);
        });
        
        vimeoPlayer.on('ended', () => {
          console.log(`Video ${playerId} ended, resetting`);
          setIsPlaying(false);
          vimeoPlayer.setCurrentTime(0.1).then(() => {
            vimeoPlayer.pause();
          });
        });

        vimeoPlayer.on('error', (error: any) => {
          console.error(`Vimeo player ${playerId} error:`, error);
          setLoadError(true);
          setIsLoading(false);
        });
      } catch (error) {
        console.error(`Error initializing Vimeo player ${playerId}:`, error);
        setLoadError(true);
        setIsLoading(false);
      }
    }
  }, [playerId, isScriptLoaded]);

  // Check if Vimeo API is loaded
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  useEffect(() => {
    if (window.Vimeo && window.Vimeo.Player) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => {
        console.log('Vimeo API script loaded');
        setIsScriptLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Error loading Vimeo API script:', error);
        setLoadError(true);
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else if (!isScriptLoaded) {
      setIsScriptLoaded(true);
    }
  }, []);

  // Initialize loading animation
  useEffect(() => {
    if (isLoading && !loadError) {
      const duration = priority ? 1500 : 2500;
      const interval = 100;
      const increment = 100 / (duration / interval);
      
      const timer = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + increment;
          return isPlayerReady ? 100 : Math.min(newProgress, 90);
        });
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isLoading, isPlayerReady, priority, loadError]);

  // Control video playback based on visibility
  useEffect(() => {
    if (!player) return;

    const viewStateChanged = wasInViewRef.current !== isInView;
    wasInViewRef.current = isInView;
    
    if (!isInView && viewStateChanged && isPlaying) {
      player.pause().catch(err => console.error(`Error pausing ${playerId}:`, err));
    }
  }, [isInView, player, isPlaying, playerId]);

  // Handle play button click
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!player) return;
    
    if (isPlaying) {
      player.pause().catch(err => console.error(`Error pausing ${playerId}:`, err));
    } else {
      player.play().catch(err => console.error(`Error playing ${playerId}:`, err));
    }
  };

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
    
    if (priority) {
      params.append('preload', 'auto');
    }
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  };

  return (
    <div className={`relative ${className}`}>
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        {isLoading && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-30">
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

        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-30">
            <div className="text-center p-4">
              <p className="text-red-500 font-medium mb-2">Video could not be loaded</p>
              <button 
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                  playerInitAttempted.current = false;
                  loadingProgress(0);
                }}
                className="px-4 py-2 bg-yellow hover:bg-yellow-dark text-black rounded-md text-sm"
              >
                Retry
              </button>
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
            opacity: isLoading || loadError ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }} 
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
          title="FitAnywhere"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          importance={priority ? "high" : "auto"}
        ></iframe>
        
        {isPlayerReady && !isPlaying && !isLoading && !loadError && (
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
