
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const CheatSystemSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        {/* Added section title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-[27px]">
            TRAINING HACKS
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000 scale-x-100"></span>
          </h2>
        </div>

        <div className={cn("max-w-6xl mx-auto", isMobile ? "flex flex-col space-y-6" : "flex flex-row-reverse items-center gap-8")}>
          {/* Image Column - moved to right side and made smaller */}
          <div className={cn("flex justify-center", isMobile ? "w-full" : "w-2/5" // Reduced from 1/2 to 2/5 (~20% smaller)
        )}>
            <div className={cn("overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg", isMobile ? "w-full max-w-md" : "w-full max-w-[360px]" // Reduced from 450px to 360px (~20% smaller)
          )}>
              <img 
                src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746825853/Screenshot_216_jbzehx.png" 
                alt="Cheat System Muscle Building" 
                className="w-full h-auto object-cover" 
                loading="lazy" 
                width={360} 
                height={320} 
                srcSet="
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_360/v1746825853/Screenshot_216_jbzehx.png 360w,
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_560/v1746825853/Screenshot_216_jbzehx.png 560w
                " 
                sizes="(max-width: 768px) 100vw, 360px" 
              />
            </div>
          </div>
          
          {/* Text Column - moved to left side */}
          <div className={cn("flex flex-col", isMobile ? "w-full text-center space-y-4" : "w-3/5 text-left space-y-6" // Increased from 1/2 to 3/5 to accommodate image size change
        )}>
            
            {/* Mobile - semibold text for "The bundle includes..." */}
            <p className={cn("text-gray-700", 
              isMobile ? "text-base font-semibold" : "text-base md:text-lg"
            )}>
              The bundle includes a private cheat system most people never discover.
            </p>
            
            {/* Updated bullet points */}
            <ul className={cn(
              "space-y-3", 
              !isMobile && "mt-1" // Add margin top on desktop
            )}>
              {/* Changed the order and text of bullet points */}
              {[
                "NO PRESSURE", 
                "15 MINUTES A DAY", 
                "LEAN MUSCLE ONLY"
              ].map((point, index) => (
                <li key={index} className={cn(
                  "flex items-center gap-3",
                  !isMobile && "text-[16px] font-semibold" // Desktop specific styling to match screenshot
                )}>
                  <div className="w-5 h-5 bg-yellow rounded-full p-1 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow rounded-full"></div>
                  </div>
                  <span className="text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-2">
              {/* Empty div kept for consistent spacing */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheatSystemSection;
