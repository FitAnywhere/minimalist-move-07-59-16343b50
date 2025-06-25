
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';

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

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        title: true
      })), 100);
      challenges.forEach((_, index) => {
        setTimeout(() => {
          setAnimationState(prev => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[index] = true;
            return {
              ...prev,
              challenges: updatedChallenges
            };
          });
        }, 300 + index * 150);
      });
    }
  }, [isInView]);

  const handleCTAClick = () => {
    window.open('https://buy.stripe.com/eVa28y4t7cOw33qeVa', '_blank');
  };

  return (
    <section ref={sectionRef} className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className={cn(
          "text-center mb-16 transition-all duration-1000",
          animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            THE CHALLENGE
          </h2>
          <p className="text-xl text-gray-300">
            We know what's stopping you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className={cn(
                "bg-gray-900 p-6 rounded-lg transition-all duration-700",
                animationState.challenges[index] 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              )}
            >
              <div className="flex items-center mb-4">
                <X className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-red-500">
                  {challenge.problem}
                </h3>
              </div>
              <div className="flex items-center">
                <Check className="w-6 h-6 text-green-500 mr-3" />
                <p className="text-green-500 font-medium">
                  {challenge.solution}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleCTAClick}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg"
          >
            START YOUR TRANSFORMATION
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TheChallengeSection;
