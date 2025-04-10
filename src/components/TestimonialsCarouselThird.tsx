
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Star, Loader, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  mediaType: "video" | "image";
  vimeoId?: string;
  hash?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
}
const testimonials: Testimonial[] = [{
  name: "Mason K.",
  role: "Outdoor Lover",
  quote: "BoxFun didn't just get me moving. It made me want to move.",
  mediaType: "image",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_400/v1744097765/Izdelek_brez_naslova_-_2025-04-08T093354.537_ovbtbx.png",
  mobileImageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_200/v1744097765/Izdelek_brez_naslova_-_2025-04-08T093354.537_ovbtbx.png"
}, {
  name: "Blake H.",
  role: "Strength Seeker",
  quote: "Never thought working out could feel this fun.",
  mediaType: "image",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_400/v1744097748/Screenshot_72_ggjdho.png",
  mobileImageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_200/v1744097748/Screenshot_72_ggjdho.png"
}, {
  name: "Tyler B.",
  role: "Calisthenics Enthusiast",
  quote: "Getting fit used to feel like work. Now it feels like play.",
  mediaType: "image",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_400/v1744141492/Izdelek_brez_naslova_-_2025-04-08T214404.198_yb1jc0.png",
  mobileImageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_200/v1744141492/Izdelek_brez_naslova_-_2025-04-08T214404.198_yb1jc0.png"
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
        <p>LOADING VIDEO</p>
        <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-yellow animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>);
VideoLoader.displayName = 'VideoLoader';

const TestimonialsCarouselThird = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  return <section ref={containerRef} id="testimonials-third" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE BOXFUN?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div className="relative">
            <div className={cn("flex flex-col md:flex md:justify-center md:items-center gap-8 transition-all duration-500", isInView ? "opacity-100" : "opacity-0 translate-y-4")}>
              <div className="order-2 md:order-1 text-left flex flex-col justify-center scale-80 transform origin-center">
                
              </div>
              
              <div className="order-1 md:order-2 relative transition-all duration-500 w-full flex justify-center">
                <div className="w-1/2 md:w-1/3 mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-black rounded-t-xl">
                  <div className="flex flex-col">
                    <div style={{
                    padding: '150% 0 0 0',
                    position: 'relative'
                  }} className="bg-black rounded-t-xl">
                      <TestimonialMedia 
                        mediaType={currentTestimonial.mediaType} 
                        vimeoId={currentTestimonial.vimeoId} 
                        hash={currentTestimonial.hash} 
                        imageUrl={isMobile ? currentTestimonial.mobileImageUrl : currentTestimonial.imageUrl} 
                        onLoaded={handleMediaLoaded} 
                        isVisible={mediaId ? mediaVisible[mediaId] || false : false} 
                        isMobile={isMobile} 
                        uniqueKey={`${mediaId}-${key}`} 
                        onRetry={handleRetry} 
                      />
                      
                      {mediaId && !mediaVisible[mediaId] && <VideoLoader />}
                    </div>
                    
                    <div className="bg-white p-3 shadow-md rounded-b-xl border border-gray-100">
                      <div className="flex mb-1 animate-fade-in">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 mr-1" fill="#FFD700" />)}
                      </div>
                      
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {currentTestimonial.quote}
                      </p>
                      
                      <div className="flex items-center animate-fade-in">
                        <div>
                          <p className="font-semibold text-gray-800 text-xs">{currentTestimonial.name}</p>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={prevTestimonial} className={cn("absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border-2 border-yellow", isMobile ? "p-3 left-0 -translate-x-1/2" : "p-4 left-[calc(33.33%-1rem)] -translate-x-full")} aria-label="Previous testimonial">
              <ChevronLeft className={cn("text-gray-800", isMobile ? "w-5 h-5" : "w-8 h-8")} />
            </button>
            
            <button onClick={nextTestimonial} className={cn("absolute top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border-2 border-yellow", isMobile ? "p-3 right-0 translate-x-1/2" : "p-4 right-[calc(33.33%-1rem)] translate-x-full")} aria-label="Next testimonial">
              <ChevronRight className={cn("text-gray-800", isMobile ? "w-5 h-5" : "w-8 h-8")} />
            </button>
          </div>
          
          {isMobile && <div className="flex justify-center mt-1 bg-white py-1">
              {testimonials.map((_, index) => <button key={index} onClick={() => goToTestimonial(index)} className={cn("mx-1 transition-all duration-300", index === activeIndex ? "w-2 h-2 bg-yellow rounded-full" : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400")} aria-label={`Go to testimonial ${index + 1}`} />)}
            </div>}
          
          {!isMobile && <div className="flex space-x-2 mt-1 justify-center bg-white">
              {testimonials.map((_, index) => <button key={index} onClick={() => goToTestimonial(index)} className={cn("transition-all duration-300", index === activeIndex ? "w-3 h-3 bg-yellow rounded-full" : "w-2 h-2 bg-[#F1F0FB] rounded-full hover:bg-gray-400")} aria-label={`Go to testimonial ${index + 1}`} />)}
            </div>}
        </div>
      </div>
    </section>;
};
export default TestimonialsCarouselThird;
