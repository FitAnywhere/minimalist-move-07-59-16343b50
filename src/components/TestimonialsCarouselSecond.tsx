
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import { Star } from 'lucide-react';

const testimonials = [{
  name: "Sarah M.",
  role: "New York, USA",
  text: "BoxFun has been a game-changer for my kids! They're always excited to play and it's a great way to keep them active indoors.",
  avatar: "https://i.pravatar.cc/150?img=5",
  location: "New York, USA"
}, {
  name: "David L.",
  role: "London, UK",
  text: "I was skeptical at first, but BoxFun is amazing! It's so much fun for the whole family and it's a great workout too.",
  avatar: "https://i.pravatar.cc/150?img=6",
  location: "London, UK"
}, {
  name: "Emily R.",
  role: "Sydney, Australia",
  text: "BoxFun is the best investment I've made for my kids' health and happiness. They love it and I love seeing them so active!",
  avatar: "https://i.pravatar.cc/150?img=7",
  location: "Sydney, Australia"
}];

const TestimonialsCarouselSecond = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div ref={containerRef} className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-16 transition-all duration-1000", 
            isInView ? "opacity-100" : "opacity-0 translate-y-10")}>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 relative inline-block">
              WHY THEY LOVE BOXFUN?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow transform transition-transform duration-1000", 
                isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div className={cn("transition-all duration-1000 delay-300", 
            isInView ? "opacity-100" : "opacity-0 translate-y-10")}>
            
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    {/* Desktop card view */}
                    {!isMobile && (
                      <div className={cn("h-full rounded-xl bg-white shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg",
                        "flex flex-col justify-between")}
                        style={{ transitionDelay: `${index * 100}ms` }}>
                        
                        <div>
                          <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                        </div>
                        
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 border-2 border-yellow">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <p className="font-semibold text-black">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Mobile integrated card view */}
                    {isMobile && (
                      <div className="w-4/5 mx-auto overflow-hidden shadow-md rounded-xl transition-all duration-300 border border-gray-200">
                        <div className="bg-gray-100">
                          <div className="h-64 w-full relative">
                            <Avatar className="absolute inset-0 w-full h-full rounded-none">
                              <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                              <AvatarFallback className="w-full h-full text-6xl">{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        
                        {/* Mobile testimonial text (attached to image) */}
                        <div className="bg-white p-4">
                          <div className="flex mb-2 justify-center">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 mr-1" fill="#FFD700" />)}
                          </div>
                          
                          <p className="text-gray-700 mb-2 text-center font-bold">
                            "{testimonial.text}"
                          </p>
                          
                          <div className="text-center">
                            <p className="font-semibold text-black">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="hidden md:block">
                <CarouselPrevious className="animate-[pulse_2s_ease-in-out_infinite]" />
                <CarouselNext className="animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
            </Carousel>
            
            {/* Mobile pagination indicators with updated colors */}
            {isMobile && (
              <div className="flex justify-center mt-4 space-x-3">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    className={cn(
                      "transition-all duration-300 rounded-full",
                      index === 0 ? "w-4 h-4 bg-yellow" : "w-3 h-3 bg-gray-200"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarouselSecond;
