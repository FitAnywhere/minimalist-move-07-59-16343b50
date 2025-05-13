
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
const CheatSystemSection = () => {
  const isMobile = useIsMobile();
  return <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-[27px]">
            TIME HACKS
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000 scale-x-100"></span>
          </h2>
        </div>

        {/* Desktop: Image on right, text on left
            Mobile: Title > Subtitle > Image > Bullet points */}
        <div className={cn("max-w-6xl mx-auto", isMobile ? "flex flex-col space-y-4" : "flex flex-row-reverse items-center gap-3")}>
          {/* Subtitle text - Mobile only */}
          <div className={cn(isMobile ? "w-full text-center order-2 mb-1" : "hidden")}>
            <p className="text-base font-semibold text-gray-700">This 15-min system turns excuses into muscle</p>
          </div>
          
          {/* Image Column */}
          <div className={cn("flex justify-center", isMobile ? "w-full order-3 mt-3" : "w-2/5")}>
            <div className={cn("overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg", isMobile ? "w-full max-w-md" : "w-full max-w-[360px]")}>
              <img src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747157019/Izdelek_brez_naslova_-_2025-05-13T190431.867_lhxus6.png" alt="Time Hacks System" className="w-full h-auto object-cover" loading="lazy" width={360} height={320} srcSet="
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_360/v1747157019/Izdelek_brez_naslova_-_2025-05-13T190431.867_lhxus6.png 360w,
                  https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_560/v1747157019/Izdelek_brez_naslova_-_2025-05-13T190431.867_lhxus6.png 560w
                " sizes="(max-width: 768px) 100vw, 360px" />
            </div>
          </div>
          
          {/* Text Column - Desktop version includes subtitle + bullets, Mobile only bullets */}
          <div className={cn("flex flex-col", isMobile ? "w-full text-center space-y-4 order-4" : "w-3/5 text-left space-y-4 pl-6")}>
            
            {/* Subtitle text - Desktop only */}
            {!isMobile && <p className="text-xl font-medium text-gray-700 mt-0 pt-0">This 15-min system turns excuses into muscle</p>}
            
            {/* Updated bullet points with smaller dots */}
            <ul className={cn("space-y-3", !isMobile && "mt-1 ml-4")}>
              {["Exclusive access for private gym owners", "Engineered for gains not wasted hours", "93% said it changed their life forever"].map((point, index) => <li key={index} className={cn("flex items-center gap-3", !isMobile && "text-[16px] font-semibold")}>
                  {/* Smaller bullet points */}
                  <div className="w-4 h-4 bg-yellow rounded-full flex-shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                  </div>
                  <span className="text-gray-800">{point}</span>
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
