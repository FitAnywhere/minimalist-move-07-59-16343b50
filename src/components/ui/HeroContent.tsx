
import { memo } from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroContentProps {
  isInView: boolean;
  scrollToOwnBoth: (e: React.MouseEvent) => void;
  isMobile?: boolean;
  overrideTitle?: string;
  onCTAClick?: () => void;
}

const HeroContent = memo(({
  isInView,
  scrollToOwnBoth,
  isMobile = false,
  overrideTitle,
  onCTAClick
}: HeroContentProps) => {
  const title = overrideTitle || "STILL WEAK?";

  return (
    <div className={cn("text-center", isMobile ? "md:text-left" : "")}>
      <h1 className={cn(
        "text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000 uppercase",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <span className="relative inline-block min-w-[300px] md:min-w-[400px] min-h-[1.2em]">
          {title}
          <span 
            className={cn(
              "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
              isInView ? "scale-x-100" : "scale-x-0"
            )} 
            aria-hidden="true" 
          />
        </span>
      </h1>
      
      {!isMobile && (
        <div className={cn(
          "mt-10 transition-all duration-1000 delay-500",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="mt-4 space-y-1 text-center">
            <p className="text-gray-700 font-bold text-lg">Build strength in silence.</p>
            <p className="text-gray-700 px-0 py-[4px] font-bold text-lg">In your bedroom, balcony, or any 1m² of space.</p>
          </div>
          
          <div className="text-center mt-6 flex flex-col items-center">
            <ArrowDown className="mb-4 w-6 h-6 animate-bounce text-yellow" />
            <button
              onClick={onCTAClick}
              className="inline-block text-lg font-semibold px-6 py-2 bg-yellow text-black rounded-full shadow-sm hover:bg-yellow-dark transition-colors uppercase"
            >
              WHY YOU MUST START
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

HeroContent.displayName = 'HeroContent';
export default HeroContent;
