
import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VimeoPlayerProps {
  videoId: string;
  playerId: string;
  className?: string;
  onPlayerReady?: (player: any) => void;
  isInView: boolean;
  audioOn: boolean;
  toggleAudio: (e: React.MouseEvent) => void;
}

const VimeoPlayer = ({
  videoId,
  playerId,
  className = "",
  onPlayerReady,
  isInView,
  audioOn,
  toggleAudio
}: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);
  
  // Load Vimeo API
  useEffect(() => {
    if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      const script = document.createElement('script');
      script.src = "https://player.vimeo.com/api/player.js";
      script.async = true;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  // Initialize player and handle messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = typeof event.data === 'object' ? event.data : JSON.parse(event.data);
        
        if (data.event === "ready" && iframeRef.current) {
          console.log("Vimeo player is ready");
          
          if (window.Vimeo && window.Vimeo.Player) {
            const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
            setPlayer(vimeoPlayer);
            
            vimeoPlayer.setVolume(1);
            vimeoPlayer.setMuted(false);
            
            vimeoPlayer.play().catch((error: any) => {
              console.log("Auto-play error:", error);
            });
            
            if (onPlayerReady) {
              onPlayerReady(vimeoPlayer);
            }
          }
        }
      } catch (e) {
        console.error("Error parsing Vimeo message:", e);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onPlayerReady]);

  // Control video playback based on visibility
  useEffect(() => {
    if (!player) return;

    if (isInView) {
      // Set audio state
      if (audioOn) {
        player.setVolume(1);
        player.setMuted(false);
      } else {
        player.setVolume(0);
        player.setMuted(true);
      }

      // Always restart video when coming back into view
      player.setCurrentTime(0).then(() => {
        player.play().catch((error: any) => {
          console.log("Error playing video:", error);
        });
      }).catch((error: any) => {
        console.log("Error setting current time:", error);
      });
    } else {
      // Always pause when out of view
      player.pause().catch((error: any) => {
        console.log("Error pausing video:", error);
      });
    }
  }, [isInView, player, audioOn]);

  return (
    <div className={`relative ${className}`}>
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        <iframe 
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${videoId}?h=d77ee52644&title=0&byline=0&portrait=0&badge=0&autopause=0&background=1&loop=1&player_id=${playerId}&app_id=58479&autoplay=1`}
          style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}} 
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
          title="FitAnywhere"
          loading="lazy"
        ></iframe>
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
};

export default VimeoPlayer;
