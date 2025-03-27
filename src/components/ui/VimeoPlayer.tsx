
import { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Volume, Play, Loader } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VimeoPlayerProps {
  videoId: string;
  playerId: string;
  className?: string;
  isInView: boolean;
  audioOn: boolean;
  toggleAudio: (e: React.MouseEvent) => void;
  priority?: boolean;
}

// Optimized Vimeo Player with better loading states and event handling
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
  const [videoVisible, setVideoVisible] = useState(false);
  const [volume, setVolume] = useState(1); // 0 to 1
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const wasInViewRef = useRef(isInView);
  const messageHandlerRef = useRef<(event: MessageEvent) => void>();
  const audioOnRef = useRef(audioOn);
  
  // Update ref when prop changes
  useEffect(() => {
    audioOnRef.current = audioOn;
  }, [audioOn]);
  
  // Handle click outside volume control to hide slider
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Memoize the iframe source URL
  const buildIframeSrc = useCallback(() => {
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
      dnt: '1',
      autoplay: '1', // Always try to autoplay
      muted: '1'     // Start muted to ensure autoplay works
    });
    
    if (priority) {
      params.append('preload', 'auto');
    }
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }, [videoId, playerId, priority]);

  // Optimized message handler with memoization
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = typeof event.data === 'object' ? event.data : JSON.parse(event.data);
        
        if (data.event === "ready" && iframeRef.current) {
          if (window.Vimeo && window.Vimeo.Player) {
            const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
            setPlayer(vimeoPlayer);
            
            vimeoPlayer.setVolume(audioOnRef.current ? volume : 0);
            vimeoPlayer.setMuted(!audioOnRef.current);
            
            vimeoPlayer.on('play', () => {
              setIsPlaying(true);
              setVideoVisible(true);
              setIsLoading(false);
            });
            
            vimeoPlayer.on('pause', () => {
              setIsPlaying(false);
            });
            
            vimeoPlayer.on('bufferstart', () => {
              setIsLoading(true);
            });
            
            vimeoPlayer.on('bufferend', () => {
              setIsLoading(false);
            });
            
            vimeoPlayer.on('loaded', () => {
              setVideoVisible(true);
              setIsPlayerReady(true);
              setIsLoading(false);
              
              // Try to start playback immediately
              vimeoPlayer.play().catch(() => {
                console.log("Auto-play prevented, waiting for user interaction");
              });
            });
            
            vimeoPlayer.on('ended', () => {
              setIsPlaying(false);
              vimeoPlayer.setCurrentTime(0.1).then(() => {
                vimeoPlayer.pause();
              });
            });
            
            // Pre-seek to 0.1 seconds to show the first frame
            vimeoPlayer.setCurrentTime(0.1).then(() => {
              setIsPlayerReady(true);
              setIsLoading(false);
              setVideoVisible(true);
            });
          }
        }
      } catch (e) {
        console.error("Error handling Vimeo message:", e);
      }
    };

    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage);
    
    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
      }
    };
  }, []);

  // Memoized play handler
  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!player) return;
    
    if (isPlaying) {
      player.pause();
    } else {
      player.setVolume(audioOnRef.current ? volume : 0);
      player.setMuted(!audioOnRef.current);
      
      player.play().catch((error: any) => {
        console.log("Failed to play video:", error);
        setIsLoading(false);
      });
    }
  }, [player, isPlaying, volume]);

  // Handle audio changes directly
  useEffect(() => {
    if (!player) return;
    
    player.setVolume(audioOn ? volume : 0);
    player.setMuted(!audioOn);
  }, [player, audioOn, volume]);

  // Optimize visibility handling based on view state
  useEffect(() => {
    if (!player) return;

    const viewStateChanged = wasInViewRef.current !== isInView;
    wasInViewRef.current = isInView;

    // Don't pause/play on every render, only when view state changes
    if (viewStateChanged) {
      if (!isInView && isPlaying) {
        player.pause();
      } else if (isInView && isPlayerReady && !isPlaying) {
        player.play().catch(() => {
          // Silent catch - some browsers prevent autoplay
        });
      }
    }
  }, [isInView, player, isPlaying, isPlayerReady]);

  // Handle volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (player && audioOn) {
      player.setVolume(newVolume);
    }
  }, [player, audioOn]);

  // Toggle audio needs to be directly connected to the button
  const handleToggleAudio = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (toggleAudio) {
      toggleAudio(e);
    }
  }, [toggleAudio]);

  // Toggle volume slider visibility
  const handleVolumeIconHover = useCallback(() => {
    setShowVolumeSlider(true);
  }, []);

  // Get volume icon based on current volume and mute state
  const getVolumeIcon = useCallback(() => {
    if (!audioOn) return <VolumeX size={20} className="text-white" />;
    
    if (volume >= 0.7) return <Volume2 size={20} className="text-white" />;
    if (volume >= 0.3) return <Volume1 size={20} className="text-white" />;
    return <Volume size={20} className="text-white" />;
  }, [volume, audioOn]);

  return (
    <div className={`relative ${className}`}>
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 rounded-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                {/* Outer ring */}
                <div className="w-20 h-20 rounded-full border-4 border-yellow/30 animate-pulse" />
                
                {/* Middle ring */}
                <div className="absolute inset-0 w-20 h-20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-4 border-yellow/50 animate-pulse animation-delay-200" />
                </div>
                
                {/* Inner spinner */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="w-8 h-8 text-yellow animate-spin" />
                </div>
              </div>
              
              <div className="text-white font-medium tracking-wide text-center">
                <p>LOADING VIDEO</p>
                <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: videoVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-in',
            zIndex: 5
          }}
        >
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
        </div>
        
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
      
      <div 
        ref={volumeControlRef}
        className="absolute bottom-3 right-3 z-30"
        onMouseEnter={handleVolumeIconHover}
      >
        {/* Volume Slider Container */}
        <div className={cn(
          "absolute bottom-10 right-1 bg-black/60 rounded-lg px-3 py-3 transition-all duration-300",
          showVolumeSlider && audioOn
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}>
          <Slider
            orientation="vertical"
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="mx-auto"
          />
        </div>
        
        {/* Volume Button */}
        <button 
          onClick={handleToggleAudio}
          className="bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all duration-300"
          aria-label={audioOn ? "Mute audio" : "Unmute audio"}
        >
          {getVolumeIcon()}
        </button>
      </div>
    </div>
  );
});

VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
