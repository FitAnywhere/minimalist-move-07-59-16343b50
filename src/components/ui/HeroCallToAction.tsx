
import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroCallToActionProps {
  isInView: boolean;
  isMobile: boolean;
  scrollToOwnBoth: (e: React.MouseEvent) => void;
}

const HeroCallToAction = memo(({ isInView, isMobile, scrollToOwnBoth }: HeroCallToActionProps) => {
  return (
    <div 
      className={cn(
        "mt-10 transition-all duration-1000 delay-500", 
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="mt-4 space-y-1">
        <p className="text-gray-700 text-base font-semibold">On average, gym users lose:</p>
        <p className="text-gray-700 my-[9px] text-base font-semibold">
          €12,052 in fees + {isMobile ? '2,080' : '883'} hours in traffic
        </p>
      </div>
      
      <button 
        onClick={scrollToOwnBoth} 
        className={cn(
          "inline-flex items-center bg-yellow text-black hover:bg-yellow-dark rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow",
          isMobile ? "px-[25px] mx-0 py-[4px] my-[27px]" : "py-[15px] px-[58px] my-[20px]"
        )}
        aria-label="Learn more about subscribing"
      >
        STOP SUBSCRIBING
        <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
});

HeroCallToAction.displayName = 'HeroCallToAction';
export default HeroCallToAction;
