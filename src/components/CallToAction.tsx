import { useRef } from 'react';
import { useInView, useParallax } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef);

  // Set up parallax effect
  useParallax(backgroundRef, 0.05);
  return <section id="order" ref={sectionRef} className="relative py-24 bg-black text-white overflow-hidden">
      {/* Parallax Background */}
      <div ref={backgroundRef} className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-yellow/10 z-10"></div>
        <img src="https://images.unsplash.com/photo-1458668383970-8ddd3927deed" alt="Minimalist background" className="w-full h-full object-cover" />
      </div>
      
      <div className="container relative z-20 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={cn("transition-all duration-1000", isInView ? "opacity-100" : "opacity-0 translate-y-10")}>
            
            
            <h2 className="text-white mb-6">YOUR NEW LIFESTYLE AWAITS</h2>
            
            
            
            <div className={cn("transition-all duration-1000 delay-300", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
              <a href="#order" className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-5 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 button-glow group">
                ORDER NOW – Limited Stock Available!
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              
              <p className="mt-6 text-sm text-white/60">*Limited shippings to Netherlands.</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;