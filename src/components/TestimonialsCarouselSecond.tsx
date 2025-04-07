import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
const testimonials = [{
  name: "Sarah M.",
  text: "BoxFun has been a game-changer for my kids! They're always excited to play and it's a great way to keep them active indoors.",
  avatar: "https://i.pravatar.cc/150?img=5",
  location: "New York, USA"
}, {
  name: "David L.",
  text: "I was skeptical at first, but BoxFun is amazing! It's so much fun for the whole family and it's a great workout too.",
  avatar: "https://i.pravatar.cc/150?img=6",
  location: "London, UK"
}, {
  name: "Emily R.",
  text: "BoxFun is the best investment I've made for my kids' health and happiness. They love it and I love seeing them so active!",
  avatar: "https://i.pravatar.cc/150?img=7",
  location: "Sydney, Australia"
}];
const TestimonialsCarouselSecond = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  return;
};
export default TestimonialsCarouselSecond;