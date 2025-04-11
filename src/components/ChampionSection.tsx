import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Video, Clock, Dumbbell, Globe } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import VideoPlayer from '@/components/ui/VideoPlayer';

const ChampionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showLibraryAccess, setShowLibraryAccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (isInView && titleRef.current) {
      setTimeout(() => {
        titleRef.current?.classList.add('underline-animation');
      }, 300);
    }
  }, [isInView]);

  useEffect(() => {
    if (!document.getElementById('vimeo-player-script')) {
      const script = document.createElement('script');
      script.id = 'vimeo-player-script';
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowLibraryAccess(false);
    alert("Thank you! Access to the video library will be sent to your email.");
  };

  return <section id="video-library" ref={sectionRef} className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <h2 ref={titleRef} className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
                  TRAINING LIBRARY
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
              </div>
              
              <div className="space-y-5">
                
                <div className={cn("flex items-start gap-3 transform transition-all duration-500", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")} style={{
                transitionDelay: "200ms"
              }}>
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Clock className="h-5 w-5 text-yellow" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      20 MINUTE SESSIONS
                    </p>
                  </div>
                </div>
                
                <div className={cn("flex items-start gap-3 transform transition-all duration-500", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")} style={{
                transitionDelay: "300ms"
              }}>
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Dumbbell className="h-5 w-5 text-yellow" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      ADAPTS TO YOU
                    </p>
                  </div>
                </div>
                
                <div className={cn("flex items-start gap-3 transform transition-all duration-500", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")} style={{
                transitionDelay: "400ms"
              }}>
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <Globe className="h-5 w-5 text-yellow" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      ANYTIME, ANYWHERE
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 italic font-medium leading-relaxed mt-2 md:block hidden">
                Training that fits your lifestyle. Exactly how it should be.
              </p>
            </div>
            
            <div className="relative perspective">
              <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group" ref={videoRef}>
                <VideoPlayer 
                  src="/114 Librarytraining 1144.mp4" 
                  poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744095736/dZZFMFQ_oped40.png"
                  aspectRatio="video"
                  className="rounded-2xl"
                  autoPlay={isInView}
                  muted={true}
                  loop={true}
                  preload="metadata"
                />
                
                <div className="absolute inset-0 border-2 border-yellow rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
              </div>
              
              <p className="text-lg text-gray-700 italic font-medium leading-relaxed mt-4 md:hidden block text-center">Training that fits your lifestyle</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showLibraryAccess} onOpenChange={setShowLibraryAccess}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Get Access to the Full Video Library
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-8 md:grid-cols-2 mt-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
              <VideoPlayer 
                src="/114 Librarytraining 1144.mp4" 
                poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744095736/dZZFMFQ_oped40.png"
                aspectRatio="video"
                autoPlay={false}
                muted={false}
                loop={false}
                controls={true}
                className="rounded-lg"
              />
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow" placeholder="Enter your name" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow" placeholder="Enter your email" />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-yellow hover:bg-yellow-dark text-black font-bold py-3 rounded-md">
                    Get Instant Access
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};
export default ChampionSection;
