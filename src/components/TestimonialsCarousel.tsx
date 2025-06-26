
import { useState, useRef, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';

interface CircularTestimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

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

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

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
          
          <div className="text-center mb-16">
            <p className="text-gray-700 text-lg font-bold">They didn't see their own potential. Now they're the ones giving advice.</p>
          </div>

          {/* Circular Testimonials Section */}
          <div className="mt-16">
            <div className="flex justify-center">
              <CircularTestimonials 
                testimonials={circularTestimonials} 
                autoplay={true} 
                colors={{
                  name: "#0a0a0a",
                  designation: "#454545",
                  testimony: "#171717",
                  arrowBackground: "#141414",
                  arrowForeground: "#f1f1f7",
                  arrowHoverBackground: "#00A6FB"
                }} 
                fontSizes={{
                  name: "28px",
                  designation: "20px",
                  quote: "20px"
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
