
import { useRef, useEffect, useState } from 'react';
import { useInView, useParallax } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });
  
  // Set up parallax effect
  useParallax(backgroundRef, 0.05);
  
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
            {/* CTA Button - increased top margin for desktop to create more space */}
            <div 
              className={cn(
                "transition-all duration-1000 mt-8 md:mt-12", 
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
