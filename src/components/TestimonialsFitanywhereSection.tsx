
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Star, Loader, RefreshCw } from 'lucide-react';
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

const testimonials: Testimonial[] = [{
  name: "Sarah M.",
  role: "Remote Worker",
  quote: "Used to blame Zoom for no workouts. Now I sneak in 15 min wins.",
  mediaType: "image",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744322325/fitanywhere-testimonial1_pdv5gi.jpg"
}, {
  name: "Alex J.",
  role: "Busy Parent",
  quote: "Finally found an exercise routine that fits into my chaotic schedule.",
  mediaType: "image",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744322325/fitanywhere-testimonial2_cqgrma.jpg"
}, {
  name: "Michael T.",
  role: "Office Professional",
  quote: "No more excuses about lack of equipment or gym access.",
  mediaType: "image",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744322325/fitanywhere-testimonial3_mku3et.jpg"
}];

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
  const imgRef = useRef<HTMLImageElement>(null);
  const mediaId = vimeoId || imageUrl || '';
  
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
        } else if (mediaType === "image" && imgRef.current && imageUrl) {
          const src = imgRef.current.src;
          imgRef.current.src = '';
          setTimeout(() => {
            if (imgRef.current) imgRef.current.src = imageUrl;
          }, 50);
        }
      }, retryDelay);
    } else {
      setShowError(true);
    }
  };
  
  return <div style={{
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
      {showError ? <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-white mb-4">Media could not be loaded</p>
            <button onClick={onRetry} className="flex items-center gap-2 bg-yellow text-black px-3 py-2 rounded-full text-sm">
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div> : mediaType === "image" ? <img ref={imgRef} key={uniqueKey} src={imageUrl} alt={`Testimonial from ${mediaId}`} onLoad={handleLoad} onError={handleError} loading="lazy" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      backgroundColor: 'black'
    }} /> : <iframe ref={iframeRef} key={uniqueKey} src={`https://player.vimeo.com/video/${vimeoId}?h=${hash}&autoplay=1&background=1&loop=1&muted=1&title=0&byline=0&portrait=0&preload=auto`} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black'
    }} title={`Testimonial video ${vimeoId}`} onLoad={handleLoad} onError={handleError} loading="eager"></iframe>}
    </div>;
});

TestimonialMedia.displayName = 'TestimonialMedia';

const VideoLoader = memo(() => <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 rounded-t-xl">
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
        <p>LOADING VIDEO</p>
        <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-yellow animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>);

VideoLoader.displayName = 'VideoLoader';

const TestimonialsFitanywhereSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediasLoaded, setMediasLoaded] = useState<{
    [key: string]: boolean;
  }>({});
  const [mediaVisible, setMediaVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [key, setKey] = useState(0);
  const [preloadedMedia, setPreloadedMedia] = useState<string[]>([]);
  const vimeoScriptLoadedRef = useRef(false);
  const [mediaError, setMediaError] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
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
      testimonials.slice(0, 3).forEach(testimonial => {
        if (!testimonial) return;
        if (testimonial.mediaType === "video" && testimonial.vimeoId) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'fetch';
          preloadLink.href = `https://player.vimeo.com/video/${testimonial.vimeoId}?h=${testimonial.hash}`;
          preloadLink.crossOrigin = 'anonymous';
          document.head.appendChild(preloadLink);
          setPreloadedMedia(prev => [...prev, testimonial.vimeoId || '']);
        } else if (testimonial.mediaType === "image" && testimonial.imageUrl) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = testimonial.imageUrl;
          document.head.appendChild(preloadLink);
          setPreloadedMedia(prev => [...prev, testimonial.imageUrl || '']);
        }
      });
      
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
            setPreloadedMedia(prev => [...prev, testimonial.vimeoId || '']);
          } else if (testimonial.mediaType === "image" && testimonial.imageUrl) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = testimonial.imageUrl;
            document.head.appendChild(preloadLink);
            setPreloadedMedia(prev => [...prev, testimonial.imageUrl || '']);
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
    const mediaId = currentTestimonial.mediaType === "video" ? currentTestimonial.vimeoId : currentTestimonial.imageUrl;
    if (mediaId) {
      setMediaVisible(prev => ({
        ...prev,
        [mediaId]: false
      }));
    }
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
    const mediaId = currentTestimonial.mediaType === "video" ? currentTestimonial.vimeoId : currentTestimonial.imageUrl;
    if (mediaId) {
      setMediaVisible(prev => ({
        ...prev,
        [mediaId]: false
      }));
    }
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
    const mediaId = currentTestimonial.mediaType === "video" ? currentTestimonial.vimeoId : currentTestimonial.imageUrl;
    if (mediaId) {
      setMediaVisible(prev => ({
        ...prev,
        [mediaId]: false
      }));
    }
    requestAnimationFrame(() => {
      setActiveIndex(index);
      setKey(prev => prev + 1);
      setMediaError(false);
    });
  }, [activeIndex, currentTestimonial]);
  
  const handleMediaLoaded = useCallback((mediaId: string) => {
    setMediasLoaded(prev => ({
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
  
  // Touch events for mobile swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  useEffect(() => {
    if (!currentTestimonial) return;
    const mediaId = currentTestimonial.mediaType === "video" ? currentTestimonial.vimeoId : currentTestimonial.imageUrl;
    if (mediaId && mediasLoaded[mediaId]) {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      const nextTestimonial = testimonials[nextIndex];
      if (nextTestimonial) {
        const nextMediaId = nextTestimonial.mediaType === "video" ? nextTestimonial.vimeoId : nextTestimonial.imageUrl;
        if (nextMediaId && !preloadedMedia.includes(nextMediaId)) {
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
  }, [mediasLoaded, activeIndex, currentTestimonial, preloadedMedia]);
  
  useEffect(() => {
    if (!currentTestimonial) return;
    const mediaId = currentTestimonial.mediaType === "video" ? currentTestimonial.vimeoId : currentTestimonial.imageUrl;
    if (mediaId) {
      setMediaVisible(prev => ({
        ...prev,
        [mediaId]: mediasLoaded[mediaId] || false
      }));
    }
  }, [activeIndex, currentTestimonial, mediasLoaded]);
  
  if (!currentTestimonial) {
    return <div className="py-16 md:py-20 bg-gray-50">Loading testimonials...</div>;
  }
  
  const mediaId = currentTestimonial.mediaType === "video" ? currentTestimonial.vimeoId : currentTestimonial.imageUrl;
  
  return <section ref={containerRef} id="testimonials-fitanywhere" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE FITANYWHERE?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div className="relative">
            <div 
              ref={carouselRef}
              className={cn("transition-all duration-500 w-full flex justify-center", 
                isInView ? "opacity-100" : "opacity-0 translate-y-4"
              )}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Integrated card design similar to BOXFUN */}
              <div className="w-3/5 mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-xl">
                <div className="flex flex-col">
                  <div style={{
                    padding: '177.78% 0 0 0',
                    position: 'relative'
                  }} className="bg-black rounded-t-xl">
                    <TestimonialMedia 
                      mediaType={currentTestimonial.mediaType} 
                      vimeoId={currentTestimonial.vimeoId} 
                      hash={currentTestimonial.hash} 
                      imageUrl={currentTestimonial.imageUrl} 
                      onLoaded={handleMediaLoaded} 
                      isVisible={mediaId ? mediaVisible[mediaId] || false : false} 
                      isMobile={isMobile} 
                      uniqueKey={`${mediaId}-${key}`} 
                      onRetry={handleRetry} 
                    />
                    
                    {mediaId && !mediaVisible[mediaId] && <VideoLoader />}
                  </div>
                  
                  <div className="p-3 pt-2 shadow-md rounded-b-xl border border-gray-100">
                    <div className="flex mb-1 animate-fade-in">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 mr-1" fill="#FFD700" />)}
                    </div>
                    
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {currentTestimonial.quote}
                    </p>
                    
                    <div className="flex items-center animate-fade-in">
                      <p className="font-semibold text-gray-800 text-xs">{currentTestimonial.name}</p>
                    </div>
                  </div>
                </div>
                
                {/* Dots indicator positioned directly below card with minimal spacing */}
                <div className="flex justify-center mt-1 mb-0">
                  {testimonials.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => goToTestimonial(index)} 
                      className={cn(
                        "mx-1 transition-all duration-300", 
                        index === activeIndex 
                          ? "w-2 h-2 bg-black rounded-full" 
                          : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
                      )} 
                      aria-label={`Go to testimonial ${index + 1}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={prevTestimonial} 
              className={cn(
                "absolute top-1/2 -left-4 md:-left-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border-2 border-yellow",
                "h-8 w-8 rounded-full animate-[pulse_2s_ease-in-out_infinite]",
                "border-yellow border-2 hover:border-opacity-100 transition-all duration-700",
                "shadow-[0_0_10px_rgba(255,215,0,0.5)] pulse-glow",
                isMobile ? "p-3" : ""
              )} 
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("text-gray-800", isMobile ? "w-5 h-5" : "w-4 h-4")}>
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            
            <button 
              onClick={nextTestimonial} 
              className={cn(
                "absolute top-1/2 -right-4 md:-right-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border-2 border-yellow",
                "h-8 w-8 rounded-full animate-[pulse_2s_ease-in-out_infinite]",
                "border-yellow border-2 hover:border-opacity-100 transition-all duration-700",
                "shadow-[0_0_10px_rgba(255,215,0,0.5)] pulse-glow",
                isMobile ? "p-3" : ""
              )} 
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("text-gray-800", isMobile ? "w-5 h-5" : "w-4 h-4")}>
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>;
};

export default TestimonialsFitanywhereSection;
