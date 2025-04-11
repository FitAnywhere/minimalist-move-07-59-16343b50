
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Flame, Backpack, Zap } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play } from 'lucide-react';

const bandsFeatures = [{
  title: "10x MORE EXERCISES",
  description: "Push past plateaus, and keep progressing.",
  icon: Flame
}, {
  title: "SUPPORT WHEN NEEDED",
  description: "Unfold, clip in, and train—whether at home or on the go.",
  icon: Backpack
}, {
  title: "CHALLENGE WHEN READY",
  description: "From first reps to peak performance—bands move with you.",
  icon: Zap
}];

const ProductTabs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bandsVideoRef = useRef<HTMLDivElement>(null);
  const bandsTextRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isInView = useInView(sectionRef);
  const isBandsVideoInView = useInView(bandsVideoRef, {
    threshold: 0.3
  });
  const isBandsTextInView = useInView(bandsTextRef, {
    threshold: 0.2
  });
  const isMobile = useIsMobile();
  
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const renderBandsVideo = () => {
    return (
      <div className="w-full h-full overflow-hidden relative" style={{
        maxWidth: '80%',
        margin: '0 auto'
      }}>
        <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-2xl">
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              preload="metadata"
              muted
              playsInline
              loop
              className="w-full h-full object-cover"
              poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744112763/bandds_u9bzkl.png"
            >
              <source src="/114 Trxbands 11044.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={handlePlayClick}
              >
                <button 
                  className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 text-black ml-1" />
                </button>
              </div>
            )}
          </div>
        </AspectRatio>
      </div>
    );
  };

  return <section id="accessories" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              MAXIMIZE YOUR EXPERIENCE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            <p className="mt-4 text-gray-700 font-medium text-xl py-[13px]">More exercises for beginners and pros - with TRX & BANDS</p>
          </div>
          
          <div className="opacity-100 translate-x-0">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className={cn("space-y-6", isMobile ? "order-2" : "order-1")}>
                <div ref={bandsTextRef} className="relative space-y-2 mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 leading-tight tracking-wider" style={{
                  background: 'linear-gradient(to bottom, #E6B800, #000000)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: "1.5px"
                }}>
                    ADAPTIVE FOR EVERY LEVEL
                  </h3>
                </div>
                
                <div className="space-y-8 mb-6 relative z-10 my-[69px] py-[35px] px-0 mx-0">
                  {bandsFeatures.map((feature, index) => <div key={index} className="flex items-start gap-3">
                      <span className="text-transparent bg-gradient-to-b from-yellow-dark to-black bg-clip-text font-medium" style={{
                    letterSpacing: "1px"
                  }}>-</span>
                      <p className="text-gray-800 text-lg font-medium tracking-wide" style={{
                    letterSpacing: "1.2px",
                    color: "#333333"
                  }}>
                        {feature.title}
                      </p>
                    </div>)}
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
