import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Zap, ChevronDown, ChevronUp, Flame, Backpack } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const trxVideo = useRef<HTMLVideoElement>(null);
  const bandsVideo = useRef<HTMLVideoElement>(null);
  
  const [trxVideoError, setTrxVideoError] = useState(false);
  const [bandsVideoError, setBandsVideoError] = useState(false);
  const [trxRetryCount, setTrxRetryCount] = useState(0);
  const [bandsRetryCount, setBandsRetryCount] = useState(0);
  
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

  // TRX video loading and error handling
  useEffect(() => {
    if (trxVideo.current && isVideoInView) {
      const video = trxVideo.current;
      
      const loadVideo = () => {
        console.log("Loading TRX video with retry count:", trxRetryCount);
        // Clear src and reload to force a fresh attempt
        video.src = '';
        video.load();
        
        // Small delay before setting source
        setTimeout(() => {
          // Set the new src
          video.src = '/TRXX.mp4';
        }, 100);
      };
      
      const handleCanPlay = () => {
        setTrxVideoError(false);
        console.log("TRX video can play now");
      };
      
      const handleError = (e: Event) => {
        console.error("TRX video error:", e);
        
        // Implement retry logic
        if (trxRetryCount < 3) {
          console.log("Retrying TRX video load, attempt:", trxRetryCount + 1);
          setTrxRetryCount(prevCount => prevCount + 1);
          
          // Try again after a short delay
          setTimeout(() => {
            loadVideo();
          }, 1000);
        } else {
          setTrxVideoError(true);
        }
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      loadVideo();

      // Small delay to ensure loading has started
      const playAttempt = setTimeout(() => {
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("TRX video play error:", error);
              if (error.name !== 'NotAllowedError') {
                if (trxRetryCount >= 3) {
                  setTrxVideoError(true);
                }
              }
            });
          }
        }
      }, 300);
      
      return () => {
        clearTimeout(playAttempt);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.pause();
      };
    }
  }, [isVideoInView, activeTab, trxRetryCount]);

  // Bands video loading and error handling
  useEffect(() => {
    if (bandsVideo.current && isBandsVideoInView) {
      const video = bandsVideo.current;
      
      const loadVideo = () => {
        console.log("Loading Bands video with retry count:", bandsRetryCount);
        // Clear src and reload to force a fresh attempt
        video.src = '';
        video.load();
        
        // Small delay before setting source
        setTimeout(() => {
          // Set the new src
          video.src = '/bands.mp4';
        }, 100);
      };
      
      const handleCanPlay = () => {
        setBandsVideoError(false);
        console.log("Bands video can play now");
      };
      
      const handleError = (e: Event) => {
        console.error("Bands video error:", e);
        
        // Implement retry logic
        if (bandsRetryCount < 3) {
          console.log("Retrying Bands video load, attempt:", bandsRetryCount + 1);
          setBandsRetryCount(prevCount => prevCount + 1);
          
          // Try again after a short delay
          setTimeout(() => {
            loadVideo();
          }, 1000);
        } else {
          setBandsVideoError(true);
        }
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      loadVideo();

      // Small delay to ensure loading has started
      const playAttempt = setTimeout(() => {
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Bands video play error:", error);
              if (error.name !== 'NotAllowedError') {
                if (bandsRetryCount >= 3) {
                  setBandsVideoError(true);
                }
              }
            });
          }
        }
      }, 300);
      
      return () => {
        clearTimeout(playAttempt);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.pause();
      };
    }
  }, [isBandsVideoInView, activeTab, bandsRetryCount]);

  // Reset retry counts when tab changes
  useEffect(() => {
    setTrxRetryCount(0);
    setBandsRetryCount(0);
  }, [activeTab]);

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
                  "rounded-2xl overflow-hidden transition-all duration-700", 
                  isVideoInView ? "shadow-[0_0_20px_rgba(255,215,0,0.2)]" : "shadow-lg", 
                  isVideoInView ? "scale-[1.02]" : "scale-100",
                  isMobile ? "order-1" : "order-2"
                )}
              >
                {trxVideoError ? (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Video unavailable</p>
                  </div>
                ) : (
                  <video 
                    ref={trxVideo}
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-1000", 
                      isVideoInView ? "scale-[1.05]" : "scale-100"
                    )} 
                  />
                )}
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
                  "rounded-2xl overflow-hidden transition-all duration-700", 
                  isBandsVideoInView ? "shadow-[0_0_20px_rgba(255,215,0,0.2)]" : "shadow-lg", 
                  isBandsVideoInView ? "scale-[1.02]" : "scale-100",
                  isMobile ? "order-1" : "order-2"
                )}
              >
                {bandsVideoError ? (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Video unavailable</p>
                  </div>
                ) : (
                  <video 
                    ref={bandsVideo}
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-1000", 
                      isBandsVideoInView ? "scale-[1.05]" : "scale-100"
                    )} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
