
import { useState, useRef, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    role: "Remote Worker",
    quote: "Used to blame Zoom for no workouts. Now I sneak in 15 min wins.",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744322325/fitanywhere-testimonial1_pdv5gi.jpg"
  }, {
    name: "Alex J.",
    role: "Busy Parent",
    quote: "Finally found an exercise routine that fits into my chaotic schedule.",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744322325/fitanywhere-testimonial2_cqgrma.jpg"
  }, {
    name: "Michael T.",
    role: "Office Professional",
    quote: "No more excuses about lack of equipment or gym access.",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744322325/fitanywhere-testimonial3_mku3et.jpg"
  }
];

const TestimonialImage = memo(({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="relative w-full" style={{ paddingBottom: '150%' }}>
      <img 
        src={imageUrl}
        alt="Testimonial" 
        className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
        loading="lazy"
      />
    </div>
  );
});
TestimonialImage.displayName = 'TestimonialImage';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-black rounded-xl">
      <TestimonialImage imageUrl={testimonial.imageUrl} />
      
      <div className="bg-white p-3 shadow-md rounded-b-xl border border-gray-100">
        <div className="flex mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 text-yellow-400 mr-1" fill="#FFD700" />
          ))}
        </div>
        
        <p className="text-sm font-bold text-gray-900 mb-1">
          {testimonial.quote}
        </p>
        
        <div className="flex items-center">
          <div>
            <p className="font-semibold text-gray-800 text-xs">{testimonial.name}</p>
            <p className="text-gray-500 text-xs">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsFitanywhereSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  const goToTestimonial = (index: number) => {
    if (index === activeIndex || index >= testimonials.length) return;
    setActiveIndex(index);
  };

  const nextTestimonial = () => {
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= testimonials.length ? 0 : nextIndex;
    });
  };

  const prevTestimonial = () => {
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? testimonials.length - 1 : nextIndex;
    });
  };

  return (
    <section ref={containerRef} id="testimonials-fitanywhere" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "text-center transition-all duration-1000 transform mb-10", 
            isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE FITANYWHERE?
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                isInView ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>
          
          <div className={cn(
            "relative transition-all duration-500",
            isInView ? "opacity-100" : "opacity-0 translate-y-4"
          )}>
            <Carousel opts={{ 
              loop: true,
              align: "start",
              skipSnaps: false,
              dragFree: true,
            }}>
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem 
                    key={index} 
                    className={isMobile ? "basis-3/4 md:basis-1/2" : "basis-1/4 md:basis-1/3"}
                  >
                    <div className="p-1">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            {!isMobile && (
              <div className="flex space-x-2 mt-3 justify-center md:justify-start bg-white">
                {testimonials.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={() => goToTestimonial(index)} 
                    className={cn(
                      "transition-all duration-300", 
                      index === activeIndex 
                        ? "w-3 h-3 bg-black rounded-full" 
                        : "w-2 h-2 bg-[#F1F0FB] rounded-full hover:bg-gray-400"
                    )} 
                    aria-label={`Go to testimonial ${index + 1}`} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsFitanywhereSection;
