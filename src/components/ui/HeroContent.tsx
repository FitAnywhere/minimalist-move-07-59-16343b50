
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
  // Start with the full first word prerendered
  const [displayText, setDisplayText] = useState(words[0]);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize animation with a delay to ensure first word is visible for LCP
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Start animation after delay to improve LCP
    timeoutRef.current = setTimeout(() => {
      setIsTypingActive(true);
    }, 1800); // 1.8s delay before starting animation
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Simplified animation logic that only runs after initial delay
  useEffect(() => {
    if (!isTypingActive) return;
    
    const typingSpeed = 250; // Speed of typing in ms
    const deletingSpeed = 80; // Speed of deleting in ms
    const waitingTime = 1000; // Time to wait when word is fully typed in ms
    
    const animateText = () => {
      const currentWord = words[wordIndex];
      const nextWordIndex = (wordIndex + 1) % words.length;
      
      // Delete current word
      const deleteWord = () => {
        let currentText = currentWord;
        const deleteInterval = setInterval(() => {
          if (currentText.length <= 1) {
            clearInterval(deleteInterval);
            setDisplayText(words[nextWordIndex].charAt(0));
            setTimeout(() => typeWord(words[nextWordIndex], 1), typingSpeed);
            return;
          }
          currentText = currentText.substring(0, currentText.length - 1);
          setDisplayText(currentText);
        }, deletingSpeed);
      };
      
      // Type the next word
      const typeWord = (word: string, charIndex: number) => {
        if (charIndex >= word.length) {
          setWordIndex(nextWordIndex);
          setTimeout(deleteWord, waitingTime);
          return;
        }
        
        setDisplayText(word.substring(0, charIndex + 1));
        setTimeout(() => typeWord(word, charIndex + 1), typingSpeed);
      };
      
      // Start the delete animation after waiting time
      setTimeout(deleteWord, waitingTime);
    };
    
    // Start the animation cycle
    const animationTimeout = setTimeout(animateText, 500);
    
    return () => {
      clearTimeout(animationTimeout);
    };
  }, [isTypingActive, wordIndex, words]);
  
  return (
    <div className="text-center md:text-left">
      <h1 className={cn(
        "text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", 
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <span className="relative inline-block min-w-[300px] md:min-w-[400px]">
          {displayText}
          <span 
            className={`inline-block w-[2px] h-[1em] bg-black ml-1 ${isTypingActive ? 'animate-pulse' : 'opacity-0'}`}
            aria-hidden="true"
          ></span>
          <span 
            className={cn(
              "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
              isInView ? "scale-x-100" : "scale-x-0"
            )}
            aria-hidden="true"
          ></span>
        </span>
      </h1>
      
      <p className={cn(
        "mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", 
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        3 IN 1 PORTABLE GYM
      </p>
      
      {!isMobile && (
        <div className={cn(
          "mt-10 transition-all duration-1000 delay-500", 
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="mt-4 space-y-1">
            <p className="text-gray-700 font-bold text-lg">On average, gym users lose:</p>
            <p className="text-gray-700 px-0 py-[4px] font-bold text-lg">€12,052 in fees + 883 hours in traffic</p>
          </div>
          
          <button 
            onClick={scrollToOwnBoth} 
            className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow py-[15px] px-[58px] my-[20px]"
          >
            STOP SUBSCRIBING
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
});

// Display name for React DevTools
HeroContent.displayName = 'HeroContent';
export default HeroContent;
