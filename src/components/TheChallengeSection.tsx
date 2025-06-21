
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';

const challenges = [
  {
    problem: "Too intimidated to start",
    solution: "Bands make everything possible"
  },
  {
    problem: "No time for long workouts",
    solution: "15-minute sessions that fit anywhere"
  },
  {
    problem: "Lack of privacy",
    solution: "Train in your own space"
  },
  {
    problem: "Don't know what to do",
    solution: "Coach guides every step"
  }
];

const TheChallengeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    challenges: [false, false, false, false]
  });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({ ...prev, title: true })), 100);
      challenges.forEach((_, index) => {
        setTimeout(() => {
          setAnimationState(prev => {
            const updatedChallenges = [...prev.challenges];
            updatedChallenges[index] = true;
            return { ...prev, challenges: updatedChallenges };
          });
        }, 300 + index * 150);
      });
    }
  }, [isInView]);

  const handleCTAClick = () => {
    window.open('https://buy.stripe.com/eVa28y4t7cOw33qeVa', '_blank');
  };

  return (
    <section ref={sectionRef} className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className={cn(
            "text-center mb-12 transition-all duration-1000",
            animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              THE CHALLENGE
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                animationState.title ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>

          {/* Challenge Grid */}
          <div className={cn(
            "grid gap-6 mb-12",
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          )}>
            {challenges.map((challenge, index) => (
              <div
                key={index}
                className={cn(
                  "bg-gray-50 rounded-xl p-6 transition-all duration-500 hover:shadow-lg",
                  animationState.challenges[index] 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Problem */}
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 p-2 bg-red-100 rounded-full mr-3">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="text-gray-800 font-medium">
                    {challenge.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 bg-green-100 rounded-full mr-3">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-black font-semibold">
                    {challenge.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6 font-medium">
              Every excuse has an answer. Every barrier has a solution.
            </p>
            <Button 
              variant="yellow" 
              size="lg" 
              className="font-semibold"
              onClick={handleCTAClick}
            >
              OVERCOME THE CHALLENGE →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheChallengeSection;
