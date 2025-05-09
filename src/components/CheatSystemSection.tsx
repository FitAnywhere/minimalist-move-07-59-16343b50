
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

        <div className={cn(
          "max-w-6xl mx-auto",
          isMobile ? "flex flex-col space-y-6" : "flex flex-row-reverse items-center gap-8"
        )}>
          {/* Image Column - moved to right side and made smaller */}
          <div className={cn(
            "flex justify-center",
            isMobile ? "w-full" : "w-2/5" // Reduced from 1/2 to 2/5 (~20% smaller)
          )}>
            <div className={cn(
              "overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg",
              isMobile ? "w-full max-w-md" : "w-full max-w-[360px]" // Reduced from 450px to 360px (~20% smaller)
            )}>
              <img 
                src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746821907/Screenshot_213_sjtb3a.png" 
                alt="Cheat System Muscle Building" 
                className="w-full h-auto object-cover"
                loading="lazy"
                width={360}
                height={320}
                srcSet="
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_360/v1746821907/Screenshot_213_sjtb3a.png 360w,
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_560/v1746821907/Screenshot_213_sjtb3a.png 560w
                "
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
          </div>
          
          {/* Text Column - moved to left side */}
          <div className={cn(
            "flex flex-col",
            isMobile ? "w-full text-center space-y-4" : "w-3/5 text-left space-y-6" // Increased from 1/2 to 3/5 to accommodate image size change
          )}>
            <h3 className="text-2xl md:text-3xl font-bold text-black">
              Get cheat system most people never discover for free.
            </h3>
            
            <p className="text-gray-700 text-base md:text-lg">
              The bundle includes a private cheat system most people never discover.
            </p>
            
            <ul className="space-y-3">
              {[
                "Lean muscle only",
                "Just 15 minutes/day",
                "No pressure, pure gains"
              ].map((point, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-yellow bg-yellow rounded-full p-1 flex-shrink-0" />
                  <span className="text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-2">
              <span className="inline-block bg-yellow py-2 px-4 rounded-full font-bold text-black text-sm md:text-base uppercase">
                EXCLUSIVE ADD-ON INCLUDED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheatSystemSection;
