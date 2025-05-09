
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

const CheatSystemSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className={cn(
          "max-w-6xl mx-auto",
          isMobile ? "flex flex-col space-y-6" : "flex flex-row items-center gap-8"
        )}>
          {/* Image Column */}
          <div className={cn(
            "flex justify-center",
            isMobile ? "w-full" : "w-1/2"
          )}>
            <div className={cn(
              "overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg",
              isMobile ? "w-full max-w-md" : "w-full max-w-[450px]"
            )}>
              <img 
                src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746821907/Screenshot_213_sjtb3a.png" 
                alt="Cheat System Muscle Building" 
                className="w-full h-auto object-cover"
                loading="lazy"
                width={450}
                height={400}
                srcSet="
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_450/v1746821907/Screenshot_213_sjtb3a.png 450w,
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_700/v1746821907/Screenshot_213_sjtb3a.png 700w
                "
                sizes="(max-width: 768px) 100vw, 450px"
              />
            </div>
          </div>
          
          {/* Text Column */}
          <div className={cn(
            "flex flex-col",
            isMobile ? "w-full text-center space-y-4" : "w-1/2 text-left space-y-6"
          )}>
            <h3 className="text-2xl md:text-3xl font-bold text-black">
              Shortcut to Lean Muscle in 15 Minutes a Day
            </h3>
            
            <p className="text-gray-700 text-base md:text-lg">
              The bundle includes a private cheat system most people never discover.
            </p>
            
            <ul className="space-y-3">
              {[
                "Fast-track results for beginners",
                "Just 15 minutes/day",
                "No gym, no pressure, pure gains"
              ].map((point, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
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
