
import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  vimeoId: string;
  hash: string;
}

const testimonials: Testimonial[] = [{
  name: "Alex G.",
  role: "Busy Professional",
  quote: "I can't believe how much time it saves me!",
  vimeoId: "1067256239",
  hash: "d5e32d0eef"
}, {
  name: "Emily T.",
  role: "Fitness Beginner",
  quote: "I never imagined how many exercises I can do using TRX and BANDS.",
  vimeoId: "1067256372",
  hash: "70ab6c252c"
}, {
  name: "John D.",
  role: "Fitness Enthusiast",
  quote: "Finally, got an efficient training solution!",
  vimeoId: "1067256399",
  hash: "317d8d1581"
}, {
  name: "Chris L.",
  role: "Fitness Advocate",
  quote: "Ordered multiple for our studio and got an extra discount. Thank you!",
  vimeoId: "1067256325",
  hash: "d9d4133cc1"
}, {
  name: "Sarah M.",
  role: "Remote Worker",
  quote: "I work from home, and this is exactly what I needed!",
  vimeoId: "1067256419",
  hash: "9896ed5d93"
}, {
  name: "Jordan P.",
  role: "Calisthenics Enthusiast",
  quote: "Never had so much fun training!",
  vimeoId: "1067259441",
  hash: "6ed11d11d8"
}];

const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {}, false);
  const currentTestimonial = testimonials[activeIndex];
  const isMobile = useIsMobile();
  const [videosLoaded, setVideosLoaded] = useState<{[key: string]: boolean}>({});

  const nextTestimonial = () => {
    setActiveIndex(prevIndex => prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1);
  };
  
  const prevTestimonial = () => {
    setActiveIndex(prevIndex => prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1);
  };
  
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };

  // Handle video load state
  const handleVideoLoaded = (vimeoId: string) => {
    setVideosLoaded(prev => ({
      ...prev,
      [vimeoId]: true
    }));
  };

  // Load Vimeo script once
  useEffect(() => {
    if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);
  
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
                <div className="w-full mx-auto md:w-4/5 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-xl">
                    <div style={{padding:'177.78% 0 0 0', position:'relative'}} className="bg-gray-100">
                      <iframe 
                        key={currentTestimonial.vimeoId}
                        src={`https://player.vimeo.com/video/${currentTestimonial.vimeoId}?h=${currentTestimonial.hash}&autoplay=1&background=1&loop=1&muted=1&title=0&byline=0&portrait=0`}
                        frameBorder="0" 
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
                        style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}}
                        title={`Testimonial from ${currentTestimonial.name}`}
                        onLoad={() => handleVideoLoaded(currentTestimonial.vimeoId)}
                        loading="lazy"
                      ></iframe>
                      {!videosLoaded[currentTestimonial.vimeoId] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
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
