
import { useRef, useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rocket, ChevronRight, ChevronDown, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

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
  const [showSpecs, setShowSpecs] = useState(false);
  const isMobile = useIsMobile();
  const [lastUnmutedState, setLastUnmutedState] = useState<boolean>(false);
  
  // Enhanced useInView with callbacks to handle video audio when scrolling
  const isInView = useInView(
    sectionRef, 
    { threshold: 0.2 },
    false,
    () => {
      // When entering view
      if (videoRef.current && !videoError) {
        // If user previously unmuted, restore that state
        if (lastUnmutedState) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
      }
    },
    () => {
      // When exiting view
      if (videoRef.current && !videoRef.current.muted) {
        // Save unmuted state and then mute
        setLastUnmutedState(true);
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  );

  const handleFeatureClick = (index: number) => {
    setOpenFeatureIndex(openFeatureIndex === index ? null : index);
  };

  const handleStripeCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/5kA5mKaObcTP0WQ9AH', '_blank');
  };

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      video.src = '';
      video.load();
      
      video.src = '/0314 (3)(1).mp4';
      
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
        const playAttempt = setTimeout(() => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Video play error:", error);
                if (error.name !== 'NotAllowedError') {
                  setVideoError(true);
                }
              });
            }
          }
        }, 100);
        
        return () => clearTimeout(playAttempt);
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.pause();
      };
    }
  }, [isInView, videoError]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
      if (!newMutedState) {
        setLastUnmutedState(true);
      }
    }
  };

  return <section ref={sectionRef} className="py-20 relative overflow-hidden">
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
                  <h2 id="become-workout-addict" className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
                    BECOME WORKOUT ADDICT
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                  
                  <p className="text-gray-800 font-medium text-lg">
                    Once you feel that flow, you'll never go back
                  </p>
                </div>
                
                {isMobile && (
                  <div className="w-full flex flex-col items-center my-6">
                    <div className="w-full max-w-xs perspective transition-transform duration-300 relative">
                      <div className="relative transition-all duration-300 hover:scale-105 hover:shadow-xl group h-full">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl h-full">
                          {videoError ? (
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                              <p className="text-gray-500">Video unavailable</p>
                            </div>
                          ) : (
                            <video 
                              ref={videoRef} 
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                              playsInline 
                              muted={isMuted} 
                              autoPlay 
                              loop 
                              preload="auto"
                            >
                              <source src="/0314 (3)(1).mp4" type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          
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
                    
                    <div className={cn(
                      "mt-6 w-full flex justify-center transition-all duration-700 transform", 
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    )}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="uppercase font-bold border-yellow border-2 bg-transparent text-black hover:bg-yellow-light/20 transition-all text-xs py-1"
                        onClick={() => setShowSpecs(true)}
                      >
                        Specifications
                      </Button>
                    </div>
                  </div>
                )}
                
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
                  <Button 
                    onClick={handleStripeCheckout}
                    className={cn(
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
              
              {!isMobile && (
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-end md:h-full">
                  <div className="w-full max-w-xs md:max-w-[72%] md:h-full perspective transition-transform duration-300 relative">
                    <div className="relative transition-all duration-300 hover:scale-105 hover:shadow-xl group h-full">
                      <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl h-full">
                        {videoError ? (
                          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">Video unavailable</p>
                          </div>
                        ) : (
                          <video 
                            ref={videoRef} 
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                            playsInline 
                            muted={isMuted} 
                            autoPlay 
                            loop 
                            preload="auto"
                          >
                            <source src="/0314 (3)(1).mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        
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
                  
                  <div className={cn(
                    "mt-6 w-full flex justify-center transition-all duration-700 transform", 
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="uppercase font-bold border-yellow border-2 bg-transparent text-black hover:bg-yellow-light/20 transition-all text-xs py-1"
                      onClick={() => setShowSpecs(true)}
                    >
                      Specifications
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSpecs} onOpenChange={setShowSpecs}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Product Specifications</DialogTitle>
          </DialogHeader>
          
          <DialogClose className="absolute right-4 top-4 rounded-full p-1.5 opacity-70 ring-offset-background transition-opacity hover:bg-gray-100 hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="space-y-6 text-left mt-2 px-2">
            <div>
              <h3 className="font-semibold text-lg">Components & Materials</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Cap: High-quality fabric, breathable design for comfort during workouts</li>
                <li>Elastic Band: Durable, and stretch-resistant for consistent rebound</li>
                <li>Training Ball: Lightweight, impact-resistant ball with a textured surface for better control</li>
                <li>Attachment System: Securely fastened to the cap for stability during use</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Dimensions & Weight</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Cap Size: One-size-fits-most with an adjustable strap</li>
                <li>Ball Diameter: Approx. 6–7 cm</li>
                <li>Elastic Band Length: Default length designed to match the average person's reach (from head to hand when extended)</li>
                <li>Custom Sizing Available: Customers can provide their measurements for a perfectly tailored elastic band length</li>
                <li>Total Weight: Ultra-lightweight for effortless portability</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Key Features</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Training: Improves reaction time, speed, and hand-eye coordination</li>
                <li>Portable & Lightweight: Can be used anywhere – gym, home, or outdoors</li>
                <li>Easy to Use: Suitable for beginners and professionals</li>
                <li>Breathable & Comfortable: Designed for extended training sessions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Ideal For</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Boxers, martial artists, and fitness enthusiasts looking to improve reflexes, coordination, and precision</li>
                <li>Cardio & Endurance Training: Helps increase heart rate and calorie burn through active movement</li>
                <li>Warm-Up & Activation: A great tool to get the body moving before workouts</li>
                <li>Mind-Body-Breath Connection: Improves focus, mental clarity, and rhythmic breathing control</li>
                <li>Cognitive & Stress Relief Exercises: Enhances concentration, mindfulness, and relaxation</li>
                <li>All Ages & Skill Levels: Suitable for beginners, advanced athletes, and even non-athletes looking for a fun challenge</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};

export default LifestyleSection;
