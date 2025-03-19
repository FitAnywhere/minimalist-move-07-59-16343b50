import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Zap, ChevronDown, ChevronUp, Flame, Backpack } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const bandsFeatures = [
  {
    title: "SUPPORT WHEN NEEDED, CHALLENGE WHEN READY",
    description: "Push past plateaus, and keep progressing.",
    icon: Flame
  }, 
  {
    title: "SAFE ON JOINTS, TOUGH ON MUSCLES",
    description: "Unfold, clip in, and train—whether at home or on the go.",
    icon: Backpack
  },
  {
    title: "CUSTOMIZE EVERY WORKOUT",
    description: "From first reps to peak performance—bands move with you.",
    icon: Zap
  }
];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState<'trx' | 'bands'>('trx');
  const [bandsExpandedFeatures, setBandsExpandedFeatures] = useState<Record<number, boolean>>({});
  const [bulletPointsVisible, setBulletPointsVisible] = useState<boolean[]>([false, false, false]);
  
  const sectionRef = useRef<HTMLElement>(null);
  const trxVideoRef = useRef<HTMLDivElement>(null);
  const bandsVideoRef = useRef<HTMLDivElement>(null);
  const trxTextRef = useRef<HTMLDivElement>(null);
  const bandsTextRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(sectionRef);
  const isVideoInView = useInView(trxVideoRef, {
    threshold: 0.3
  });
  const isBandsVideoInView = useInView(bandsVideoRef, {
    threshold: 0.3
  });
  const isTrxTextInView = useInView(trxTextRef, {
    threshold: 0.2
  });
  const isBandsTextInView = useInView(bandsTextRef, {
    threshold: 0.2
  });
  
  const isMobile = useIsMobile();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!window.Vimeo && !isScriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else if (window.Vimeo) {
      setIsScriptLoaded(true);
    }
    
    const videoIds = ['1067257145', '1067257124'];
    
    videoIds.forEach(videoId => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = `https://player.vimeo.com/video/${videoId}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, [isScriptLoaded]);

  useEffect(() => {
    if (isTrxTextInView) {
      const timers = [0, 200, 400].map((delay, index) => 
        setTimeout(() => {
          setBulletPointsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, delay)
      );
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isTrxTextInView]);

  const renderTrxVimeoVideo = () => {
    return (
      <div className="w-full h-full overflow-hidden relative" style={{ maxWidth: '80%', margin: '0 auto' }}>
        <AspectRatio ratio={3/4} className="overflow-hidden rounded-2xl">
          <iframe 
            src="https://player.vimeo.com/video/1067257145?h=45e88fd96b&title=0&byline=0&portrait=0&badge=0&autopause=0&background=1&muted=1&loop=1&autoplay=1&preload=auto"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
            className="w-full h-full absolute inset-0"
            title="TRX video"
            style={{ border: 'none' }}
            loading="eager"
            fetchpriority="high"
          ></iframe>
        </AspectRatio>
      </div>
    );
  };

  const renderBandsVimeoVideo = () => {
    return (
      <div className="w-full h-full overflow-hidden relative" style={{ maxWidth: '80%', margin: '0 auto' }}>
        <AspectRatio ratio={3/4} className="overflow-hidden rounded-2xl">
          <iframe 
            src="https://player.vimeo.com/video/1067257124?h=1c3b52f7d4&title=0&byline=0&portrait=0&badge=0&autopause=0&background=1&muted=1&loop=1&autoplay=1&preload=auto" 
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
            className="w-full h-full absolute inset-0"
            title="Bands video"
            style={{ border: 'none' }}
            loading="eager"
            fetchpriority="high"
          ></iframe>
        </AspectRatio>
      </div>
    );
  };

  const toggleBandsFeature = (index: number) => {
    setBandsExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const areAllBandsFeaturesExpanded = () => {
    return bandsFeatures.every((_, index) => bandsExpandedFeatures[index]);
  };

  return (
    <section id="accessories" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn(
            "text-center mb-12 transition-all duration-700", 
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              MAXIMIZE YOUR EXPERIENCE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
          </div>
          
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-gray-200 p-1 bg-white">
              <button 
                onClick={() => setActiveTab('trx')} 
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300", 
                  activeTab === 'trx' ? "bg-yellow text-black" : "bg-transparent text-gray-600 hover:bg-gray-50"
                )}
              >
                TRX
              </button>
              <button 
                onClick={() => setActiveTab('bands')} 
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300", 
                  activeTab === 'bands' ? "bg-yellow text-black" : "bg-transparent text-gray-600 hover:bg-gray-50"
                )}
              >
                BANDS
              </button>
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-500", 
            activeTab === 'trx' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 hidden'
          )}>
            <div className={cn(
              "grid gap-8 items-center",
              isMobile ? "grid-cols-1" : "md:grid-cols-2"
            )}>
              <div 
                ref={trxVideoRef} 
                className={cn(
                  "transition-all duration-700", 
                  isMobile ? "order-1" : "order-2"
                )}
              >
                {renderTrxVimeoVideo()}
              </div>
              
              <div 
                ref={trxTextRef} 
                className={cn(
                  "space-y-8 md:pr-6",
                  isMobile ? "order-2" : "order-1"
                )}
              >
                <div className="relative space-y-2">
                  <h3 
                    className="text-xl md:text-2xl font-bold mb-6 leading-tight tracking-wider"
                    style={{ 
                      background: 'linear-gradient(to bottom, #E6B800, #000000)', 
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      letterSpacing: "1.5px"
                    }}
                  >
                    MOVE THE WAY YOUR BODY WAS BUILT TO
                  </h3>
                </div>
                
                <div className="space-y-8 md:space-y-9 mt-8 relative z-10">
                  <div className="flex items-start gap-3">
                    <span className="text-transparent bg-gradient-to-b from-yellow-dark to-black bg-clip-text font-medium" style={{ letterSpacing: "1px" }}>-</span>
                    <p className="text-gray-800 text-lg font-medium tracking-wide" style={{ letterSpacing: "1.2px", color: "#333333" }}>NO MACHINES. NO RESTRICTIONS.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-transparent bg-gradient-to-b from-yellow-dark to-black bg-clip-text font-medium" style={{ letterSpacing: "1px" }}>-</span>
                    <p className="text-gray-800 text-lg font-medium tracking-wide" style={{ letterSpacing: "1.2px", color: "#333333" }}>PULL, PUSH, OR HOLD.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-transparent bg-gradient-to-b from-yellow-dark to-black bg-clip-text font-medium" style={{ letterSpacing: "1px" }}>-</span>
                    <p className="text-gray-800 text-lg font-medium tracking-wide" style={{ letterSpacing: "1.2px", color: "#333333" }}>YOUR INTENSITY. YOUR RULES.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-500", 
            activeTab === 'bands' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 hidden'
          )}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className={cn(
                "space-y-6",
                isMobile ? "order-2" : "order-1"
              )}>
                <div 
                  ref={bandsTextRef}
                  className="relative space-y-2 mb-6"
                >
                  <h3 
                    className="text-xl md:text-2xl font-bold mb-6 leading-tight tracking-wider"
                    style={{ 
                      background: 'linear-gradient(to bottom, #E6B800, #000000)', 
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      letterSpacing: "1.5px"
                    }}
                  >
                    ADAPTIVE TRAINING FOR EVERY LEVEL
                  </h3>
                </div>
                
                <div className="space-y-8 mb-6 relative z-10">
                  {bandsFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3" 
                    >
                      <span className="text-transparent bg-gradient-to-b from-yellow-dark to-black bg-clip-text font-medium" style={{ letterSpacing: "1px" }}>-</span>
                      <p className="text-gray-800 text-lg font-medium tracking-wide" style={{ letterSpacing: "1.2px", color: "#333333" }}>
                        {feature.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div 
                ref={bandsVideoRef} 
                className={cn(
                  "transition-all duration-700", 
                  isMobile ? "order-1" : "order-2"
                )}
              >
                {renderBandsVimeoVideo()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
