
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';

const ChampionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  
  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Video Column */}
            <div className={cn(
              "transform transition-all duration-1000", 
              isInView ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            )}>
              <div className="rounded-xl overflow-hidden shadow-lg relative">
                <video 
                  className="w-full h-auto" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src="/321.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            
            {/* Content Column */}
            <div className={cn(
              "space-y-6 transition-all duration-1000 delay-300", 
              isInView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            )}>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
                  FAVORITE WORKOUT
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform scale-x-100"></span>
                </h2>
                
                <div className="mt-8 space-y-4">
                  <p className="text-lg md:text-xl text-gray-800">
                    🔥 Mind sharpens, your body follows
                  </p>
                  <p className="text-lg md:text-xl text-gray-800">
                    ⚡ Designed for your space
                  </p>
                  <p className="text-lg md:text-xl text-gray-800">
                    ⏳ Minimal effort for maximum impact
                  </p>
                </div>
                
                <div className="mt-6 italic text-gray-700 text-lg">
                  When time is limited, execution must be flawless.
                </div>
                
                <div className="mt-8">
                  <a 
                    href="#order" 
                    className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-6 py-3 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                  >
                    GET YOUR BUNDLE NOW
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChampionSection;
