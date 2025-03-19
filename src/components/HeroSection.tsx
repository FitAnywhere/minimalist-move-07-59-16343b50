
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();
  const [vimeoPlayerReady, setVimeoPlayerReady] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [wasScrollMuted, setWasScrollMuted] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  
  const scrollToOwnBoth = (e: React.MouseEvent) => {
    e.preventDefault();
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === "ready") {
          console.log("Vimeo player is ready");
          setVimeoPlayerReady(true);
          
          if (window.Vimeo && window.Vimeo.Player && iframeRef.current) {
            const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
            setPlayer(vimeoPlayer);
            
            // Set audio on by default and ensure it's not muted
            vimeoPlayer.setVolume(1);
            vimeoPlayer.setMuted(false);
            
            // Start playing immediately
            vimeoPlayer.play().catch((error: any) => {
              console.log("Auto-play error:", error);
            });
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
  }, []);

  const toggleAudio = () => {
    if (player) {
      if (audioOn) {
        player.setVolume(0);
        player.setMuted(true);
      } else {
        player.setVolume(1);
        player.setMuted(false);
      }
      setAudioOn(!audioOn);
    }
  };

  const isInView = useInView(heroRef, {}, false);

  useEffect(() => {
    if (player) {
      if (isInView) {
        if (wasScrollMuted) {
          player.setCurrentTime(0).then(() => {
            player.play();
            if (audioOn) {
              player.setVolume(1);
              player.setMuted(false);
            }
          }).catch((error: any) => {
            console.log("Error setting current time:", error);
          });
          setWasScrollMuted(false);
        } else if (!document.hidden) {
          player.play().catch((error: any) => {
            console.log("Error playing video:", error);
          });
          
          // If it's the first load, ensure sound is on
          if (firstLoad) {
            player.setVolume(1);
            player.setMuted(false);
            setFirstLoad(false);
          }
        }
      } else {
        player.pause();
        if (!wasScrollMuted) {
          setWasScrollMuted(true);
        }
      }
    }
  }, [isInView, player, audioOn, wasScrollMuted, firstLoad]);

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

  return <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile && <div className="text-center order-1 w-full space-y-6">
              <h1 ref={headlineRef} className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <span className="relative inline-block">
                  ALL YOU NEED
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                </span>
              </h1>
              
              <div className={cn("w-full transition-all duration-1000 delay-300", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative rounded-xl overflow-hidden shadow-lg mx-[-1rem]">
                  <div style={{padding: '56.25% 0 0 0', position: 'relative', width: '100%'}}>
                    <iframe 
                      ref={iframeRef}
                      src="https://player.vimeo.com/video/1067255623?h=d77ee52644&title=0&byline=0&portrait=0&badge=0&autopause=0&background=1&loop=1&player_id=hero_video_mobile&app_id=58479&autoplay=1" 
                      style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} 
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
                      title="FitAnywhere"
                      loading="lazy"
                    ></iframe>
                  </div>
                  <button 
                    onClick={toggleAudio}
                    className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 p-1.5 rounded-full transition-all duration-300 z-30"
                    aria-label={audioOn ? "Mute audio" : "Unmute audio"}
                  >
                    {audioOn ? (
                      <Volume2 size={16} className="text-white" />
                    ) : (
                      <VolumeX size={16} className="text-white" />
                    )}
                  </button>
                </div>
              </div>
              
              <p ref={subheadlineRef} className={cn("text-xl text-gray-800 transition-all duration-1000 delay-400", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                Portable gym that adapts to your lifestyle
              </p>
              
              <div ref={ctaRef} className={cn("transition-all duration-1000 delay-600", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <button 
                  onClick={scrollToOwnBoth}
                  className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-6 py-3 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
                >
                  EXPLORE
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  Launching Spring 2025
                </p>
              </div>
            </div>}
          
          {!isMobile && <>
              <div className="text-center md:text-left order-2 md:order-1">
                <h1 ref={headlineRef} className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <span className="relative inline-block">
                    ALL YOU NEED
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                  </span>
                </h1>
                
                <p ref={subheadlineRef} className={cn("mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>Portable gym that adapts to your lifestyle</p>
                
                <div ref={ctaRef} className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <button 
                    onClick={scrollToOwnBoth}
                    className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
                  >
                    EXPLORE
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <p className="mt-4 text-sm text-gray-600">
                    Launching Spring 2025
                  </p>
                </div>
              </div>
              
              <div className={cn("order-1 md:order-2 transition-all duration-1000 delay-300 w-full", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center">
                  <div className="w-full max-w-[95%] mx-auto">
                    <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
                      <iframe 
                        ref={iframeRef}
                        src="https://player.vimeo.com/video/1067255623?h=d77ee52644&title=0&byline=0&portrait=0&badge=0&autopause=0&background=1&loop=1&player_id=hero_video_desktop&app_id=58479&autoplay=1" 
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
                </div>
              </div>
            </>}
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center">
          <div className="w-1.5 h-3 bg-black/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
};

export default HeroSection;
