import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}
const testimonials: Testimonial[] = [{
  quote: "PowerTower and BoxFun transformed my routine. No more gym subscriptions or bulky equipment – just a sleek, effective setup that delivers professional results.",
  author: "Jasper",
  role: "Design Director",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
}, {
  quote: "Finally, fitness equipment that meets my aesthetic standards. The minimalist design complements my apartment perfectly, and the workouts are incredible.",
  author: "Eva",
  role: "Architect",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
}, {
  quote: "Resistance bands complete my PowerTower experience. The versatility is unmatched – I can get a complete workout from the comfort of my loft.",
  author: "Lucas",
  role: "Marketing Executive",
  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
}];
const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {}, false);
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
  return <section id="testimonials" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-16 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-black">WHY THEY LOVE IT</h2>
            
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{
              transform: `translateX(-${activeIndex * 100}%)`
            }}>
                {testimonials.map((testimonial, index) => <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-yellow">
                            <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-yellow mb-2">
                            {[...Array(5)].map((_, i) => <span key={i} className="text-xl">★</span>)}
                          </div>
                          
                          <blockquote className="text-xl md:text-2xl font-medium mb-4">
                            "{testimonial.quote}"
                          </blockquote>
                          
                          <div>
                            <div className="font-bold">{testimonial.author}</div>
                            <div className="text-gray-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button onClick={prevTestimonial} className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-10 focus:outline-none" aria-label="Previous testimonial">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button onClick={nextTestimonial} className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-10 focus:outline-none" aria-label="Next testimonial">
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Indicators */}
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => <button key={index} onClick={() => goToTestimonial(index)} className={cn("w-2.5 h-2.5 rounded-full mx-1 transition-all duration-300", index === activeIndex ? "bg-yellow w-8" : "bg-gray-300 hover:bg-gray-400")} aria-label={`Go to testimonial ${index + 1}`} />)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsCarousel;