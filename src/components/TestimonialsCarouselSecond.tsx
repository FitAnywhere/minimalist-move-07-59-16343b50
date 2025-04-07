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
  
  return (
    <section ref={containerRef} id="testimonials-second" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE BoxFun?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <Carousel className="w-full max-w-2xl mx-auto">
            <CarouselContent className="-ml-1 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-1 md:pl-4">
                  <div className="p-4 md:p-6 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Avatar className="w-10 h-10 mr-4">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-black">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarouselSecond;
