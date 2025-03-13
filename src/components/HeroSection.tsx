
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft, ArrowRight as Next, X, Play } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInView(heroRef, {}, false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Auto-play first video on desktop (muted)
  useEffect(() => {
    if (videoRef.current && !isMobile) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        console.log('Auto-play was prevented:', error);
      });
    }
  }, [isMobile, activeVideoIndex]);

  // Video data
  const videos = [
    {
      id: 1,
      title: "Fitness Demo",
      src: "anastazija-front-web.mp4",
    }, 
    {
      id: 2,
      title: "Workout Routine",
      src: "1022.mp4",
    }
  ];

  const handleNextVideo = () => {
    setActiveVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setActiveVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const openVideoModal = () => {
    setVideoPlaying(true);
  };

  return (
    <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      {/* Content Container */}
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 
              ref={headlineRef} 
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", 
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              The Ultimate Minimalist Fitness Solution
            </h1>
            
            <p 
              ref={subheadlineRef} 
              className={cn(
                "mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", 
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              Train Smarter. Live Better. Elevate Your Lifestyle.
            </p>
            
            <div 
              ref={ctaRef} 
              className={cn(
                "mt-10 transition-all duration-1000 delay-500", 
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <a 
                href="#order" 
                className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
              >
                GET THE COMPLETE BUNDLE NOW
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <p className="mt-4 text-sm text-gray-600">
                Launching Spring 2025
              </p>
            </div>
          </div>
          
          {/* Right Column - Video Carousel */}
          <div 
            className={cn(
              "order-1 md:order-2 transition-all duration-1000 delay-300 w-full", 
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video">
              {/* Video Player */}
              <div 
                className="relative cursor-pointer w-full h-full" 
                onClick={openVideoModal}
              >
                <video
                  ref={videoRef}
                  src={videos[activeVideoIndex].src}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  preload="metadata"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity hover:bg-black/30">
                  <div className="bg-white/80 rounded-full p-3 transition-transform hover:scale-110">
                    <Play size={32} className="text-black" />
                  </div>
                </div>
                
                <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center">
                  {videos[activeVideoIndex].title}
                </p>
              </div>
              
              {/* Carousel Navigation Controls */}
              <div className="absolute inset-x-0 top-1/2 flex justify-between items-center transform -translate-y-1/2 px-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevVideo();
                  }} 
                  className="bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition-all"
                >
                  <ArrowLeft size={20} className="text-black" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextVideo();
                  }} 
                  className="bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition-all"
                >
                  <Next size={20} className="text-black" />
                </button>
              </div>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideoIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeVideoIndex === index ? 'bg-yellow w-4' : 'bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      <Dialog open={videoPlaying} onOpenChange={open => !open && setVideoPlaying(false)}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 bg-black border-none">
          <DialogClose className="absolute right-3 top-3 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-all">
            <X size={24} />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="w-full h-full">
            <video
              src={videos[activeVideoIndex].src}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center">
          <div className="w-1.5 h-3 bg-black/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
