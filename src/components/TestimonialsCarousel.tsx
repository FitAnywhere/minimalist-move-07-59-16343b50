
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Quote, Star, Loader, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  mediaType: "video" | "image";
  vimeoId?: string;
  hash?: string;
  imageUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Emily T.",
    role: "Fitness Beginner",
    quote: "First time using bands seriously. Safe to say, my muscles felt it.",
    mediaType: "video",
    vimeoId: "1067256372",
    hash: "70ab6c252c"
  }, {
    name: "Jordan P.",
    role: "Calisthenics Enthusiast",
    quote: "Honestly shocked how fast this became my main workout.",
    mediaType: "image",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744112883/Screenshot_85_xnvarx.png"
  }, {
    name: "Sarah M.",
    role: "Remote Worker",
    quote: "Used to blame Zoom for no workouts. Now I sneak in 15 min wins.",
    mediaType: "image",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099088/Screenshot_76_nkxmvr.png"
  }, {
    name: "Chris L.",
    role: "Fitness Advocate",
    quote: "Modern, minimal, and our people love it.",
    mediaType: "image",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099090/Screenshot_73_tco9rh.png"
  }, {
    name: "Alex G.",
    role: "Busy Professional",
    quote: "Minimal gear. Maximum gains. Just how I like it.",
    mediaType: "image",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744097748/Screenshot_71_b7srzc.png"
  }, {
    name: "Tom S.",
    role: "Strength Seeker",
    quote: "No crowds, no pressure. Just me, music, and movement.",
    mediaType: "image",
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099087/Screenshot_77_jlxu5i.png"
  }
];

const TestimonialMedia = memo(({
  mediaType,
  vimeoId,
  hash,
  imageUrl,
  onLoaded,
  isVisible,
  isMobile,
  uniqueKey,
  onRetry
}: {
  mediaType: "video" | "image";
  vimeoId?: string;
  hash?: string;
  imageUrl?: string;
  onLoaded: (id: string) => void;
  isVisible: boolean;
  isMobile: boolean;
  uniqueKey: string;
  onRetry: () => void;
}) => {
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const mediaId = vimeoId || imageUrl || "";

  useEffect(() => {
    setShowError(false);
    setLoadAttempts(0);
  }, [uniqueKey]);

  const handleLoad = () => {
    setShowError(false);
    onLoaded(mediaId);
  };

  const handleError = () => {
    if (loadAttempts < 3) {
      const retryDelay = (loadAttempts + 1) * 1000;
      setLoadAttempts(prev => prev + 1);
      
      setTimeout(() => {
        if (mediaType === "video" && iframeRef.current) {
          const src = iframeRef.current.src;
          iframeRef.current.src = '';
          setTimeout(() => {
            if (iframeRef.current) iframeRef.current.src = src;
          }, 50);
        } else if (mediaType === "image" && imageRef.current) {
          const src = imageRef.current.src;
          imageRef.current.src = '';
          setTimeout(() => {
            if (imageRef.current) imageRef.current.src = src;
          }, 50);
        }
      }, retryDelay);
    } else {
      setShowError(true);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease-in',
      backgroundColor: 'black',
      zIndex: 5
    }}>
      {showError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-white mb-4">Content could not be loaded</p>
            <button 
              onClick={onRetry} 
              className="flex items-center gap-2 bg-yellow text-black px-3 py-2 rounded-full text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Loading
            </button>
          </div>
        </div>
      ) : mediaType === "image" ? (
        <img 
          ref={imageRef}
          key={uniqueKey} 
          src={imageUrl}
          alt={`Testimonial from ${mediaId}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: 'black'
          }} 
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <iframe 
          ref={iframeRef}
          key={uniqueKey} 
          src={`https://player.vimeo.com/video/${vimeoId}?h=${hash}&autoplay=1&background=1&loop=1&muted=1&title=0&byline=0&portrait=0&preload=auto`} 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black'
          }} 
          title={`Testimonial video ${vimeoId}`} 
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
        ></iframe>
      )}
    </div>
  );
});
TestimonialMedia.displayName = 'TestimonialMedia';

const VideoLoader = memo(() => <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 rounded-lg">
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-yellow/30 animate-pulse" />
        
        <div className="absolute inset-0 w-20 h-20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-yellow/50 animate-pulse animation-delay-200" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="w-8 h-8 text-yellow animate-spin" />
        </div>
      </div>
      
      <div className="text-white font-medium tracking-wide text-center">
        <p>LOADING CONTENT</p>
        <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-yellow animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>);
