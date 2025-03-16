import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  video: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Alex G.",
    role: "Busy Professional",
    quote: "I can't believe how much time it saves me!",
    video: "/trx.mp4"
  },
  {
    name: "Emily T.",
    role: "Fitness Beginner",
    quote: "As a beginner, I love TRX and bands addition!",
    video: "/bands.mp4"
  },
  {
    name: "John D.",
    role: "Fitness Enthusiast",
    quote: "Finally, got an efficient training solution!",
    video: "/trx.mp4"
  },
  {
    name: "Chris L.",
    role: "Fitness Advocate",
    quote: "Ordered with friends and got an extra discount. Thank you!",
    video: "/bands.mp4"
  },
  {
    name: "Sarah M.",
    role: "Remote Worker",
    quote: "I work from home, and this is exactly what I needed!",
    video: "/trx.mp4"
  },
  {
    name: "Jordan P.",
    role: "Calisthenics Enthusiast",
    quote: "BoxFun with PowerTower combo is just priceless!",
    video: "/bands.mp4"
  }
];

const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {}, false);
  
  const currentTestimonial = testimonials[activeIndex];

  const nextTestimonial = () => {
    setActiveIndex(prevIndex => prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1);
  };
  
  const prevTestimonial = () => {
    setActiveIndex(prevIndex => prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1);
  };
  
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };
  
  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    setIsAutoPlaying(!isPaused);
  };
  
  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      autoPlayRef.current = setInterval(nextTestimonial, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isPaused]);
  
  useEffect(() => {
    if (!isInView && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    } else if (isInView && isAutoPlaying && !isPaused && !autoPlayRef.current) {
      autoPlayRef.current = setInterval(nextTestimonial, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isInView, isAutoPlaying, isPaused]);

  return (
    <section id="reviews" ref={sectionRef} className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div 
            className={cn(
              "text-center mb-12 transition-all duration-700", 
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE IT?
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform scale-x-100"></span>
            </h2>
          </div>
          
          <div className="relative">
            <div 
              className={cn(
                "flex flex-col md:grid md:grid-cols-2 gap-8 items-center transition-all duration-500",
                isInView ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            >
              <div className="order-2 md:order-1 text-left flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-3 text-black transition-all duration-300">
                  {currentTestimonial.name}
                  <span className="text-gray-700 font-semibold ml-2">
                    – {currentTestimonial.role}
                  </span>
                </h3>
                
                <div className="bg-gray-100 p-6 rounded-xl shadow-md relative mb-8 transition-all duration-300 hover:shadow-lg border-2 border-yellow-400">
                  <div className="absolute top-0 left-6 w-4 h-4 bg-gray-100 transform rotate-45 -mt-2 border-t-2 border-l-2 border-yellow-400"></div>
                  
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 transition-all duration-500">
                    "{currentTestimonial.quote}"
                  </p>
                </div>
                
                <div className="flex space-x-3 mt-4 justify-center md:justify-start">
                  {testimonials.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => goToTestimonial(index)}
                      className={cn(
                        "transition-all duration-300", 
                        index === activeIndex 
                          ? "w-4 h-4 bg-yellow-400 rounded-full" 
                          : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="order-1 md:order-2 relative transition-all duration-500">
                <div className="w-full max-w-[90%] mx-auto md:mx-0 rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
                  <video 
                    ref={videoRef}
                    src={currentTestimonial.video}
                    className="w-full h-full object-cover min-h-[250px] transition-transform duration-500 cursor-pointer"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    onClick={toggleFullScreen}
                  />
                  
                  <button 
                    onClick={togglePlayPause}
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label={isPaused ? "Play video" : "Pause video"}
                  >
                    {isPaused ? 
                      <Play className="w-5 h-5 text-white" /> : 
                      <Pause className="w-5 h-5 text-white" />
                    }
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={prevTestimonial} 
              className="absolute top-1/2 -left-4 md:-left-10 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border border-yellow-400" 
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            
            <button 
              onClick={nextTestimonial} 
              className="absolute top-1/2 -right-4 md:-right-10 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border border-yellow-400" 
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
