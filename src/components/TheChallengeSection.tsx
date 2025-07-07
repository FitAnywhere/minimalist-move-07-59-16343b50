import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { X, Check, ArrowDown } from 'lucide-react';
const challenges = [{
  problem: "Too intimidated to start",
  solution: "Bands make everything possible"
}, {
  problem: "No time for long workouts",
  solution: "15-minute sessions that fit anywhere"
}, {
  problem: "Lack of privacy",
  solution: "Train in your own space"
}, {
  problem: "Don't know what to do",
  solution: "Coach guides every step"
}];
const TheChallengeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.2
  });
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    challenges: [false, false, false, false]
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        title: true
      })), 100);

      // Animate the first card
      setTimeout(() => {
        setAnimationState(prev => {
          const updatedChallenges = [...prev.challenges];
          updatedChallenges[0] = true;
          return {
            ...prev,
            challenges: updatedChallenges
          };
        });
      }, 300);
    }
  }, [isInView]);

  // Carousel auto-switching every 3.5 seconds
  useEffect(() => {
    if (isInView && animationState.title) {
      const interval = setInterval(() => {
        setCurrentCardIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % challenges.length;

          // Animate the next card
          setAnimationState(prev => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[nextIndex] = true;
            return {
              ...prev,
              challenges: updatedChallenges
            };
          });
          return nextIndex;
        });
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isInView, animationState.title]);
  const handleCTAClick = () => {
    // Mobile-specific scrolling to pricing carousel
    if (isMobile) {
      setTimeout(() => {
        // Look for the pricing component specifically within the bundle section
        const pricingElement = document.querySelector('#bundle-offer .max-w-3xl') || document.querySelector('#bundle-offer [class*="pricing"]') || document.querySelector('#bundle-offer');
        if (pricingElement) {
          // Calculate offset to land directly on the carousel for mobile
          const elementRect = pricingElement.getBoundingClientRect();
          const offsetTop = elementRect.top + window.scrollY - 80; // Adjusted for mobile header

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        } else {
          // Fallback - look for bundle section with adjusted mobile offset
          const bundleSection = document.querySelector('#bundle-offer') || document.querySelector('#bundle');
          if (bundleSection) {
            const elementRect = bundleSection.getBoundingClientRect();
            const offsetTop = elementRect.top + window.scrollY - 60;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    } else {
      // Desktop fallback - keep existing behavior
      const bundleSection = document.querySelector('#bundle-offer') || document.querySelector('#bundle');
      if (bundleSection) {
        const elementRect = bundleSection.getBoundingClientRect();
        const offsetTop = elementRect.top + window.scrollY - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };
  return <section ref={sectionRef} className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className={cn("text-center mb-16 transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <h2 className="relative text-4xl md:text-6xl font-bold mb-4 inline-block">
            EXCUSES DIE HERE
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-400 rounded-full"></div>
          </h2>
          
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-2xl mx-auto mb-12 min-h-[200px] flex items-center justify-center">
          {challenges.map((challenge, index) => <div key={index} className={cn("absolute inset-0 bg-gray-900 border border-yellow-400 p-8 md:p-12 rounded-lg transition-all duration-700", currentCardIndex === index && animationState.challenges[index] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none")}>
              <div className="flex items-center mb-6">
                <X className="w-8 h-8 text-red-500 mr-4" />
                <h3 className="text-xl md:text-2xl font-semibold text-red-500">
                  {challenge.problem}
                </h3>
              </div>
              <div className="flex items-center">
                <Check className="w-8 h-8 text-green-500 mr-4" />
                <p className="text-green-500 font-medium text-xl md:text-2xl">
                  {challenge.solution}
                </p>
              </div>
            </div>)}
        </div>

        <div className="text-center">
          <Button onClick={handleCTAClick} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg mb-8">
            LET'S F⚡CKING GO
          </Button>
          
          {/* Animated Arrow */}
          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-yellow-400 animate-bounce" style={{
            animation: 'bounce 2s infinite'
          }} />
          </div>
        </div>
      </div>
    </section>;
};
export default TheChallengeSection;