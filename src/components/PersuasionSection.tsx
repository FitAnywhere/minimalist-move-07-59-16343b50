
import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const PersuasionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isInView = useInView(sectionRef, { threshold: 0.3 });
  const [typedText, setTypedText] = useState('');
  const fullText = "The real question is, are you ready?";
  const [showCta, setShowCta] = useState(false);
  
  // Handle the typed text effect
  useEffect(() => {
    if (!isInView) {
      setTypedText('');
      setShowCta(false);
      return;
    }
    
    if (isInView && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, 50);
      
      return () => clearTimeout(timeout);
    }
    
    if (typedText === fullText) {
      // Set a timeout to show the CTA after the typing effect is complete
      const ctaTimeout = setTimeout(() => {
        setShowCta(true);
      }, 500);
      
      return () => clearTimeout(ctaTimeout);
    }
  }, [isInView, typedText]);
  
  // Set visibility flag based on inView - used for scroll-triggered animations
  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInView]);
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/aEU5mK1dB1b7dJC14g', '_blank');
  };
  
  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 min-h-[80vh] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000"
      style={{
        background: 'linear-gradient(to bottom, white 0%, #f5f5f5 25%, #333 60%, black 100%)'
      }}
    >
      <div className="container relative z-10 mx-auto px-6 flex flex-col items-center justify-center space-y-20">
        {/* First line */}
        <p 
          className={cn(
            "text-xl md:text-2xl font-semibold text-black transition-all duration-1000 delay-500 text-center max-w-2xl parallax-bg",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          It took years of engineering, relentless testing, and countless refinements.
        </p>
        
        {/* Second line */}
        <p 
          className={cn(
            "text-2xl md:text-3xl font-bold text-gray-800 transition-all duration-1500 delay-1000 text-center max-w-xl parallax-bg",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          Now, it's finally perfect.
        </p>
        
        {/* Third line - typed effect */}
        <p 
          className={cn(
            "text-2xl md:text-4xl font-extrabold text-white text-center max-w-xl parallax-bg",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {typedText}<span className="animate-pulse">|</span>
        </p>
        
        {/* Fourth line */}
        <p 
          className={cn(
            "text-xl md:text-3xl font-bold text-white text-center max-w-2xl transition-all duration-1000 delay-[2000ms] parallax-bg pulse-glow",
            typedText === fullText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          Or will you keep wasting time and pouring money into gym fees?
        </p>
        
        {/* CTA Button */}
        <div 
          className={cn(
            "mt-12 transition-all duration-1000 delay-500",
            showCta ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <Button
            variant="yellow"
            size="xl"
            className="font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 button-glow group"
            onClick={handleCheckout}
          >
            GET BOXFUN NOW
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PersuasionSection;
