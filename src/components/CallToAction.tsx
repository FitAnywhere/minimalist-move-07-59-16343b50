
import { useRef, useEffect, useState } from 'react';
import { useInView, useParallax } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });
  const [animatedWords1, setAnimatedWords1] = useState<string[]>([]);
  const [animatedWords2, setAnimatedWords2] = useState<string[]>([]);
  
  // All text converted to uppercase
  const firstLine = "WAS ALL THIS ENGINEERING WORTH IT?";
  const secondLine = "OR WILL YOU KEEP WASTING TIME AND MONEY?";
  
  // Set up parallax effect
  useParallax(backgroundRef, 0.05);
  
  // Word-by-word animation effect
  useEffect(() => {
    if (isInView) {
      // Reset animations to prevent duplicates
      setAnimatedWords1([]);
      setAnimatedWords2([]);
      
      const words1 = firstLine.split(' ');
      const words2 = secondLine.split(' ');
      
      const animateWords = (words: string[], setStateFunction: React.Dispatch<React.SetStateAction<string[]>>) => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
          if (currentIndex < words.length) {
            setStateFunction(prev => [...prev, words[currentIndex]]);
            currentIndex++;
          } else {
            clearInterval(intervalId);
          }
        }, 200); // 200ms delay between each word
        
        return () => clearInterval(intervalId);
      };
      
      // Start first line animation immediately
      const cleanup1 = animateWords(words1, setAnimatedWords1);
      
      // Start second line animation after a delay
      const timeout = setTimeout(() => {
        const cleanup2 = animateWords(words2, setAnimatedWords2);
        return cleanup2;
      }, words1.length * 250); // Start second line after first line completes (with a little buffer)
      
      return () => {
        cleanup1();
        clearTimeout(timeout);
      };
    } else {
      // Reset animations when section is out of view
      setAnimatedWords1([]);
      setAnimatedWords2([]);
    }
  }, [isInView]);
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/4gw7sS8Jn5m4dI43ck', '_blank');
  };
  
  return (
    <section 
      id="order" 
      ref={sectionRef} 
      className="relative py-12 md:py-16 overflow-hidden min-h-[60vh] md:min-h-[50vh] flex items-center"
      style={{
        background: 'linear-gradient(to bottom, #8A898C 0%, #555555 40%, #333333 70%, #222222 85%, black 100%)'
      }}
    >
      {/* Parallax Background */}
      <div ref={backgroundRef} className="absolute inset-0 opacity-30">
        {/* Background content if needed */}
      </div>
      
      <div className="container relative z-20 mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-6 md:space-y-4">
            {/* First animated line */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight min-h-[3.5rem] md:min-h-[4rem] px-2 md:px-0">
              {animatedWords1.map((word, index) => (
                <span 
                  key={`${word}-${index}`} 
                  className={cn(
                    "inline-block mx-1 transition-all duration-700 opacity-0 translate-y-4",
                    isInView && "opacity-100 translate-y-0"
                  )}
                  style={{ 
                    transitionDelay: `${index * 200}ms` 
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>
            
            {/* Second animated line */}
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight min-h-[3rem] md:min-h-[3.5rem] px-2 md:px-0">
              {animatedWords2.map((word, index) => (
                <span 
                  key={`${word}-${index}`} 
                  className={cn(
                    "inline-block mx-1 transition-all duration-700 opacity-0 translate-y-4",
                    isInView && "opacity-100 translate-y-0"
                  )}
                  style={{ 
                    transitionDelay: `${(animatedWords1.length * 200) + (index * 200)}ms` 
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>
            
            {/* CTA Button - increased top margin for desktop to create more space */}
            <div 
              className={cn(
                "transition-all duration-1000 delay-[1200ms] mt-8 md:mt-12", 
                isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              <a 
                href="https://buy.stripe.com/4gw7sS8Jn5m4dI43ck"
                className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-5 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 button-glow group"
                onClick={handleCheckout}
              >
                LAST CALL
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              
              <p className="mt-6 text-sm text-white/60">For B2B partnerships and bulk orders, contact us.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

