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

const testimonials: Testimonial[] = [{
  name: "Sarah M.",
  role: "Remote Worker",
  quote: "Used to blame Zoom for no workouts. Now I sneak in 15 min wins.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto:eco/v1744099088/Screenshot_76_nkxmvr.png"
}, {
  name: "Jordan P.",
  role: "Calisthenics Enthusiast",
  quote: "Honestly shocked how fast this became my main workout.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto:eco/v1744112883/Screenshot_85_xnvarx.png"
}, {
  name: "Chris L.",
  role: "Fitness Advocate",
  quote: "Modern, minimal, and our people love it.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto:eco/v1744099090/Screenshot_73_tco9rh.png"
}, {
  name: "Emily T.",
  role: "Fitness Beginner",
  quote: "One workout in and I realized. Bands are no joke.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto:eco/v1744150914/Screenshot_89_mw00er.png"
}, {
  name: "Alex G.",
  role: "Busy Professional",
  quote: "Minimal gear. Maximum gains. Just how I like it.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto:eco/v1744097748/Screenshot_71_b7srzc.png"
}, {
  name: "Tom S.",
  role: "Strength Seeker",
  quote: "No crowds, no pressure. Just me, music, and movement.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto:eco/v1744099087/Screenshot_77_jlxu5i.png"
}];

const TestimonialImage = memo(({ imageUrl }: { imageUrl: string }) => {
  const width = 640;
  const height = 960;
  
  const getResponsiveUrl = (url: string, width: number) => {
    if (url.includes('f_auto,q_auto')) {
      return url.replace('f_auto,q_auto', `f_auto,q_auto:eco,w_${width}`);
    }
    return url;
  };
  
  const smallUrl = getResponsiveUrl(imageUrl, 280);
  const largeUrl = getResponsiveUrl(imageUrl, 640);
  
  return (
    <div className="relative w-full" style={{ paddingBottom: '150%' }}>
      <img 
        src={getResponsiveUrl(imageUrl, 640)}
        alt="Testimonial" 
        className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
        loading="lazy"
        width={width}
        height={height}
        srcSet={`
          ${smallUrl} 280w,
          ${largeUrl} 640w
        `}
        sizes="(max-width: 768px) 100vw, 640px"
      />
    </div>
  );
});
TestimonialImage.displayName = 'TestimonialImage';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-black rounded-t-xl">
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

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();

  return (
    <section ref={containerRef} id="testimonials" className="py-16 bg-white">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
