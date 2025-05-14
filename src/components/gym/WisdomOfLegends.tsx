
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { Quote } from "lucide-react";

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
  const [authorVisible, setAuthorVisible] = useState(false);

  // Set up auto-rotation with timing to 3.5 seconds (3500ms)
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3500);

    // Monitor current slide
    const onSelect = () => {
      // Hide author first
      setAuthorVisible(false);
      
      // Get current slide index
      setCurrent(api.selectedScrollSnap() || 0);
      
      // Show author with delay
      setTimeout(() => {
        setAuthorVisible(true);
      }, 200); // 0.2s delay for author to fade in after quote
    };

    api.on("select", onSelect);
    
    // Make sure author is visible for first quote
    setAuthorVisible(true);
    
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
      className="py-24 md:py-[100px]"
      style={{
        background: "radial-gradient(circle, #ffffff 30%, #fffbf0 100%)"
      }}
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
          
          <div className="min-h-[180px] md:min-h-[220px] flex flex-col justify-center items-center">
            <Carousel
              setApi={setApi}
              opts={{ 
                align: "center",
                loop: true
              }}
              className="w-full"
            >
              <CarouselContent>
                {quotes.map((quote, index) => (
                  <CarouselItem key={index} className="flex justify-center">
                    <div className={cn(
                      "max-w-2xl text-center transition-all duration-700 ease-in-out px-4",
                      current === index ? "opacity-100" : "opacity-0"
                    )}>
                      <div className="mb-8">
                        <p className="font-serif text-xl md:text-2xl lg:text-[1.6em] leading-relaxed font-light text-black relative">
                          <span className="text-yellow-400 text-xl md:text-2xl absolute -left-2 md:-left-4 -top-3 md:-top-4">❝</span>
                          {quote.text}
                          <span className="text-yellow-400 text-xl md:text-2xl">❞</span>
                        </p>
                      </div>
                      
                      <div className={cn(
                        "transition-all duration-500 ease-in-out transform",
                        authorVisible && current === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      )}>
                        <p className="text-base md:text-lg italic tracking-wide text-yellow-600">
                          — {quote.author}
                        </p>
                      </div>
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
