
import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, User, Quote, Star } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  video: string;
  isYouTube?: boolean;
  aspectRatio?: number;
}

const testimonials: Testimonial[] = [{
  name: "Alex G.",
  role: "Busy Professional",
  quote: "I can't believe how much time it saves me!",
  video: "/ALEX GG.mp4"
}, {
  name: "Emily T.",
  role: "Fitness Beginner",
  quote: "I never imagined how many exercises I can do using TRX and BANDS.",
  video: "/EMILY TT.mp4"
}, {
  name: "John D.",
  role: "Fitness Enthusiast",
  quote: "Finally, got an efficient training solution!",
  video: "/JOHN DD.mp4"
}, {
  name: "Chris L.",
  role: "Fitness Advocate",
  quote: "Ordered multiple for our studio and got an extra discount. Thank you!",
  video: "/CHRIS LLL.mp4"
}, {
  name: "Sarah M.",
  role: "Remote Worker",
  quote: "I work from home, and this is exactly what I needed!",
  video: "/SARAH LL.mp4"
}, {
  name: "Jordan P.",
  role: "Calisthenics Enthusiast",
  quote: "Never had so much fun training!",
  video: "https://youtube.com/shorts/FgF3Cyhw1Do",
  isYouTube: true,
  aspectRatio: 9/16
}];

const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {}, false);
  const currentTestimonial = testimonials[activeIndex];
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const isMobile = useIsMobile();

  const nextTestimonial = () => {
    setActiveIndex(prevIndex => prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1);
  };
  
  const prevTestimonial = () => {
    setActiveIndex(prevIndex => prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1);
  };
  
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };
  
  const toggleFullScreen = () => {
    if (videoRef.current && !currentTestimonial.isYouTube) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    setIsVideoLoaded(false);
    setVideoError(false);
  }, [activeIndex]);

  useEffect(() => {
    if (!currentTestimonial.isYouTube && videoRef.current) {
      const video = videoRef.current;
      
      video.src = '';
      video.load();
      
      video.src = currentTestimonial.video;
      
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        setVideoError(false);
        console.log("Testimonial video can play now:", currentTestimonial.video);
      };
      
      const handleError = (e: Event) => {
        console.error("Testimonial video error:", e, "for video:", currentTestimonial.video);
        setVideoError(true);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      if (isInView) {
        const playAttempt = setTimeout(() => {
          if (video.readyState >= 2) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Testimonial video play error:", error);
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
  }, [isInView, activeIndex, currentTestimonial.video, currentTestimonial.isYouTube]);
  
  return <section id="reviews" ref={sectionRef} className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 bg-inherit">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE IT?
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform scale-x-100"></span>
            </h2>
          </div>
          
          <div className="relative">
            <div className={cn("flex flex-col md:grid md:grid-cols-2 gap-8 items-center transition-all duration-500", isInView ? "opacity-100" : "opacity-0 translate-y-4")}>
              <div className="order-2 md:order-1 text-left flex flex-col justify-center">
                <div className="backdrop-blur-md bg-white/80 shadow-md p-7 rounded-xl relative mb-6 transition-all duration-300 hover:shadow-lg border-t-2 border-gray-800 slide-in-right group hover:shadow-gray-800/20" 
                  style={{ borderColor: '#444444' }}>
                  <div className="text-gray-500 opacity-50 absolute left-4 top-4 pt-1" style={{ color: '#666666' }}>
                    <Quote className="h-8 w-8" />
                  </div>
                  
                  <div className="flex mb-3 mt-6 animate-fade-in">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 mr-1" fill="#FFD700" />
                    ))}
                  </div>
                  
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 transition-all duration-500 pt-3 pl-2">
                    {currentTestimonial.quote}
                  </p>
                  
                  <div className="flex items-center mt-4 animate-fade-in">
                    <div>
                      <p className="font-semibold text-gray-800">{currentTestimonial.name}</p>
                      <p className="text-sm text-gray-500">{currentTestimonial.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4 justify-center md:justify-start">
                  {testimonials.map((_, index) => <button key={index} onClick={() => goToTestimonial(index)} className={cn("transition-all duration-300", index === activeIndex ? "w-4 h-4 bg-gray-800 rounded-full" : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400")} aria-label={`Go to testimonial ${index + 1}`} style={{ backgroundColor: index === activeIndex ? '#444444' : '' }} />)}
                </div>
              </div>
              
              <div className="order-1 md:order-2 relative transition-all duration-500">
                <div className="w-full md:max-w-[60%] mx-auto md:mx-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  {currentTestimonial.isYouTube ? (
                    <div className="relative overflow-hidden rounded-xl">
                      <AspectRatio ratio={currentTestimonial.aspectRatio || 9/16} className="overflow-hidden">
                        <div className="relative w-full h-full overflow-hidden" style={{ transform: isMobile ? 'scale(1)' : 'scale(1.12)' }}>
                          <iframe 
                            className="w-full h-full absolute inset-0 pointer-events-none select-none"
                            src={`${currentTestimonial.video.replace('youtube.com/shorts/', 'youtube.com/embed/').split('?')[0]}?autoplay=1&mute=1&loop=1&playlist=${currentTestimonial.video.split('/').pop()}&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0&origin=${window.location.origin}&widget_referrer=${window.location.origin}&hl=en&color=white&start=0&annotation=0&autohide=1&version=3&widgetid=1`}
                            title={`Testimonial from ${currentTestimonial.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            frameBorder="0"
                            loading="lazy"
                            style={{
                              pointerEvents: 'none',
                              userSelect: 'none',
                              marginTop: isMobile ? '0' : '-60px',
                              marginBottom: isMobile ? '0' : '-60px',
                              height: isMobile ? '100%' : 'calc(100% + 120px)',
                            }}
                          ></iframe>
                        </div>
                        <div 
                          className="absolute inset-0 w-full h-full z-10 bg-transparent cursor-default" 
                          aria-hidden="true"
                          onClick={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                          onMouseDown={(e) => e.preventDefault()}
                          onTouchStart={(e) => e.preventDefault()}
                          style={{
                            pointerEvents: 'auto'
                          }}
                        ></div>
                      </AspectRatio>
                    </div>
                  ) : videoError ? (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Video unavailable</p>
                    </div>
                  ) : (
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover min-h-[250px] transition-transform duration-500 cursor-pointer" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="auto"
                      onClick={toggleFullScreen} 
                    />
                  )}
                </div>
              </div>
            </div>
            
            <button onClick={prevTestimonial} className="absolute top-1/2 -left-4 md:-left-10 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border border-gray-800" aria-label="Previous testimonial" style={{ borderColor: '#444444' }}>
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            
            <button onClick={nextTestimonial} className="absolute top-1/2 -right-4 md:-right-10 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border border-gray-800" aria-label="Next testimonial" style={{ borderColor: '#444444' }}>
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </section>;
};

export default TestimonialsCarousel;
