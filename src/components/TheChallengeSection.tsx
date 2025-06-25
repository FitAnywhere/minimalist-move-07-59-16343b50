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
  return;
};
export default TheChallengeSection;