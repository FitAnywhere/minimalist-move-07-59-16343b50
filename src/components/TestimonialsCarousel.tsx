
import { useState, useRef, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";

interface Testimonial {
  name: string;
  quote: string;
  imageUrl: string;
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

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();

  return <section ref={containerRef} id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LOVED BY
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div className={cn("relative transition-all duration-500", isInView ? "opacity-100" : "opacity-0 translate-y-4")}>
            <ThreeDPhotoCarousel testimonials={testimonials} />
            
            <div className="text-center mt-8">
              <p className="text-gray-700 font-semibold text-lg">For those that improves when no one believes in them</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default TestimonialsCarousel;
