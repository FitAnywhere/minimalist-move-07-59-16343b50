import { useRef, useState, useCallback, memo, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';
import { ImageSwiper } from './ui/image-swiper';
import WhyAverageMenModal from './ui/WhyAverageMenModal';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
const images = ["https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408246/44_nnkfe5.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749481218/Neon_Green_Fitness_and_Gym_Tips_Carousel_Instagram_Post_5_q4x78j.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408237/42_ozxxdn.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749480525/Neon_Green_Fitness_and_Gym_Tips_Carousel_Instagram_Post_4_jljvlh.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408245/43_tlkqgd.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749480382/58_hn78d8.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749478288/Neon_Green_Fitness_and_Gym_Tips_Carousel_Instagram_Post_1_tl0kfa.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408284/36_ely4pq.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408285/30_xu4ljl.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408286/31_fkb6l1.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408287/33_snxgki.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408279/34_tkyirg.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408278/35_cyyf2m.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408294/37_ar3noo.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408283/28_hxqe7h.png"];
const HeroSection = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isRendered, setIsRendered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use a more efficient inView detection for better performance
  const isInView = useInView(heroRef, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  // Optimize rendering by delaying non-critical elements
  useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        setIsRendered(true);
      }, {
        timeout: 1000
      });
    } else {
      // Fallback for browsers not supporting requestIdleCallback
      setTimeout(() => {
        setIsRendered(true);
      }, 100);
    }
  }, []);
  const handleCTAClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  return <section ref={heroRef} aria-label="Introduction to FitAnywhere" className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white/[0.57]">
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile ? <>
              <div className="text-center order-1 w-full space-y-6">
                <HeroContent isInView={isInView} scrollToOwnBoth={() => {}} isMobile={true} overrideTitle="TOO WEAK TO START?" />
                
                <div className="relative">
                  <p className="text-sm text-gray-600 mb-2 font-medium uppercase">WE BUILD WINNERS</p>
                  <ImageSwiper images={images} />
                </div>
                
                {isRendered && <div className={cn("transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <div className="mt-4 space-y-1">
                      <p className="text-gray-700 font-bold text-base">Train in private.</p>
                      <p className="text-gray-700 px-0 py-[4px] font-bold text-base">Return with a body they can't ignore.</p>
                    </div>
                    
                    <div className="mt-6 flex flex-col items-center">
                      <button onClick={handleCTAClick} className="inline-block text-lg font-semibold px-6 py-2 bg-yellow text-black rounded-full shadow-sm hover:bg-yellow-dark transition-colors uppercase">
                        WHY AVERAGE MEN NEVER START
                      </button>
                      <ArrowDown className="mt-4 w-6 h-6 animate-bounce text-yellow" />
                    </div>
                  </div>}
              </div>
            </> : <>
              <HeroContent isInView={isInView} scrollToOwnBoth={() => {}} overrideTitle="TOO WEAK TO START?" onCTAClick={handleCTAClick} />
              <div className="order-1 md:order-2 w-full flex flex-col items-center">
                <ImageSwiper images={images} />
                <p className="mt-3 text-gray-600 text-center uppercase text-lg font-medium my-[37px]">BUILDING WINNERS</p>
              </div>
            </>}
        </div>
      </div>
      
      {isRendered && <ScrollIndicator />}
      
      <WhyAverageMenModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>;
});
HeroSection.displayName = 'HeroSection';
export default HeroSection;