
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "A year from now you may wish you had started today.",
    author: "Karen Lamb"
  },
  {
    text: "I've always believed that if you put in the work, the results will come.",
    author: "Michael Jordan"
  },
  {
    text: "Once you see results, it becomes an addiction.",
    author: "Kobe Bryant"
  },
  {
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali"
  },
  {
    text: "You have to expect things of yourself before you can do them.",
    author: "Michael Jordan"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "I will not let age change me. I will change the way I age.",
    author: "Tom Brady"
  },
  {
    text: "If you quit once, it becomes a habit. Never quit.",
    author: "Michael Jordan"
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Muhammad Ali"
  },
  {
    text: "Strength does not come from winning. Your struggles develop your strengths.",
    author: "Arnold Schwarzenegger"
  },
  {
    text: "Success isn't always about greatness. It's about consistency.",
    author: "Dwayne \"The Rock\" Johnson"
  }
];

const WisdomOfLegends = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Set up auto-rotation with extended timing to 3.5 seconds (3500ms)
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3500);

    // Monitor current slide
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() || 0);
    };

    api.on("select", onSelect);
    
    // Clean up
    return () => {
      clearInterval(interval);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section 
      ref={sectionRef} 
      id="wisdom-legends" 
      className="py-20 md:py-28 lg:py-32 bg-gradient-to-r from-white via-[#FCFCFC] to-white"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-16", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              TRAIN LIKE LEGENDS
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                isInView ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>
          
          <div className="h-[210px] md:h-[240px] flex flex-col justify-center">
            <Carousel
              setApi={setApi}
              opts={{ 
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {quotes.map((quote, index) => (
                  <CarouselItem key={index} className="flex justify-center">
                    <div className={cn(
                      "max-w-2xl text-center transition-all duration-700 ease-in-out",
                      current === index ? "opacity-100" : "opacity-0"
                    )}>
                      <p className="font-playfair text-lg md:text-xl lg:text-2xl text-black font-normal leading-relaxed mb-8">
                        <span className="text-yellow-400 text-[0.95em]">❝</span> {quote.text} <span className="text-yellow-400 text-[0.95em]">❞</span>
                      </p>
                      <p className="text-base md:text-lg italic text-[#FFD756] tracking-wide" style={{ fontSize: "85%" }}>
                        — {quote.author}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WisdomOfLegends;
