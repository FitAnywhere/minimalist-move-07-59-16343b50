import React, { useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import FitAnywherePricingDemo from '@/components/ui/pricing-component';

const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  useEffect(() => {
    if (isInView) {
      console.log('BundleOffer section is in view');
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className={cn(
            "transition-all duration-1000 transform",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 relative inline-block">
              NO EXCUSES
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                isInView ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Get everything you need to start your fitness journey today.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6 w-full mt-6">
              <FitAnywherePricingDemo />
            </div>

          <div className={cn(
            "transition-all duration-1000 transform mt-12",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )} style={{ animationDelay: "200ms" }}>
            <p className="text-sm text-gray-500">
              Limited time offer. Don't miss out!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleOffer;
