import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Quote, Star, Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
interface Testimonial {
  name: string;
  role: string;
  quote: string;
  vimeoId: string;
  hash: string;
}
const testimonials: Testimonial[] = [{
  name: "Emily T.",
  role: "Fitness Beginner",
  quote: "Bands seemed basic until I tried this. My whole body's sore in the best way.",
  vimeoId: "1067256372",
  hash: "70ab6c252c"
}, {
  name: "Jordan P.",
  role: "Calisthenics Enthusiast",
  quote: "Didn't expect this to replace my entire workout routine…",
  vimeoId: "1072106681",
  hash: "ccbb523a7c"
}, {
  name: "Jordan P.",
  role: "Calisthenics Enthusiast",
  quote: "I've never had so much fun while getting in shape",
  vimeoId: "1067259441",
  hash: "6ed11d11d8"
}, {
  name: "James W.",
  role: "Outdoor Lover",
  quote: "BoxFun is the first thing that truly got me moving and loving every second of it!",
  vimeoId: "1072106631",
  hash: "962bdbefe6"
}, {
  name: "Sarah M.",
  role: "Remote Worker",
  quote: "Being remote used to mean no workouts. Now it means random 15 minute gains between Zooms.",
  vimeoId: "1067256419",
  hash: "9896ed5d93"
}, {
  name: "Chris L.",
  role: "Fitness Advocate",
  quote: "Our clients love it, and it looks clean and modern.",
  vimeoId: "1067256325",
  hash: "d9d4133cc1"
}, {
  name: "Alex G.",
  role: "Busy Professional",
  quote: "Time saving is underrated. Now I work out and still have time for my girl.",
  vimeoId: "1067256239",
  hash: "d5e32d0eef"
}, {
  name: "John D.",
  role: "Fitness Enthusiast",
  quote: "It's like minimalism for fitness. Simple yet everything you need.",
  vimeoId: "1067256399",
  hash: "317d8d1581"
}, {
  name: "Tom S.",
  role: "Strength Seeker",
  quote: "No more gym anxiety.. just good vibes, and loud music.",
  vimeoId: "1072106714",
  hash: "2f52dd8383"
}, {
  name: "Tom S.",
  role: "Strength Seeker",
  quote: "Obsessed. This setup made my old gear feel like toys",
  vimeoId: "1072106738",
  hash: "462fcda05e"
}, {
  name: "Ryan P.",
  role: "Leader with a Fitness Goal",
  quote: "Perfect for a quick and effective workout, no matter where I am!",
  vimeoId: "1072106699",
  hash: "6075a29b52"
}];
const TestimonialVideo = memo(({
  vimeoId,
  hash,
  onLoaded,
  isVisible,
  isMobile,
  uniqueKey
}: {
  vimeoId: string;
  hash: string;
  onLoaded: (vimeoId: string) => void;
  isVisible: boolean;
  isMobile: boolean;
  uniqueKey: string;
}) => {
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
      <iframe key={uniqueKey} src={`https://player.vimeo.com/video/${vimeoId}?h=${hash}&autoplay=1&background=1&loop=1&muted=1&title=0&byline=0&portrait=0&preload=auto`} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black'
    }} title={`Testimonial video ${vimeoId}`} onLoad={() => onLoaded(vimeoId)} loading="eager"></iframe>
    </div>;
});
TestimonialVideo.displayName = 'TestimonialVideo';
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
const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {}, false);
  const currentTestimonial = testimonials[activeIndex];
  const isMobile = useIsMobile();
  const [videosLoaded, setVideosLoaded] = useState<{
    [key: string]: boolean;
  }>({});
  const [videoVisible, setVideoVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [key, setKey] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState<string[]>([]);
  const vimeoScriptLoadedRef = useRef(false);
  useEffect(() => {
    if (vimeoScriptLoadedRef.current) return;
    if (!document.getElementById('vimeo-player-api')) {
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
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'fetch';
        preloadLink.href = `https://player.vimeo.com/video/${testimonial.vimeoId}?h=${testimonial.hash}`;
        preloadLink.crossOrigin = 'anonymous';
        document.head.appendChild(preloadLink);
        setPreloadedVideos(prev => [...prev, testimonial.vimeoId]);
      });
      testimonials.slice(3).forEach((testimonial, index) => {
        setTimeout(() => {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'fetch';
          preloadLink.href = `https://player.vimeo.com/video/${testimonial.vimeoId}?h=${testimonial.hash}`;
          preloadLink.crossOrigin = 'anonymous';
          document.head.appendChild(preloadLink);
          setPreloadedVideos(prev => [...prev, testimonial.vimeoId]);
        }, (index + 1) * 500);
      });
    };
    if (isInView) {
      preloadTestimonials();
    }
  }, [isInView]);
  const nextTestimonial = useCallback(() => {
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: false
    }));
    requestAnimationFrame(() => {
      setActiveIndex(prevIndex => prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1);
      setKey(prev => prev + 1);
    });
  }, [currentTestimonial.vimeoId]);
  const prevTestimonial = useCallback(() => {
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: false
    }));
    requestAnimationFrame(() => {
      setActiveIndex(prevIndex => prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1);
      setKey(prev => prev + 1);
    });
  }, [currentTestimonial.vimeoId]);
  const goToTestimonial = useCallback((index: number) => {
    if (index === activeIndex) return;
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: false
    }));
    requestAnimationFrame(() => {
      setActiveIndex(index);
      setKey(prev => prev + 1);
    });
  }, [activeIndex, currentTestimonial.vimeoId]);
  const handleVideoLoaded = useCallback((vimeoId: string) => {
    setVideosLoaded(prev => ({
      ...prev,
      [vimeoId]: true
    }));
    requestAnimationFrame(() => {
      setVideoVisible(prev => ({
        ...prev,
        [vimeoId]: true
      }));
    });
  }, []);
  useEffect(() => {
    if (videosLoaded[currentTestimonial.vimeoId]) {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      const nextTestimonial = testimonials[nextIndex];
      if (!preloadedVideos.includes(nextTestimonial.vimeoId)) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'fetch';
        preloadLink.href = `https://player.vimeo.com/video/${nextTestimonial.vimeoId}?h=${nextTestimonial.hash}`;
        preloadLink.crossOrigin = 'anonymous';
        document.head.appendChild(preloadLink);
        setPreloadedVideos(prev => [...prev, nextTestimonial.vimeoId]);
      }
    }
  }, [videosLoaded, activeIndex, currentTestimonial.vimeoId, preloadedVideos]);
  useEffect(() => {
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: videosLoaded[currentTestimonial.vimeoId] || false
    }));
  }, [activeIndex, currentTestimonial.vimeoId, videosLoaded]);
  return <section id="reviews" ref={sectionRef} className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 bg-inherit">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              WHY THEY LOVE IT?
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform scale-x-100"></span>
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
                  {testimonials.map((_, index) => <button key={index} onClick={() => goToTestimonial(index)} className={cn("transition-all duration-300", index === activeIndex ? "w-3 h-3 bg-gray-800 rounded-full" : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400")} aria-label={`Go to testimonial ${index + 1}`} style={{
                  backgroundColor: index === activeIndex ? '#444444' : ''
                }} />)}
                </div>
              </div>
              
              <div className="order-1 md:order-2 relative transition-all duration-500 w-full flex justify-center">
                <div className="w-3/5 mx-auto rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-black">
                  <div style={{
                  padding: '177.78% 0 0 0',
                  position: 'relative'
                }} className="bg-black">
                    <TestimonialVideo vimeoId={currentTestimonial.vimeoId} hash={currentTestimonial.hash} onLoaded={handleVideoLoaded} isVisible={videoVisible[currentTestimonial.vimeoId] || false} isMobile={isMobile} uniqueKey={`${currentTestimonial.vimeoId}-${key}`} />
                    
                    {!videoVisible[currentTestimonial.vimeoId] && <VideoLoader />}
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={prevTestimonial} className="absolute top-1/2 -left-4 md:-left-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border border-gray-800" aria-label="Previous testimonial" style={{
            borderColor: '#444444'
          }}>
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            
            <button onClick={nextTestimonial} className="absolute top-1/2 -right-4 md:-right-10 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110 z-10 focus:outline-none border border-gray-800" aria-label="Next testimonial" style={{
            borderColor: '#444444'
          }}>
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </div>
          
          <div className={cn("mt-16 text-center transition-all duration-700", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <p className="font-bold text-3xl text-yellow-400">+7939 completed workouts</p>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsCarousel;