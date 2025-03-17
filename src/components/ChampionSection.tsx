import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';

const ChampionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (isInView && titleRef.current) {
      setTimeout(() => {
        titleRef.current?.classList.add('underline-animation');
      }, 300);
    }
  }, [isInView]);

  useEffect(() => {
    const flickerInterval = setInterval(() => {
      const button = document.getElementById('cta-button');
      if (button) {
        button.classList.add('opacity-90');
        setTimeout(() => {
          button.classList.remove('opacity-90');
        }, 200);
      }
    }, 5000);
    return () => clearInterval(flickerInterval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        setVideoError(false);
        console.log("Video can play now");
      };
      const handleError = (e: Event) => {
        console.error("Video error:", e);
        setVideoError(true);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      if (isInView && !videoError) {
        const playTimeout = setTimeout(() => {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Video play error:", error);
              if (error.name !== 'NotAllowedError') {
                setVideoError(true);
              }
            });
          }
        }, 300);
        return () => clearTimeout(playTimeout);
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isInView, videoError]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  };

  return (
    <section id="favorite-workout" ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-3 text-left">
                <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-black relative inline-block mb-2">
                  FAVORITE WORKOUT
                  <span className={cn("absolute bottom-0 left-0 w-16 h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
                
                <p className="text-lg text-gray-800 font-medium leading-relaxed mb-2">
                  One move in and you're locked in.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 pl-4">
                  <span className="text-xl mt-0.5">🔥</span>
                  <p className="text-base md:text-lg leading-loose">Mind sharpens, your body follows</p>
                </div>
                
                <div className="flex items-start gap-3 pl-4">
                  <span className="text-xl mt-0.5">⚡</span>
                  <p className="text-base md:text-lg leading-loose">Designed for your space</p>
                </div>
                
                <div className="flex items-start gap-3 pl-4">
                  <span className="text-xl mt-0.5">⏳</span>
                  <p className="text-base md:text-lg leading-loose">Minimal effort for maximum impact</p>
                </div>
              </div>
              
              <p className="text-sm md:text-base text-gray-600 italic font-medium leading-loose mb-8">
                Training that fits your lifestyle. Exactly how it should be.
              </p>
              
              <div>
                <Button 
                  id="cta-button" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-full text-lg 
                    transition-all duration-300 transform hover:scale-105 hover:animate-[shake_0.3s_ease-in-out] 
                    shadow-lg hover:shadow-xl active:scale-95"
                >
                  <Flame className="mr-2 h-5 w-5" /> TRY IT NOW
                </Button>
              </div>
            </div>
            
            <div className="relative perspective">
              <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                  playsInline 
                  muted={isMuted} 
                  autoPlay 
                  loop 
                  preload="auto" 
                  poster="/lovable-uploads/e524ebde-bbdd-4668-bfd4-595182310d6b.png"
                >
                  <source src="/0314 (3)(1).mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                <div className="absolute bottom-3 right-3 z-10">
                  <Toggle 
                    aria-label={isMuted ? "Unmute video" : "Mute video"} 
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center" 
                    pressed={!isMuted} 
                    onPressedChange={toggleMute}
                  >
                    {isMuted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    )}
                  </Toggle>
                </div>
                
                <div className="absolute inset-0 border-2 border-yellow rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChampionSection;
