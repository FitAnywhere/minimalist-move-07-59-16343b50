
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import BandsFeatureList from './products/BandsFeatureList';
import BandsVideoSection from './products/BandsVideoSection';

const ProductTabs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();

  return (
    <section id="accessories" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              MAXIMIZE YOUR EXPERIENCE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            <p className="mt-4 text-gray-700 font-medium text-xl py-[13px]">More exercises for beginners and pros - with TRX & BANDS</p>
          </div>
          
          <div className="opacity-100 translate-x-0">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <BandsFeatureList isMobile={isMobile} />
              <BandsVideoSection isMobile={isMobile} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
