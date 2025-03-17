import { useRef, useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rocket, ChevronRight, ChevronDown } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface LifestyleFeature {
  title: string;
  description: string;
}

const lifestyleFeatures: LifestyleFeature[] = [{
  title: "FEEL UNSTOPPABLE",
  description: "Tap into boundless energy to train like never before."
}, {
  title: "GLOW WITH CONFIDENCE",
  description: "Walk with energy and unstoppable self-belief."
}, {
  title: "WORKOUT YOU'LL ACTUALLY LOVE",
  description: "It's addictive in the best way possible."
}];

const LifestyleSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const isInView = useInView(sectionRef, {
    threshold: 0.2
  });

  const handleFeatureClick = (index: number) => {
    setOpenFeatureIndex(openFeatureIndex === index ? null : index);
  };

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

  return <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {Array.from({
        length: 20
      }).map((_, i) => <div key={i} className="absolute rounded-full bg-yellow/10 blur-md parallax-bg" style={{
        width: `${Math.random() * 30 + 10}px`,
        height: `${Math.random() * 30 + 10}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 10 + 15}s linear infinite`,
        transform: `translateY(${Math.random() * 100}px)`,
        opacity: Math.random() * 0.5 + 0.1
      }} />)}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn("transition-all duration-1000 transform", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="space-y-6 w-full md:w-1/2 flex flex-col h-full justify-between">
                <div className="space-y-4 text-center md:text-left mb-6 flex-grow-0">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
                    BECOME WORKOUT ADDICT
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                  
                  <p className="text-gray-800 font-medium text-lg">
                    Once you feel that flow, you'll never go back
                  </p>
                </div>
                
                <div className="space-y-6 flex-grow">
                  <div 
                    className={cn(
                      "px-6 py-3 rounded-full cursor-pointer", 
                      "transition-all duration-300 ease-in-out", 
                      "shadow-md", 
                      "transform opacity-0",
                      openFeatureIndex === 0 ? "bg-gradient-to-r from-yellow-light to-yellow" : "bg-white",
                      isInView ? "animate-fade-in opacity-100" : ""
                    )} 
                    style={{
                      animationDelay: "300ms",
                      animationDuration: "0.4s"
                    }} 
                    onClick={() => handleFeatureClick(0)}
                    onMouseEnter={() => setHoverIndex(0)} 
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">
                        {lifestyleFeatures[0].title}
                      </h4>
                      
                      <div 
                        className={cn(
                          "transition-all duration-200", 
                          hoverIndex === 0 ? "transform translate-x-1" : ""
                        )}
                      >
                        {openFeatureIndex === 0 ? 
                          <ChevronDown className="w-5 h-5" /> : 
                          <ChevronRight className="w-5 h-5" />
                        }
                      </div>
                    </div>
                    
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        openFeatureIndex === 0 ? "max-h-20 mt-2 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <p className="text-gray-600">
                        {lifestyleFeatures[0].description}
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className={cn(
                      "px-6 py-3 rounded-full cursor-pointer", 
                      "transition-all duration-300 ease-in-out", 
                      "shadow-md", 
                      "transform opacity-0",
                      openFeatureIndex === 1 ? "bg-gradient-to-r from-yellow-light to-yellow" : "bg-white",
                      isInView ? "animate-fade-in opacity-100" : ""
                    )} 
                    style={{
                      animationDelay: "500ms",
                      animationDuration: "0.4s"
                    }} 
                    onClick={() => handleFeatureClick(1)}
                    onMouseEnter={() => setHoverIndex(1)} 
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">
                        {lifestyleFeatures[1].title}
                      </h4>
                      
                      <div 
                        className={cn(
                          "transition-all duration-200", 
                          hoverIndex === 1 ? "transform translate-x-1" : ""
                        )}
                      >
                        {openFeatureIndex === 1 ? 
                          <ChevronDown className="w-5 h-5" /> : 
                          <ChevronRight className="w-5 h-5" />
                        }
                      </div>
                    </div>
                    
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        openFeatureIndex === 1 ? "max-h-20 mt-2 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <p className="text-gray-600">
                        {lifestyleFeatures[1].description}
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className={cn(
                      "px-6 py-3 rounded-full cursor-pointer", 
                      "transition-all duration-300 ease-in-out", 
                      "shadow-md", 
                      "transform opacity-0",
                      openFeatureIndex === 2 ? "bg-gradient-to-r from-yellow-light to-yellow" : "bg-white",
                      isInView ? "animate-fade-in opacity-100" : ""
                    )} 
                    style={{
                      animationDelay: "700ms",
                      animationDuration: "0.4s"
                    }} 
                    onClick={() => handleFeatureClick(2)}
                    onMouseEnter={() => setHoverIndex(2)} 
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">
                        {lifestyleFeatures[2].title}
                      </h4>
                      
                      <div 
                        className={cn(
                          "transition-all duration-200", 
                          hoverIndex === 2 ? "transform translate-x-1" : ""
                        )}
                      >
                        {openFeatureIndex === 2 ? 
                          <ChevronDown className="w-5 h-5" /> : 
                          <ChevronRight className="w-5 h-5" />
                        }
                      </div>
                    </div>
                    
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        openFeatureIndex === 2 ? "max-h-20 mt-2 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <p className="text-gray-600">
                        {lifestyleFeatures[2].description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center mt-8 flex-grow-0">
                  <Button className={cn(
                    "bg-yellow hover:bg-yellow-dark text-black font-bold py-4 px-8 rounded-full text-lg", 
                    "transition-all duration-300 transform hover:scale-105", 
                    "shadow-md hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]", 
                    "w-auto max-w-fit text-center", 
                    "flex items-center justify-center space-x-2"
                  )}>
                    <span>GET BOXFUN NOW</span> <Rocket className="ml-1 h-5 w-5 animate-float" />
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Limited stock available
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end md:h-full">
                <div className="w-full max-w-xs md:max-w-[90%] md:h-full perspective transition-transform duration-300">
                  <div className="relative transition-all duration-300 hover:scale-105 hover:shadow-xl group h-full">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl h-full">
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
          </div>
        </div>
      </div>
    </section>;
};

export default LifestyleSection;
