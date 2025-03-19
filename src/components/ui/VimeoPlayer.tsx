
import { useRef, useState, useEffect, memo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VimeoPlayerProps {
  videoId: string;
  playerId: string;
  className?: string;
  isInView: boolean;
  audioOn: boolean;
  toggleAudio: (e: React.MouseEvent) => void;
}

const VimeoPlayer = memo(({
  videoId,
  playerId,
  className = "",
  isInView,
  audioOn,
  toggleAudio
}: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);
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
          }
        }
      } catch (e) {
        // Silent error handling to avoid console spam
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [audioOn]);

  // Control video playback based on visibility
  useEffect(() => {
    if (!player) return;

    const viewStateChanged = wasInViewRef.current !== isInView;
    wasInViewRef.current = isInView;

    if (isInView) {
      // Update audio settings
      player.setVolume(audioOn ? 1 : 0);
      player.setMuted(!audioOn);
      
      if (viewStateChanged) {
        // Restart video when coming back into view
        player.setCurrentTime(0).then(() => {
          player.play().catch(() => {
            // Silent catch for autoplay issues
          });
        });
      }
    } else if (viewStateChanged) {
      // Pause when moving out of view
      player.pause();
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
});

// Display name for React DevTools
VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
