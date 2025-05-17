import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { Quote } from "lucide-react";

interface QuoteItem {
  text: string;
  author: string;
  image: string;
}

const quotes: QuoteItem[] = [{
  text: "It's not about being the best. It's about being better than yesterday.",
  author: "Jason Statham",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747252757/14._maj_2025_21_04_44_epv4in.png"
}, {
  text: "Simplicity is the key to brilliance.",
  author: "Bruce Lee",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747255383/ChatGPT_Image_14._maj_2025_22_38_24_qlfskq.png"
}, {
  text: "I have to work out to be able to handle everything else I do.",
  author: "Jessica Alba",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747256165/Screenshot_227_c3wcsp.png"
}, {
  text: "You don't stop when you're tired. You stop when you're done.",
  author: "David Goggins",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747255383/ChatGPT_Image_14._maj_2025_22_37_21_zcuvcs.png"
}, {
  text: "Show them with your results, not your words.",
  author: "Cristiano Ronaldo",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747255384/ChatGPT_Image_14._maj_2025_22_38_07_dp40ct.png"
}, {
  text: "You don't need to overthink it. Start where you are.",
  author: "Zac Efron",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747252758/ChatGPT_Image_14._maj_2025_21_06_56_obwdn8.png"
}, {
  text: "I will not let age change me. I will change the way I age.",
  author: "Tom Brady",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747252757/ChatGPT_Image_14._maj_2025_21_01_29_vkcsoz.png"
}, {
  text: "You can have results or excuses. Not both.",
  author: "Arnold Schwarzenegger",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747255382/ChatGPT_Image_14._maj_2025_22_37_45_xwmein.png"
}, {
  text: "Some people want it to happen, some wish it would happen, others make it happen.",
  author: "Michael Jordan",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747255383/ChatGPT_Image_14._maj_2025_22_37_56_fv9vvc.png"
}, {
  text: "We do today what they won't, so tomorrow we accomplish what they can't.",
  author: "Dwayne \"The Rock\" Johnson",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747252758/ChatGPT_Image_14._maj_2025_21_00_46_tzxkua.png"
}, {
  text: "What you put into things is what you get out of them.",
  author: "Jennifer Lopez",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747255384/ChatGPT_Image_14._maj_2025_22_36_45_ajuaie.png"
}];

const WisdomOfLegends = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [authorVisible, setAuthorVisible] = useState(false);

  // Set up auto-rotation with timing to 4.5 seconds (4500ms) - 1 second slower than before
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4500);

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
  return <section ref={sectionRef} id="wisdom-legends" className="py-16 md:py-[70px]" style={{
    background: "radial-gradient(circle, #ffffff 30%, #fffbf0 100%)"
  }}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-10", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LIVE LIKE LEGENDS
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div className="min-h-[480px] md:min-h-[520px] flex flex-col justify-center items-center">
            <Carousel setApi={setApi} opts={{
            align: "center",
            loop: true
          }} className="w-full">
              <CarouselContent>
                {quotes.map((quote, index) => <CarouselItem key={index} className="flex justify-center">
                    <div className={cn("max-w-2xl text-center transition-all duration-700 ease-in-out px-4", current === index ? "opacity-100" : "opacity-0")}>
                      <div className="flex flex-col items-center">
                        <div className="mb-4">
                          <div className="text-yellow-400 text-5xl mb-2 flex justify-center">
                            ❝
                          </div>
                        </div>
                        
                        <div className="mb-5">
                          <p className="font-serif text-xl md:text-2xl lg:text-[1.6em] leading-relaxed font-light text-black">
                            {quote.text}
                          </p>
                        </div>
                        
                        {/* Moved image below quote and made it 10-20% bigger */}
                        <div className="mb-4">
                          <img src={quote.image} alt={quote.author} className="w-28 h-28 rounded-full object-cover mx-auto mb-4" />
                        </div>
                        
                        <div className={cn("transition-all duration-500 ease-in-out transform", authorVisible && current === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}>
                          <p className="text-base md:text-lg italic tracking-wide text-yellow-600">
                            — {quote.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              {/* Navigation buttons removed for desktop but kept for mobile */}
              <div className="md:hidden">
                
                
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>;
};
export default WisdomOfLegends;
