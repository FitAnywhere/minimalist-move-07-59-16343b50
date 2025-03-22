
import { useRef, useState, useEffect, memo } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

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
  const wasInViewRef = useRef(isInView);

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
            
            // Set initial audio state
            vimeoPlayer.setVolume(audioOn ? 1 : 0);
            vimeoPlayer.setMuted(!audioOn);
            
            // Ensure video is initially paused but at 0.1 seconds for thumbnail
            vimeoPlayer.pause().then(() => {
              vimeoPlayer.setCurrentTime(0.1).then(() => {
                setIsPlayerReady(true);
                console.log("Vimeo player is ready");
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
  }, [audioOn]);

  // Handle play button click
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!player) return;
    
    if (isPlaying) {
      player.pause();
    } else {
      // Ensure audio is on when playing
      player.setVolume(audioOn ? 1 : 0);
      player.setMuted(!audioOn);
      
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

    // Update audio settings
    player.setVolume(audioOn ? 1 : 0);
    player.setMuted(!audioOn);
    
    // Pause when moving out of view
    if (!isInView && viewStateChanged && isPlaying) {
      player.pause();
    }
  }, [isInView, player, audioOn, isPlaying]);

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
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play size={28} className="text-black ml-1" />
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

// Display name for React DevTools
VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
