
import { memo } from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroContentProps {
  isInView: boolean;
  scrollToOwnBoth: (e: React.MouseEvent) => void;
  isMobile?: boolean;
  overrideTitle?: string;
}

const HeroContent = memo(({
  isInView,
  scrollToOwnBoth,
  isMobile = false,
  overrideTitle
}: HeroContentProps) => {
  const title = overrideTitle || "ZERO TO STRONG";

  return <div className="text-center md:text-left">
      <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <span className="relative inline-block min-w-[300px] md:min-w-[400px] min-h-[1.2em]">
          {title}
          <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")} aria-hidden="true" />
        </span>
      </h1>
      
      <p className={cn("mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>YOUR PRIVATE CALISTHENICS JOURNEY BEGINS TODAY</p>
      
      {!isMobile && <div className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <div className="mt-4 space-y-1">
            <p className="text-gray-700 font-bold text-lg">Never done a pull-up? Can’t hold a dip?</p>
            <p className="text-gray-700 px-0 py-[4px] font-bold text-lg">You’re exactly who FitAnywhere was built for.</p>
          </div>
          
          <button onClick={e => e.preventDefault()} disabled className={cn("inline-flex items-center bg-yellow text-black hover:bg-yellow-dark rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow", isMobile ? "py-[10px] px-[25px]" : "py-[15px] px-[58px]", "my-[20px] cursor-not-allowed")}>
            40% OFF LAUNCH OFFER
            <ArrowDown className="ml-2 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>}
    </div>;
});

HeroContent.displayName = 'HeroContent';
export default HeroContent;
