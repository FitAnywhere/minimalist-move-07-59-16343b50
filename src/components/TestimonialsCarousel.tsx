import { useState, useRef, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Testimonial {
  name: string;
  quote: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [{
  name: "Emily T.",
  quote: "I doubted myself, now I love every workout",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744150914/Screenshot_89_mw00er.png"
}, {
  name: "Jordan P.",
  quote: "Loving results I got after following your training guides",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744112883/Screenshot_85_xnvarx.png"
}, {
  name: "Laura G.",
  quote: "Over night I can do everything that was impossible before",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745078371/Screenshot_13_wp6ih6.png"
}, {
  name: "Chris L.",
  quote: "Members in our training studios adore it.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099090/Screenshot_73_tco9rh.png"
}, {
  name: "Sarah M.",
  quote: "Training privately feels fantastic, people are not staring at me anymore.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099088/Screenshot_76_nkxmvr.png"
}, {
  name: "Tom S.",
  quote: "I turn on speaker and grow muscle on my terrace.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099087/Screenshot_77_jlxu5i.png"
}];

const TestimonialImage = memo(({
  imageUrl
}: {
  imageUrl: string;
}) => {
  const width = 400;
  const height = 600;
  const getResponsiveUrl = (url: string, width: number) => {
    if (url.includes('f_auto,q_auto')) {
      return url.replace('f_auto,q_auto', `f_auto,q_auto,w_${width}`);
    }
    return url;
  };
  const smallUrl = getResponsiveUrl(imageUrl, 300);
  const mediumUrl = getResponsiveUrl(imageUrl, 400);
  const largeUrl = getResponsiveUrl(imageUrl, 600);
  return <div className="relative w-full" style={{
    paddingBottom: '150%'
  }}>
      <img src={imageUrl} alt="Testimonial" className="absolute inset-0 w-full h-full object-cover rounded-t-xl" loading="lazy" width={width} height={height} srcSet={`
          ${smallUrl} 300w,
          ${mediumUrl} 400w,
          ${largeUrl} 600w
        `} sizes="(max-width: 640px) 300px, (max-width: 768px) 400px, 600px" />
    </div>;
});
TestimonialImage.displayName = 'TestimonialImage';

const TestimonialCard = ({
  testimonial
}: {
  testimonial: Testimonial;
}) => {
  return <div className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-black rounded-t-xl">
      <TestimonialImage imageUrl={testimonial.imageUrl} />
      
      <div className="bg-white p-3 shadow-md rounded-b-xl border border-gray-100">
        <div className="flex mb-1">
          {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 mr-1" fill="#FFD700" />)}
        </div>
        
        <p className="text-sm font-bold text-gray-900 mb-1">
          {testimonial.quote}
        </p>
        
        <div className="flex items-center">
          <div>
            <p className="font-semibold text-gray-800 text-xs">{testimonial.name}</p>
          </div>
        </div>
      </div>
    </div>;
};

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();

  return <section ref={containerRef} id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LOVED BY
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div className={cn("relative transition-all duration-500", isInView ? "opacity-100" : "opacity-0 translate-y-4")}>
            <Carousel opts={{
            loop: true,
            align: "start",
            skipSnaps: false,
            dragFree: true
          }}>
              <CarouselContent>
                {testimonials.map((testimonial, index) => <CarouselItem key={index} className={isMobile ? "basis-3/4 md:basis-1/2" : "basis-1/4 md:basis-1/3"}>
                    <div className="p-1">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            <div className="text-center mt-8">
              <p className="text-gray-700 font-semibold text-lg">
                For those who train when no one believes in them
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default TestimonialsCarousel;