VideoLoader.displayName = 'VideoLoader';

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState<{
    [key: string]: boolean;
  }>({});
  const [mediaVisible, setMediaVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [key, setKey] = useState(0);
  const [preloadedMedia, setPreloadedMedia] = useState<string[]>([]);
  const vimeoScriptLoadedRef = useRef(false);
  const [mediaError, setMediaError] = useState(false);
  
  const currentTestimonial = testimonials[activeIndex] || testimonials[0];

  useEffect(() => {
    if (vimeoScriptLoadedRef.current) return;
    if (!document.getElementById('vimeo-player-api') && testimonials.some(t => t.mediaType === "video")) {
      const script = document.createElement('script');
      script.id = 'vimeo-player-api';
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => {
        vimeoScriptLoadedRef.current = true;
      };
      document.body.appendChild(script);
    } else {
      vimeoScriptLoadedRef.current = true;
    }
    
    const preloadTestimonials = () => {
      // Preload first 3 testimonials
      testimonials.slice(0, 3).forEach(testimonial => {
        if (!testimonial) return;
        
        if (testimonial.mediaType === "video" && testimonial.vimeoId) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'fetch';
          preloadLink.href = `https://player.vimeo.com/video/${testimonial.vimeoId}?h=${testimonial.hash}`;
          preloadLink.crossOrigin = 'anonymous';
          document.head.appendChild(preloadLink);
          setPreloadedMedia(prev => [...prev, testimonial.vimeoId || ""]);
        } else if (testimonial.mediaType === "image" && testimonial.imageUrl) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = testimonial.imageUrl;
          document.head.appendChild(preloadLink);
          setPreloadedMedia(prev => [...prev, testimonial.imageUrl || ""]);
        }
      });
      
      // Preload remaining testimonials with delay
      testimonials.slice(3).forEach((testimonial, index) => {
        setTimeout(() => {
          if (!testimonial) return;
          
          if (testimonial.mediaType === "video" && testimonial.vimeoId) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'fetch';
            preloadLink.href = `https://player.vimeo.com/video/${testimonial.vimeoId}?h=${testimonial.hash}`;
            preloadLink.crossOrigin = 'anonymous';
            document.head.appendChild(preloadLink);
            setPreloadedMedia(prev => [...prev, testimonial.vimeoId || ""]);
          } else if (testimonial.mediaType === "image" && testimonial.imageUrl) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = testimonial.imageUrl;
            document.head.appendChild(preloadLink);
            setPreloadedMedia(prev => [...prev, testimonial.imageUrl || ""]);
          }
        }, (index + 1) * 500);
      });
    };
    
    if (isInView) {
      preloadTestimonials();
    }
  }, [isInView]);

  const nextTestimonial = useCallback(() => {
    if (!currentTestimonial) return;
    
    const mediaId = currentTestimonial.vimeoId || currentTestimonial.imageUrl || "";
    setMediaVisible(prev => ({
      ...prev,
      [mediaId]: false
    }));
    
    requestAnimationFrame(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= testimonials.length ? 0 : nextIndex;
      });
      setKey(prev => prev + 1);
      setMediaError(false);
    });
  }, [currentTestimonial]);

  const prevTestimonial = useCallback(() => {
    if (!currentTestimonial) return;
    
    const mediaId = currentTestimonial.vimeoId || currentTestimonial.imageUrl || "";
    setMediaVisible(prev => ({
      ...prev,
      [mediaId]: false
    }));
    
    requestAnimationFrame(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = prevIndex - 1;
        return nextIndex < 0 ? testimonials.length - 1 : nextIndex;
      });
      setKey(prev => prev + 1);
      setMediaError(false);
    });
  }, [currentTestimonial]);

  const goToTestimonial = useCallback((index: number) => {
    if (index === activeIndex || !currentTestimonial || index >= testimonials.length) return;
    
    const mediaId = currentTestimonial.vimeoId || currentTestimonial.imageUrl || "";
    setMediaVisible(prev => ({
      ...prev,
      [mediaId]: false
    }));
    
    requestAnimationFrame(() => {
      setActiveIndex(index);
      setKey(prev => prev + 1);
      setMediaError(false);
    });
  }, [activeIndex, currentTestimonial]);

  const handleMediaLoaded = useCallback((mediaId: string) => {
    setMediaLoaded(prev => ({
      ...prev,
      [mediaId]: true
    }));
    
    requestAnimationFrame(() => {
      setMediaVisible(prev => ({
        ...prev,
        [mediaId]: true
      }));
    });
  }, []);

  const handleRetry = useCallback(() => {
    setKey(prev => prev + 1);
    setMediaError(false);
  }, []);

  useEffect(() => {
    if (!currentTestimonial) return;
    
    const mediaId = currentTestimonial.vimeoId || currentTestimonial.imageUrl || "";
    
    if (mediaLoaded[mediaId]) {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      const nextTestimonial = testimonials[nextIndex];
      
      if (nextTestimonial) {
        const nextMediaId = nextTestimonial.vimeoId || nextTestimonial.imageUrl || "";
        
        if (!preloadedMedia.includes(nextMediaId)) {
          if (nextTestimonial.mediaType === "video" && nextTestimonial.vimeoId) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'fetch';
            preloadLink.href = `https://player.vimeo.com/video/${nextTestimonial.vimeoId}?h=${nextTestimonial.hash}`;
            preloadLink.crossOrigin = 'anonymous';
            document.head.appendChild(preloadLink);
            setPreloadedMedia(prev => [...prev, nextMediaId]);
          } else if (nextTestimonial.mediaType === "image" && nextTestimonial.imageUrl) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = nextTestimonial.imageUrl;
            document.head.appendChild(preloadLink);
            setPreloadedMedia(prev => [...prev, nextMediaId]);
          }
        }
      }
    }
  }, [mediaLoaded, activeIndex, currentTestimonial, preloadedMedia]);

  useEffect(() => {
    if (!currentTestimonial) return;
    
    const mediaId = currentTestimonial.vimeoId || currentTestimonial.imageUrl || "";
    setMediaVisible(prev => ({
      ...prev,
      [mediaId]: mediaLoaded[mediaId] || false
    }));
  }, [activeIndex, currentTestimonial, mediaLoaded]);

  if (!currentTestimonial) {
    return <div className="py-16 md:py-20 bg-gray-50">Loading testimonials...</div>;
  }

  return <section ref={containerRef} id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE FITANYWHERE?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div className="relative">
            <div className={cn("flex flex-col md:grid md:grid-cols-2 gap-8 items-center transition-all duration-500", isInView ? "opacity-100" : "opacity-0 translate-y-4")}>
              <div className="order-2 md:order-1 text-left flex flex-col justify-center scale-80 transform origin-center">
                <div className="backdrop-blur-md bg-white/80 shadow-md p-5 rounded-xl relative mb-5 transition-all duration-300 hover:shadow-lg border-t-2 border-gray-800 slide-in-right group hover:shadow-gray-800/20" style={{
                borderColor: '#444444'
              }}>
                  <div className="text-gray-500 opacity-50 absolute left-3 top-3 pt-1" style={{
                  color: '#666666'
                }}>
                    <Quote className="h-6 w-6" />
                  </div>
                  
                  <div className="flex mb-2 mt-5 animate-fade-in">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 mr-1" fill="#FFD700" />)}
                  </div>
                  
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 transition-all duration-500 pt-2 pl-2">
                    {currentTestimonial.quote}
                  </p>
                  
                  <div className="flex items-center mt-3 animate-fade-in">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{currentTestimonial.name}</p>
                      <p className="text-xs text-gray-500">{currentTestimonial.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-3 justify-center md:justify-start">
                  {testimonials.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => goToTestimonial(index)} 
                      className={cn(
                        "transition-all duration-300", 
                        index === activeIndex 
                          ? "w-3 h-3 bg-gray-800 rounded-full" 
                          : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
                      )} 
                      aria-label={`Go to testimonial ${index + 1}`} 
                      style={{
                        backgroundColor: index === activeIndex ? '#444444' : ''
                      }} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="order-1 md:order-2 relative transition-all duration-500 w-full flex justify-center">
                <div className="w-3/5 mx-auto rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-black">
                  <div style={{
                    padding: '177.78% 0 0 0',
                    position: 'relative'
                  }} className="bg-black">
                    <TestimonialMedia 
                      mediaType={currentTestimonial.mediaType}
                      vimeoId={currentTestimonial.vimeoId}
                      hash={currentTestimonial.hash}
                      imageUrl={currentTestimonial.imageUrl}
                      onLoaded={handleMediaLoaded} 
                      isVisible={mediaVisible[currentTestimonial.vimeoId || currentTestimonial.imageUrl || ""] || false} 
                      isMobile={isMobile} 
                      uniqueKey={`${currentTestimonial.vimeoId || currentTestimonial.imageUrl}-${key}`}
                      onRetry={handleRetry}
                    />
                    
                    {!mediaVisible[currentTestimonial.vimeoId || currentTestimonial.imageUrl || ""] && <VideoLoader />}
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={prevTestimonial} 
              className="absolute top-1/2 -left-4 md:-left-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border-2 border-yellow pulse-glow" 
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            
            <button 
              onClick={nextTestimonial} 
              className="absolute top-1/2 -right-4 md:-right-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border-2 border-yellow pulse-glow" 
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </div>
          
          <div className={cn("mt-16 text-center transition-all duration-700", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            
          </div>
        </div>
      </div>
    </section>;
};

export default TestimonialsCarousel;
