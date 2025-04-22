
import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoPlayer from '@/components/ui/VideoPlayer';

const bandsFeatures = [{
  title: "7X MORE EXERCISES",
  description: "With elastic bands for optimal progression.",
  icon: null
}, {
  title: "SUPPORT WHEN NEEDED",
  description: "Never feel stuck or overwhelmed.",
  icon: null
}, {
  title: "CHALLENGE WHEN READY",
  description: "Move forward at your pace.",
  icon: null
}];

const ProductTabs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bandsVideoRef = useRef<HTMLDivElement>(null);
  const bandsTextRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef);
  const isBandsVideoInView = useInView(bandsVideoRef, {
    threshold: 0.3
  });
  const isBandsTextInView = useInView(bandsTextRef, {
    threshold: 0.2
  });
  const isMobile = useIsMobile();

  const renderBandsVideo = useCallback(() => {
    return <div className="w-full h-full overflow-hidden relative" style={{
      maxWidth: '80%',
      margin: '0 auto'
    }}>
        <div className="rounded-2xl overflow-hidden">
          <VideoPlayer 
            src="/bands224.mp4" 
            poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744112763/bandds_u9bzkl.png" 
            aspectRatio="portrait" 
            autoPlay={isBandsVideoInView} 
            muted={true} 
            loop={true} 
            playMode="onView" 
            width={400} 
            height={720} 
            preload="none" 
          />
        </div>
      </div>;
  }, [isBandsVideoInView]);

  return <section id="accessories" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              MAXIMIZE YOUR EXPERIENCE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            <p className="mt-4 text-gray-700 font-medium text-xl py-[13px]">ADAPTS TO YOUR FITNESS LEVEL</p>
          </div>
          
          <div className="opacity-100 translate-x-0">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className={cn("space-y-6", isMobile ? "order-2" : "order-1")}>
                <div ref={bandsTextRef} className="relative space-y-2 mb-6">
                </div>
                
                <div className="space-y-8 mb-6 relative z-10 my-[69px] py-[35px] px-0 mx-0">
                  {bandsFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex items-start gap-3">
                        <span className="text-transparent bg-gradient-to-b from-yellow-dark to-black bg-clip-text font-medium" style={{
                          letterSpacing: "1px"
                        }}>-</span>
                        <p className="text-xl md:text-2xl font-bold leading-tight tracking-wider" style={{
                          background: 'linear-gradient(to bottom, #E6B800, #000000)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          color: 'transparent',
                          letterSpacing: "1.5px"
                        }}>
                          {feature.title}
                        </p>
                      </div>
                      <p className="text-gray-800 text-lg font-medium tracking-wide ml-6" style={{
                        letterSpacing: "1.2px",
                        color: "#333333"
                      }}>
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div ref={bandsVideoRef} className={cn("transition-all duration-700", isMobile ? "order-1" : "order-2")}>
                {renderBandsVideo()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default ProductTabs;
