
import { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Volume, Play, Loader } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [volumeLevel, setVolumeLevel] = useState<number>(audioOn ? 100 : 0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const wasInViewRef = useRef(isInView);
  const messageHandlerRef = useRef<(event: MessageEvent) => void>();
  const audioOnRef = useRef(audioOn);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  
  // Update ref when prop changes
  useEffect(() => {
    audioOnRef.current = audioOn;
  }, [audioOn]);
  
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

  // Handle click outside volume control
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
            
            vimeoPlayer.setVolume(audioOnRef.current ? 1 : 0);
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
      player.setVolume(audioOnRef.current ? volumeLevel / 100 : 0);
      player.setMuted(!audioOnRef.current);
      
      player.play().catch((error: any) => {
        console.log("Failed to play video:", error);
        setIsLoading(false);
      });
    }
  }, [player, isPlaying, volumeLevel]);

  // Handle volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    if (!player) return;
    
    const newVolume = value[0];
    setVolumeLevel(newVolume);
    
    if (newVolume === 0) {
      if (audioOn) toggleAudio(new MouseEvent('click') as unknown as React.MouseEvent);
    } else if (!audioOn) {
      toggleAudio(new MouseEvent('click') as unknown as React.MouseEvent);
    }
    
    player.setVolume(newVolume / 100);
  }, [player, audioOn, toggleAudio]);

  // Handle audio changes directly
  useEffect(() => {
    if (!player) return;
    
    if (audioOn) {
      setVolumeLevel(volumeLevel === 0 ? 75 : volumeLevel);
      player.setVolume(volumeLevel / 100);
      player.setMuted(false);
    } else {
      player.setVolume(0);
      player.setMuted(true);
    }
  }, [player, audioOn, volumeLevel]);

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

  // Toggle audio needs to be directly connected to the button
  const handleToggleAudio = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (toggleAudio) {
      toggleAudio(e);
    }
  }, [toggleAudio]);

  // Toggle volume slider
  const handleVolumeIconClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowVolumeSlider((prev) => !prev);
  }, []);

  // Render the appropriate volume icon based on the volume level
  const renderVolumeIcon = useCallback(() => {
    if (!audioOn) return <VolumeX size={20} className="text-white" />;
    
    if (volumeLevel >= 70) {
      return <Volume2 size={20} className="text-white" />;
    } else if (volumeLevel >= 30) {
      return <Volume1 size={20} className="text-white" />;
    } else {
      return <Volume size={20} className="text-white" />;
    }
  }, [audioOn, volumeLevel]);

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
      
      {/* Volume control with slider */}
      <div className="absolute bottom-3 right-3 z-30" ref={volumeControlRef}>
        <Popover open={showVolumeSlider} onOpenChange={setShowVolumeSlider}>
          <PopoverTrigger asChild>
            <button 
              onClick={handleVolumeIconClick}
              className="bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all duration-300"
              aria-label={audioOn ? "Adjust volume" : "Unmute audio"}
            >
              {renderVolumeIcon()}
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-10 p-3 bg-black/80 border-none rounded-lg shadow-lg flex flex-col items-center"
            side="top"
            sideOffset={5}
          >
            <div className="h-24 flex flex-col items-center justify-center">
              <Slider
                defaultValue={[volumeLevel]}
                max={100}
                step={1}
                orientation="vertical"
                value={[volumeLevel]}
                onValueChange={handleVolumeChange}
                className="h-full data-[orientation=vertical]:h-24 data-[orientation=vertical]:w-2"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
