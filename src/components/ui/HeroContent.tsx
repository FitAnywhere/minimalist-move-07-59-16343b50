
import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroContentProps {
  isInView: boolean;
  scrollToOwnBoth: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}

const HeroContent = memo(({ isInView, scrollToOwnBoth, isMobile = false }: HeroContentProps) => {
  return (
    <div className="text-center md:text-left">
      <h1 className={cn(
        "text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", 
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <span className="relative inline-block">
          ALL YOU NEED
          <span className={cn(
            "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
            isInView ? "scale-x-100" : "scale-x-0"
          )}></span>
        </span>
      </h1>
      
      <p className={cn(
        "mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", 
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        Portable gym that adapts to your lifestyle
      </p>
      
      {!isMobile && (
        <div className={cn(
          "mt-10 transition-all duration-1000 delay-500", 
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <button 
            onClick={scrollToOwnBoth}
            className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
          >
            EXPLORE
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Launching Spring 2025
          </p>
        </div>
      )}
    </div>
  );
});

// Display name for React DevTools
HeroContent.displayName = 'HeroContent';

export default HeroContent;
