
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

const circularTestimonials: CircularTestimonial[] = [
  {
    quote: "Every time I go on vacation, the setup comes with me.",
    name: "Tom S.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751723045/Izdelek_brez_naslova_31_y8ipuy.png"
  },
  {
    quote: "At first I use bands as extra weight and then as a support to get muscles pumped.",
    name: "Sven G.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751723048/Izdelek_brez_naslova_30_ciczrf.png"
  },
  {
    quote: "Doing movements that seemed impossible feels amazing.",
    name: "Emily T.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751575160/Izdelek_brez_naslova_-_2025-07-03T190256.259_sa5ixh.png"
  },
  {
    quote: "Gyms and parks made me feel anxious. Now I workout alone and actually enjoy it.",
    name: "Isa T.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751723347/Izdelek_brez_naslova_33_zbxnmg.png"
  },
  {
    quote: "I didn't like people staring at me in gym. Now I train in my bedroom and feel proud after every session.",
    name: "Sarah M.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751575161/Izdelek_brez_naslova_-_2025-07-03T223200.563_s4loao.png"
  },
  {
    quote: "Now I gain muscle before work without rushing to the gym.",
    name: "Daan P.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751723043/Izdelek_brez_naslova_29_t33esk.png"
  },
  {
    quote: "Nobody tells you how good it feels to do all this \"hard exercises\" easily from start.",
    name: "Laura G.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751575161/Izdelek_brez_naslova_-_2025-07-03T223027.692_cmtwvx.png"
  },
  {
    quote: "This is a setup that everyone should own if they are serious about improving their lives. Members in our studio are loving it.",
    name: "Chris L.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751575160/Izdelek_brez_naslova_-_2025-07-03T223601.643_x9sntu.png"
  },
  {
    quote: "The setup is dope, just wish I took one with adjustable sizing because sealing in my apartment is pretty low.",
    name: "Thijs D.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751575161/Izdelek_brez_naslova_-_2025-07-03T223214.187_ox5c3o.png"
  },
  {
    quote: "A friend convinced me to try 15min workout. Grateful that it happened… I ordered my setup the same day and keep using it.",
    name: "Lars G.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751575160/Izdelek_brez_naslova_-_2025-07-03T190314.511_e0jtim.png"
  },
  {
    quote: "I'm not a gym guy. This gave me a chance to gain muscle anyway.",
    name: "Jordan P.",
    designation: "Customer",
    src: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744112883/Screenshot_85_xnvarx.png"
  }
];

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  return (
    <section 
      ref={containerRef} 
      id="testimonials" 
      style={{ backgroundColor: '#f6f6f6' }} 
      className="py-0"
    >
      <div className="container mx-auto px-4 py-[30px]">
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "text-center transition-all duration-1000 transform mb-10",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LOVED BY
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                isInView ? "scale-x-100" : "scale-x-0"
              )}></span>
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
