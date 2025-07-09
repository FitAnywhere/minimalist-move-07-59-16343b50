
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';

const TrainSmart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    content: false,
    carousel: false
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843343/52_gllnot.png",
    "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/54_vqvmdl.png",
    "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843343/51_oorfmr.png",
    "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/55_uojy1l.png",
    "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/50_vomtqy.png",
    "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/53_qhgfx6.png"
  ];

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({ ...prev, title: true })), 100);
      setTimeout(() => setAnimationState(prev => ({ ...prev, content: true })), 300);
      setTimeout(() => setAnimationState(prev => ({ ...prev, carousel: true })), 500);
    }
  }, [isInView]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          {isMobile && (
            <div className="space-y-8">
              {/* Title */}
              <div className={cn("text-center transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <h2 className="text-3xl font-bold text-black mb-4 relative inline-block">
                  TRAIN SMART
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
              </div>

              {/* Carousel */}
              <div className={cn("flex justify-center transition-all duration-1000", animationState.carousel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative w-full max-w-[300px] aspect-square overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <div
                      key={image}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-1000",
                        currentImageIndex === index ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <img
                        src={image}
                        alt={`Training image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className={cn("text-center space-y-6 transition-all duration-1000", animationState.content ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-black">ENDLESS EXERCISES?</p>
                      <p className="text-gray-600 italic">That's okay.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-black">REAL STRENGTH?</p>
                      <p className="text-gray-600 italic">Few moves done right.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <p className="text-lg text-black">Your coach gives you the plan.</p>
                  <p className="text-lg text-black">You give 15 minutes.</p>
                  <p className="text-xl font-bold text-black mt-4">THAT'S HOW YOU WIN</p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop & Tablet Layout */}
          {!isMobile && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8">
                {/* Title */}
                <div className={cn("transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <h2 className="text-4xl lg:text-5xl font-bold text-black mb-8 relative inline-block">
                    TRAIN SMART
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                </div>

                {/* Content */}
                <div className={cn("space-y-6 transition-all duration-1000", animationState.content ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-xl font-bold text-black">ENDLESS EXERCISES?</p>
                        <p className="text-gray-600 italic text-lg">That's okay.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-xl font-bold text-black">REAL STRENGTH?</p>
                        <p className="text-gray-600 italic text-lg">Few moves done right.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <p className="text-xl text-black">Your coach gives you the plan.</p>
                    <p className="text-xl text-black">You give 15 minutes.</p>
                    <p className="text-2xl font-bold text-black mt-6">THAT'S HOW YOU WIN</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Carousel */}
              <div className={cn("flex justify-center transition-all duration-1000", animationState.carousel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative w-full max-w-[400px] aspect-square overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <div
                      key={image}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-1000",
                        currentImageIndex === index ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <img
                        src={image}
                        alt={`Training image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrainSmart;
