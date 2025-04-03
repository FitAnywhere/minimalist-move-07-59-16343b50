
import { memo, useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
interface HeroContentProps {
  isInView: boolean;
  scrollToOwnBoth: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}
const HeroContent = memo(({
  isInView,
  scrollToOwnBoth,
  isMobile = false
}: HeroContentProps) => {
  const words = ["CALISTHENICS", "FITNESS", "BOX"];
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  // Constants for the typewriter effect
  const typingSpeed = 150; // Speed of typing in ms
  const deletingSpeed = 40; // Speed of deleting in ms
  const waitingTime = 300; // Time to wait when word is fully typed in ms

  useEffect(() => {
    const currentWord = words[wordIndex];
    const timeout = setTimeout(() => {
      if (isWaiting) {
        setIsWaiting(false);
        setIsDeleting(true);
        return;
      }
      if (isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length === 1) {
          setIsDeleting(false);
          setWordIndex(prevIndex => (prevIndex + 1) % words.length);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText.length === currentWord.length) {
          setIsWaiting(true);
        }
      }
    }, isWaiting ? waitingTime : isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, isWaiting, words]);
  return <div className="text-center md:text-left">
      <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
        <span className="relative inline-block min-w-[300px] md:min-w-[400px]">
          {displayText}
          <span className={`${isWaiting ? 'opacity-0' : 'opacity-100'} inline-block w-[2px] h-[1em] bg-black ml-1 animate-pulse`}></span>
          <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
        </span>
      </h1>
      
      <p className={cn("mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>3 in 1 portable gym that adapts to your lifestyle</p>
      
      {!isMobile && <div className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <button onClick={scrollToOwnBoth} className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow py-[15px] px-[88px] my-[14px]">
            STOP SUBSCRIBING
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          <div className="mt-4 space-y-1">
            <p className="text-gray-700 text-base font-bold">On average, gym users lose:</p>
            <p className="text-gray-700 px-0 py-[4px] font-bold text-base">€12,052 in fees + 883 hours in traffic</p>
            
          </div>
        </div>}
    </div>;
});

// Display name for React DevTools
HeroContent.displayName = 'HeroContent';
export default HeroContent;
