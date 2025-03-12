import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, X, Play } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [videoPlaying, setVideoPlaying] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInView(heroRef, {}, false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Video data
  const videos = [{
    id: 1,
    title: "Power Tower Demo",
    thumbnail: "https://images.unsplash.com/photo-1597076545197-1a3133fbae9a?auto=format&fit=crop&q=80&w=800",
    url: "https://drive.google.com/file/d/1W3WMcUlbZZTbmyIPTl5-ofAwwHaEOaIj/preview"
  }, {
    id: 2,
    title: "Home Workout Routine",
    thumbnail: "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=800",
    url: "https://drive.google.com/file/d/1qGpP3vTxkZhHm5LfxMI0hcybV7t2W0g8/preview"
  }];
  return <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      {/* Content Container */}
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 ref={headlineRef} className={cn("transition-all duration-1000 font-bold text-black", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>GYM IN A BOX</h1>
            
            <p ref={subheadlineRef} className={cn("mt-6 text-xl md:text-2xl transition-all duration-1000 delay-200 text-gray-800", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>Everything you need
Fitness + Calesthenics + Cardio </p>
            
            <div ref={ctaRef} className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <a href="#order" className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow">
                GET THE COMPLETE BUNDLE NOW
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <p className="mt-4 text-sm text-gray-600">
                Launching Spring 2025
              </p>
            </div>
          </div>
          
          {/* Right Column - Videos */}
          <div className={cn("order-1 md:order-2 transition-all duration-1000 delay-300", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            {/* Desktop - Side by side videos */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              {videos.map(video => <div key={video.id} className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1" onClick={() => setVideoPlaying(video.id)}>
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <Play size={42} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center">
                    {video.title}
                  </p>
                </div>)}
            </div>
            
            {/* Mobile - Carousel/Stacked videos */}
            <div className="md:hidden space-y-4">
              {videos.map(video => <div key={video.id} className="relative cursor-pointer rounded-xl overflow-hidden shadow-md" onClick={() => setVideoPlaying(video.id)}>
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white/80 rounded-full p-3">
                        <Play size={32} className="text-black" />
                      </div>
                    </div>
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm text-center">
                    {video.title}
                  </p>
                </div>)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Dialog */}
      <Dialog open={videoPlaying !== null} onOpenChange={open => !open && setVideoPlaying(null)}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 bg-black border-none">
          <DialogClose className="absolute right-3 top-3 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-all">
            <X size={24} />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {videoPlaying && <div className="w-full h-full">
              <iframe src={videos.find(v => v.id === videoPlaying)?.url} width="100%" height="100%" allow="autoplay; encrypted-media" allowFullScreen title={videos.find(v => v.id === videoPlaying)?.title} className="w-full h-full"></iframe>
            </div>}
        </DialogContent>
      </Dialog>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center">
          <div className="w-1.5 h-3 bg-black/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
};
export default HeroSection;