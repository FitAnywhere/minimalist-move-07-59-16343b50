
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroContentProps {
  isInView: boolean;
  scrollToOwnBoth: (e: React.MouseEvent) => void;
}

const HeroContent = ({ isInView, scrollToOwnBoth }: HeroContentProps) => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="text-center md:text-left">
      <h1 ref={headlineRef} className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <span className="relative inline-block">
          ALL YOU NEED
          <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
        </span>
      </h1>
      
      <p ref={subheadlineRef} className={cn("mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>Portable gym that adapts to your lifestyle</p>
      
      <div ref={ctaRef} className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
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
    </div>
  );
};

export default HeroContent;
