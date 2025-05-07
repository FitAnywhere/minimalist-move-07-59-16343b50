
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInView } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';

const LimitedOfferSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isInView = useInView(sectionRef, {
    threshold: 0.2
  });
  
  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://fitanywhere.today/', '_blank');
  };
  
  return <section id="private-gym" ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-6 transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHAT IS A PRIVATE GYM?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Video/Image Container */}
            <div className="relative w-full md:w-[60%] mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746366944/poster_dgzet0.jpg" 
                alt="Private Gym Video Poster" 
                className="w-full h-auto object-cover rounded-2xl" 
                loading="lazy"
              />
            </div>

            <p className="text-lg md:text-xl font-medium text-gray-800 text-center mt-6 mb-8">
              Where beginners do what once felt impossible
            </p>
            
            <div className="flex justify-center mt-4">
              <button 
                onClick={handleLearnMoreClick} 
                className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-3 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                DISCOVER MORE
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default LimitedOfferSection;
