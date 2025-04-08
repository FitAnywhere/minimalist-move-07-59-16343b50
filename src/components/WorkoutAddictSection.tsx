import { useRef, useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, X, Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import VimeoThumbnailPlayer from '@/components/ui/VimeoThumbnailPlayer';

interface LifestyleFeature {
  title: string;
  description: string;
}

interface VimeoPlayerAPI {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setLoop: (loop: boolean) => Promise<void>;
  setAutopause: (autopause: boolean) => Promise<void>;
  loadVideo: (videoId: number) => Promise<void>;
  ready: () => Promise<void>;
  destroy: () => void;
}

const lifestyleFeatures: LifestyleFeature[] = [{
  title: "FEEL UNSTOPPABLE",
  description: "Tap into boundless energy to train like never before."
}, {
  title: "GLOW WITH CONFIDENCE",
  description: "Walk with energy and unstoppable self-belief."
}, {
  title: "WORKOUT YOU'LL ACTUALLY LOVE",
  description: "It's addictive in the best way possible."
}];

const WorkoutAddictSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);
  const vimeoIframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerAPI | null>(null);
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const isMobile = useIsMobile();
  
  const isInView = useInView(sectionRef, {
    threshold: 0.2,
    once: false
  });

  const toggleFeature = (index: number) => {
    setOpenFeatureIndex(prev => prev === index ? null : index);
  };

  useEffect(() => {
    if (isInView && titleRef.current) {
      setTimeout(() => {
        titleRef.current?.classList.add('underline-animation');
      }, 300);
    }
  }, [isInView]);

  return (
    <section id="workout-addict" ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 ref={titleRef} className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              BECOME A WORKOUT ADDICT
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              Experience what it feels like when fitness becomes an obsession in the best possible way.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={cn(
              "relative order-2 md:order-1 transition-all duration-700 transform",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div style={{ padding: '177.78% 0 0 0', position: 'relative' }}>
                  <VimeoThumbnailPlayer
                    vimeoId="1073531176"
                    thumbnailUrl="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744097748/Screenshot_72_ggjdho.png"
                    aspectRatio="9:16"
                    background={true}
                    muted={true}
                    loop={true}
                    autoplay={true}
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
            
            <div className={cn(
              "order-1 md:order-2 space-y-6 transition-all duration-700 transform",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  UNLOCK YOUR POTENTIAL
                </h3>
                <p className="text-gray-700">
                  Break free from limitations and experience what your body is truly capable of.
                </p>
              </div>
              
              <div className="space-y-4">
                {lifestyleFeatures.map((feature, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <div 
                      className="flex justify-between items-center cursor-pointer group"
                      onClick={() => toggleFeature(index)}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <h4 className="font-bold text-lg text-gray-800">
                        {feature.title}
                      </h4>
                      <div className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-full transition-all",
                        hoverIndex === index ? "bg-yellow-100" : "bg-gray-100"
                      )}>
                        {openFeatureIndex === index ? 
                          <ChevronDown className="h-4 w-4 text-gray-600" /> : 
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        }
                      </div>
                    </div>
                    
                    {openFeatureIndex === index && (
                      <div className="mt-2 text-gray-600 animate-accordion-down">
                        {feature.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => setShowSpecs(true)}
                className="bg-yellow hover:bg-yellow-dark text-black font-bold uppercase"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showSpecs} onOpenChange={setShowSpecs}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Join the Workout Revolution
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </DialogClose>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <VimeoThumbnailPlayer
                vimeoId="1073531176"
                thumbnailUrl="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744097748/Screenshot_72_ggjdho.png"
                aspectRatio="16:9"
                background={false}
                muted={false}
                loop={true}
                autoplay={true}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Transform Your Body and Mind</h3>
              <p className="text-gray-600">
                FitAnywhere makes working out addictive in the healthiest way possible. Experience the rush of endorphins and watch as fitness becomes a natural part of your daily routine.
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  </div>
                  <span className="text-gray-700">Consistent daily workouts</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  </div>
                  <span className="text-gray-700">Noticeable results in weeks</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  </div>
                  <span className="text-gray-700">Mental clarity and focus</span>
                </li>
              </ul>
              
              <Button className="w-full bg-yellow hover:bg-yellow-dark text-black font-bold">
                Reserve Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WorkoutAddictSection;
