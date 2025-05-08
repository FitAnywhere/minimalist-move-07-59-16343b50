import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInView } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';
import VideoPlayer from '@/components/ui/VideoPlayer';

// Define carousel images - using the same structure as HeroCarousel
const carouselImages = ["https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/1_doj-Photoroom_9_-Photoroom_7_y2vlxo.jpg", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/IMG_20250427_114419_333_vqgbst.jpg", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/IMG_20250427_114421_715_kx0t3m.jpg"];
const LimitedOfferSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isInView = useInView(sectionRef, {
    threshold: 0.2
  });
  const isMobile = useIsMobile();

  // Add carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add carousel auto-rotation (exactly like in HeroCarousel)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % carouselImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://fitanywhere.today/', '_blank');
  };
  return <section id="private-gym" ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto py-0 px-0 my-0">
          <div className={cn("text-center mb-6 transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHAT IS A PRIVATE GYM?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>

          {/* Carousel Container - uses the same styling approach as HeroCarousel */}
          <div className="flex flex-col items-center mb-8">
            <div className={cn("relative overflow-hidden rounded-xl mb-4", isMobile ? "aspect-square w-[80%]" : "max-w-[400px] w-full aspect-square mx-auto")}>
              {carouselImages.map((image, index) => <div key={image} className={cn("absolute inset-0 w-full h-full transition-opacity duration-1000", currentIndex === index ? "opacity-100" : "opacity-0")}>
                  <img src={image} alt={`Private gym image ${index + 1}`} className="w-full h-full object-cover rounded-xl" width={1080} height={1080} loading={index === 0 ? "eager" : "lazy"} />
                </div>)}
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-0 py-0">
            {/* Video Container */}
            <div className="relative w-full md:w-[60%] mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl">
              
            </div>

            <p className="text-lg text-gray-800 text-center mt-6 mb-8 font-semibold mx-0 px-0 my-[22px] py-0 md:text-xl">Where beginners do what feels impossible</p>
            
            <div className="flex justify-center mt-4 my-0">
              <button onClick={handleLearnMoreClick} className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-3 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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