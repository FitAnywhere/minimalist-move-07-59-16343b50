
import { useRef, useState, useEffect, memo } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { Skeleton } from './skeleton';
import { Progress } from './progress';

interface VimeoPlayerProps {
  videoId: string;
  playerId: string;
  className?: string;
  isInView: boolean;
  audioOn: boolean;
  toggleAudio: (e: React.MouseEvent) => void;
  priority?: boolean;
}

const VimeoPlayer = memo(({
  videoId,
  playerId,
  className = "",
  isInView,
  audioOn,
  toggleAudio,
  priority = false
}: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wasInViewRef = useRef(isInView);

  // Clear any existing progress timers when component unmounts
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = typeof event.data === 'object' ? event.data : JSON.parse(event.data);
        
        if (data.event === "ready" && iframeRef.current) {
          if (window.Vimeo && window.Vimeo.Player) {
            const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
            setPlayer(vimeoPlayer);
            
            vimeoPlayer.setVolume(audioOn ? 1 : 0);
            vimeoPlayer.setMuted(!audioOn);
            
            vimeoPlayer.pause().then(() => {
              vimeoPlayer.setCurrentTime(0.1).then(() => {
                setIsPlayerReady(true);
                console.log("Vimeo player is ready");
              });
            });
            
            vimeoPlayer.on('play', () => {
              setIsPlaying(true);
              setIsLoading(false);
              setLoadingProgress(100);
              console.log("Video can play now");
            });
            
            vimeoPlayer.on('pause', () => {
              setIsPlaying(false);
            });
            
            vimeoPlayer.on('bufferstart', () => {
              setIsLoading(true);
            });
            
            vimeoPlayer.on('bufferend', () => {
              setIsLoading(false);
              setLoadingProgress(100);
            });
            
            vimeoPlayer.on('progress', (data: any) => {
              if (data && data.percent) {
                // Ensure progress never goes backwards
                setLoadingProgress(prev => Math.max(prev, Math.round(data.percent * 100)));
              }
            });
            
            vimeoPlayer.on('loaded', () => {
              setIsLoading(false);
              setLoadingProgress(100);
            });
            
            vimeoPlayer.on('ended', () => {
              console.log("Video ended, resetting to 0.1 seconds");
              setIsPlaying(false);
              vimeoPlayer.setCurrentTime(0.1).then(() => {
                vimeoPlayer.pause().then(() => {
                  console.log("Video reset to 0.1 seconds and paused");
                });
              });
            });
          }
        }
      } catch (e) {
        console.error("Error handling Vimeo message:", e);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Start loading animation with smoother progression
    if (isLoading && loadingProgress === 0) {
      // Clear any existing timers
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
      
      let progress = 0;
      const simulateLoading = () => {
        progress += Math.random() * 3 + 1; // Random increment between 1-4
        if (progress > 90) {
          // Cap at 90% for simulated loading - the real events will take it to 100%
          progress = 90;
          return;
        }
        
        setLoadingProgress(Math.min(Math.round(progress), 90));
        
        // Continue simulation until we reach 90%
        if (progress < 90) {
          progressTimerRef.current = setTimeout(simulateLoading, 300);
        }
      };
      
      // Begin simulation after a short delay
      progressTimerRef.current = setTimeout(simulateLoading, 300);
    }
    
    return () => {
      window.removeEventListener('message', handleMessage);
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
    };
  }, [audioOn, isLoading, loadingProgress]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!player) return;
    
    if (isPlaying) {
      player.pause();
    } else {
      player.setVolume(audioOn ? 1 : 0);
      player.setMuted(!audioOn);
      
      player.play().catch((error: any) => {
        console.log("Failed to play video:", error);
        // Reset loading state if play fails
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (!player) return;

    const viewStateChanged = wasInViewRef.current !== isInView;
    wasInViewRef.current = isInView;

    player.setVolume(audioOn ? 1 : 0);
    player.setMuted(!audioOn);
    
    if (!isInView && viewStateChanged && isPlaying) {
      player.pause();
    }
  }, [isInView, player, audioOn, isPlaying]);

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
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 rounded-lg">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-full bg-yellow opacity-30 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-yellow opacity-60 animate-pulse animation-delay-200"></div>
              <div className="absolute inset-4 rounded-full bg-yellow opacity-80 animate-pulse animation-delay-300"></div>
              <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
                <svg className="w-5 h-5 text-black animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            
            <div className="w-3/4 max-w-xs">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow transition-all duration-300 rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-white/80 mt-3 font-medium tracking-wide">
                LOADING VIDEO... {loadingProgress}%
              </p>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          src={buildIframeSrc()}
          style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}} 
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
          title="FitAnywhere"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          importance={priority ? "high" : "auto"}
        ></iframe>
        
        {isPlayerReady && !isPlaying && (
          <button 
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200 z-20"
            aria-label="Play video"
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-yellow/90 transition-colors duration-300 group">
              <Play size={28} className="text-black ml-1 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </button>
        )}
      </div>
      
      <button 
        onClick={toggleAudio}
        className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all duration-300 z-30"
        aria-label={audioOn ? "Mute audio" : "Unmute audio"}
      >
        {audioOn ? (
          <Volume2 size={20} className="text-white" />
        ) : (
          <VolumeX size={20} className="text-white" />
        )}
      </button>
    </div>
  );
});

VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
