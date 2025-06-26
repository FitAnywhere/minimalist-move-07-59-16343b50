import { useState, useRef, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CircularTestimonials } from '@/components/ui/circular-testimonials';

interface Testimonial {
  name: string;
  quote: string;
  imageUrl: string;
}

interface CircularTestimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

const testimonials: Testimonial[] = [{
  name: "Emily T.",
  quote: "Didn't think 15 minutes a day could do this much",
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

const circularTestimonials: CircularTestimonial[] = [{
  quote: "Didn't think 15 minutes a day could do this much",
  name: "Emily T.",
  designation: "Customer",
  src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744150914/Screenshot_89_mw00er.png"
}, {
  quote: "Loving results I got after following your training guides",
  name: "Jordan P.",
  designation: "Customer",
  src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744112883/Screenshot_85_xnvarx.png"
}, {
  quote: "Over night I can do everything that was impossible before",
  name: "Laura G.",
  designation: "Customer",
  src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745078371/Screenshot_13_wp6ih6.png"
}, {
  quote: "Members in our training studios adore it.",
  name: "Chris L.",
  designation: "Customer",
  src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099090/Screenshot_73_tco9rh.png"
}, {
  quote: "Training privately feels fantastic, people are not staring at me anymore.",
  name: "Sarah M.",
  designation: "Customer",
  src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099088/Screenshot_76_nkxmvr.png"
}, {
  quote: "I turn on speaker and grow muscle on my terrace.",
  name: "Tom S.",
  designation: "Customer",
  src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099087/Screenshot_77_jlxu5i.png"
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
  
  return (
    <picture>
      <source media="(max-width: 480px)" srcSet={smallUrl} />
      <source media="(max-width: 768px)" srcSet={mediumUrl} />
      <img 
        src={largeUrl}
        alt="Testimonial"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </picture>
  );
});

TestimonialImage.displayName = 'TestimonialImage';

const TestimonialCard = ({
  testimonial
}: {
  testimonial: Testimonial;
}) => {
  return (
    <div className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-black rounded-t-xl">
      <TestimonialImage imageUrl={testimonial.imageUrl} />
    </div>
  );
};

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  return (
    <section ref={containerRef} id="testimonials" className="py-16" style={{
      backgroundColor: '#f6f6f6'
    }}>
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
                {testimonials.map((testimonial, index) => <CarouselItem key={index}>
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>)}
              </CarouselContent>
            </Carousel>
            
            <div className="text-center mt-8">
              <p className="text-gray-700 text-lg font-bold">They didn't see their own potential. Now they're the ones giving advice.</p>
            </div>
          </div>

          {/* New Circular Testimonials Section */}
          <div className="mt-16">
            <div className="flex justify-center">
              <CircularTestimonials testimonials={circularTestimonials} autoplay={true} colors={{
              name: "#0a0a0a",
              designation: "#454545",
              testimony: "#171717",
              arrowBackground: "#141414",
              arrowForeground: "#f1f1f7",
              arrowHoverBackground: "#00A6FB"
            }} fontSizes={{
              name: "28px",
              designation: "20px",
              quote: "20px"
            }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
