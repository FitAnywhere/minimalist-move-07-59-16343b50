import { useState, useRef, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import VideoPlayer from '@/components/ui/VideoPlayer';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [{
  name: "Laura G.",
  role: "",
  quote: "When I'm overwhelmed, this is the one thing that resets me instantly.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745078301/evbox_hplqap.png"
}, {
  name: "Mason K.",
  role: "",
  quote: "BoxFun didn't just get me moving. It made me want to move.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744097765/Izdelek_brez_naslova_-_2025-04-08T093354.537_ovbtbx.png"
}, {
  name: "TOM S.",
  role: "",
  quote: "I needed something that make me smile after a long day.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745311903/Izdelek_brez_naslova_-_2025-04-22T105027.125_mx9mhg.png"
}, {
  name: "Blake H.",
  role: "",
  quote: "Never thought working out could feel this fun.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744097748/Screenshot_72_ggjdho.png"
}, {
  name: "Tyler B.",
  role: "",
  quote: "Getting fit used to feel like work. Now it feels like play.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744141492/Izdelek_brez_naslova_-_2025-04-08T214404.198_yb1jc0.png"
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

const TestimonialsCarouselThird = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();

  return <section ref={containerRef} id="testimonials-third" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE BOXFUN?
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
          </div>
          
          {/* Added empty space container for more spacing */}
          <div className="h-12 md:h-16"></div>
        </div>
      </div>
    </section>;
};

export default TestimonialsCarouselThird;
