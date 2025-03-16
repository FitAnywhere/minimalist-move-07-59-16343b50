
import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  name: string;
  quote: string;
  author: string;
  role: string;
  video: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Finally, got an efficient training solution",
    quote: "Working from home means I need equipment that doesn't take up space. PowerTower fits perfectly in my apartment and gives me the workout I need without leaving home.",
    author: "Jasper",
    role: "Design Director",
    video: "/trx.mp4"
  }, 
  {
    name: "Ordered with friends and got extra discount. Thank you!",
    quote: "I work from home and this is exactly what I needed",
    author: "Eva",
    role: "Architect",
    video: "/bands.mp4"
  }, 
  {
    name: "I can't believe how much time it saves me",
    quote: "As a beginner I love TRX and bands addition",
    author: "Lucas",
    role: "Marketing Executive",
    video: "/trx.mp4"
  },
  {
    name: "I work from home and this is exactly what I needed",
    quote: "BoxFun with PowerTower combo is just priceless",
    author: "Sophia",
    role: "Remote Developer",
    video: "/bands.mp4"
  }
];

const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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
    // Pause auto-play when user navigates manually
    setIsAutoPlaying(false);
    // Resume after 5 seconds
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
  
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextTestimonial, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);
  
  useEffect(() => {
    // Pause auto-play when out of view
    if (!isInView && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    } else if (isInView && isAutoPlaying && !autoPlayRef.current) {
      autoPlayRef.current = setInterval(nextTestimonial, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isInView, isAutoPlaying]);

  return (
    <section id="reviews" ref={sectionRef} className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-8 transition-all duration-700", 
            isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl font-extrabold text-black">WHY THEY LOVE IT?</h2>
          </div>
          
          <div className="relative">
            <div className={cn("flex flex-col md:grid md:grid-cols-2 gap-8 items-center", 
              isInView ? "opacity-100" : "opacity-0 translate-y-4")}>
              {/* Review Text Side */}
              <div className="order-2 md:order-1 text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentTestimonial.name}
                </h3>
                
                <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                  <p className="text-xl md:text-2xl font-bold text-gray-900 transition-all duration-500">
                    "{currentTestimonial.quote}"
                  </p>
                  <p className="mt-4 text-right text-gray-700 italic">
                    — {currentTestimonial.author}, {currentTestimonial.role}
                  </p>
                </div>
                
                {/* Dot Indicators */}
                <div className="flex space-x-3 mt-6 justify-center md:justify-start">
                  {testimonials.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => goToTestimonial(index)}
                      className={cn(
                        "transition-all duration-300", 
                        index === activeIndex 
                          ? "w-3 h-3 bg-yellow rounded-full" 
                          : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Video Side */}
              <div className="order-1 md:order-2 relative transition-all duration-500">
                <div className="w-full mx-auto md:mx-0 rounded-xl overflow-hidden shadow-lg">
                  <video 
                    ref={videoRef}
                    src={currentTestimonial.video}
                    className="w-full h-full object-contain transition-transform duration-500 cursor-pointer"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    onClick={toggleFullScreen}
                  />
                </div>
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevTestimonial} 
              className="absolute top-1/2 left-0 md:left-4 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-300 transition-all hover:scale-110 z-10 focus:outline-none" 
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={nextTestimonial} 
              className="absolute top-1/2 right-0 md:right-4 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-300 transition-all hover:scale-110 z-10 focus:outline-none" 
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
