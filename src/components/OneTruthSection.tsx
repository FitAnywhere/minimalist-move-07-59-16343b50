import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
const OneTruthSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.3
  });
  const isMobile = useIsMobile();
  return;
};
export default OneTruthSection;