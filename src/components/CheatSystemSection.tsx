import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
const CheatSystemSection = () => {
  const isMobile = useIsMobile();
  return <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-[27px]">
            MUSCLE HACKS
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000 scale-x-100"></span>
          </h2>
        </div>

        <div className={cn("max-w-6xl mx-auto", isMobile ? "flex flex-col space-y-6" : "flex flex-row-reverse items-center gap-8")}>
          {/* Image Column - on the right for desktop */}
          <div className={cn("flex justify-center", isMobile ? "w-full" : "w-2/5")}>
            <div className={cn("overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg", isMobile ? "w-full max-w-md" : "w-full max-w-[360px]")}>
              <img src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747052494/15min_gains_uh8mgq.png" alt="Muscle Hacks System" className="w-full h-auto object-cover" loading="lazy" width={360} height={320} srcSet="
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_360/v1747052494/15min_gains_uh8mgq.png 360w,
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_560/v1747052494/15min_gains_uh8mgq.png 560w
                " sizes="(max-width: 768px) 100vw, 360px" />
            </div>
          </div>
          
          {/* Text Column - on the left for desktop */}
          <div className={cn("flex flex-col", isMobile ? "w-full text-center space-y-4" : "w-3/5 text-left space-y-6 pl-4")}>
            
            {/* Text styling differs between mobile and desktop */}
            
            
            <p className={cn("text-gray-700", isMobile ? "text-base font-medium" : "text-lg font-medium")}>93% say this cheat code changed everything</p>
            
            {/* Updated bullet points with smaller dots */}
            <ul className={cn("space-y-3", !isMobile && "mt-1")}>
              {["Visible results in 2 weeks (avg. from customer data)", "Built for beginners with zero gym history", "Only unlocked after ordering — no separate access"].map((point, index) => <li key={index} className={cn("flex items-center gap-3", !isMobile && "text-[16px] font-semibold")}>
                  {/* Smaller bullet points (20-30% reduced) */}
                  <div className="w-4 h-4 bg-yellow rounded-full flex-shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                  </div>
                  <span className="text-gray-800 px-[6px]">{point}</span>
                </li>)}
            </ul>
            
            <div className="pt-2">
              {/* Empty div kept for consistent spacing */}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CheatSystemSection;