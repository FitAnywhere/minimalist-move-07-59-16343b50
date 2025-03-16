import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Flame, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
const ChampionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [animationState, setAnimationState] = useState({
    line1: false,
    line2: false,
    line3: false,
    coreText: false
  });

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      // Staggered animation for lines
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        line1: true
      })), 300);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        line2: true
      })), 800);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        line3: true
      })), 1300);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        coreText: true
      })), 1800);
    }
  }, [isInView]);

  // Button flicker effect
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

  // Improved video handling with proper error handling
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

      // Add event listeners
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      // Try to play the video when in view
      if (isInView && !videoError) {
        // Use a timeout to give browser a moment to process
        const playTimeout = setTimeout(() => {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Video play error:", error);
              // Only set error if it's not a user interaction error
              if (error.name !== 'NotAllowedError') {
                setVideoError(true);
              }
            });
          }
        }, 300);
        return () => clearTimeout(playTimeout);
      }

      // Cleanup
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isInView, videoError]);

  // Toggle mute state
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  };
  return <section id="champion" ref={sectionRef} className="">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className={cn("text-black font-bold transition-all duration-500 transform", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10", "group hover:text-shadow-yellow")}>
                  👊 UNLEASH YOUR INNER CHAMPION
                </h2>
                
                <p className={cn("text-2xl text-gray-800 font-medium transition-all duration-500 delay-200 transform", isInView ? "animate-bounce opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  The Most Addictive Workout You Didn't Know You Needed
                </p>
              </div>
              
              {/* Power Lines with Staggered Animation */}
              <div className="space-y-5">
                <div className={cn("flex items-center gap-2 transition-all duration-500 transform", animationState.line1 ? "opacity-100 translate-x-0 animate-[shake_0.5s_ease-in-out]" : "opacity-0 -translate-x-4")}>
                  <p className="text-xl font-semibold">💥 Swing. Strike. Repeat.</p>
                </div>
                
                <div className={cn("flex items-center gap-2 transition-all duration-500 transform group", animationState.line2 ? "opacity-100 translate-x-0 animate-[shake_0.5s_ease-in-out]" : "opacity-0 -translate-x-4")}>
                  <p className="text-xl font-semibold relative">
                    🔥 Feel the rhythm. Get in the zone. Own your power.
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-100/0 to-yellow-100/0 group-hover:from-yellow-400/20 group-hover:to-yellow-100/0 transition-all duration-500 -z-10 rounded"></span>
                  </p>
                </div>
                
                <div className={cn("flex items-center gap-2 transition-all duration-500 transform", animationState.line3 ? "opacity-100 translate-x-0 animate-[shake_0.5s_ease-in-out]" : "opacity-0 -translate-x-4")}>
                  <p className="text-xl font-semibold">⚡ No setup. Just action.</p>
                </div>
              </div>
              
              {/* Core Text */}
              <p className={cn("text-lg text-gray-700 italic font-medium transition-all duration-700 transform", animationState.coreText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>This isn't just training. It's FUN.</p>
              
              {/* CTA Button */}
              <div className={cn("transition-all duration-700 delay-500 transform", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                <Button id="cta-button" className="bg-yellow hover:bg-yellow-dark text-black font-bold py-3 px-8 rounded-full text-lg 
                  transition-all duration-300 transform hover:scale-105 hover:animate-[shake_0.3s_ease-in-out] 
                  shadow-lg hover:shadow-xl active:scale-95">
                  <Flame className="mr-2 h-5 w-5" /> TRY IT NOW
                </Button>
              </div>
            </div>
            
            {/* Video Side with Sound Toggle */}
            <div className={cn("relative perspective transition-all duration-700 transform", isInView ? "opacity-100 scale-100 animate-[shake_0.3s_ease-in-out]" : "opacity-0 scale-95")}>
              <div className={cn("relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500", "hover:shadow-2xl hover:scale-[1.02] group")}>
                {/* Video with better compatibility */}
                <video ref={videoRef} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" playsInline muted={isMuted} autoPlay loop preload="auto" poster="/lovable-uploads/e524ebde-bbdd-4668-bfd4-595182310d6b.png">
                  <source src="/0314 (3)(1).mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Sound toggle button */}
                <div className="absolute bottom-3 right-3 z-10">
                  <Toggle aria-label={isMuted ? "Unmute video" : "Mute video"} className="bg-black/60 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center" pressed={!isMuted} onPressedChange={toggleMute}>
                    {isMuted ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Toggle>
                </div>
                
                {/* Pulse Border */}
                <div className={cn("absolute inset-0 border-2 border-yellow rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ChampionSection;