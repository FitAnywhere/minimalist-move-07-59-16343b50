
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useInView } from '@/utils/optimizedAnimations';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoTestimonial from './ui/VideoTestimonial';
import { preloadVimeoVideo, loadVimeoScript } from '@/utils/videoLoader';

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
  name: "Ryan P.",
  role: "Leader with a Fitness Goal",
  quote: "Perfect for a quick and effective workout, no matter where I am!",
  vimeoId: "1072106699",
  hash: "6075a29b52"
}];

const VideoLoader = memo(() => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 rounded-lg">
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-yellow/30 animate-pulse" />
        
        <div className="absolute inset-0 w-20 h-20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-yellow/50 animate-pulse animation-delay-200" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 text-yellow animate-spin border-2 border-yellow border-t-transparent rounded-full"></div>
        </div>
      </div>
      
      <div className="text-white font-medium tracking-wide text-center">
        <p>LOADING VIDEO</p>
        <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-yellow animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
));
VideoLoader.displayName = 'VideoLoader';

const TestimonialsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState<{
    [key: string]: boolean;
  }>({});
  const [videoVisible, setVideoVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [key, setKey] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState<string[]>([]);
  
  const currentTestimonial = testimonials[activeIndex] || testimonials[0];

  // Initialize Vimeo API and preload first few videos
  useEffect(() => {
    // Load Vimeo API
    loadVimeoScript().catch(err => {
      console.error('Failed to load Vimeo API in TestimonialsCarousel:', err);
    });
    
    // Preload initial testimonials
    if (isInView) {
      // Preload first 3 videos immediately with high priority
      testimonials.slice(0, 3).forEach(testimonial => {
        if (!testimonial) return;
        preloadVimeoVideo(testimonial.vimeoId, testimonial.hash, 'high');
        setPreloadedVideos(prev => [...prev, testimonial.vimeoId]);
      });
      
      // Preload the rest with low priority and staggered timing
      testimonials.slice(3).forEach((testimonial, index) => {
        setTimeout(() => {
          if (!testimonial) return;
          preloadVimeoVideo(testimonial.vimeoId, testimonial.hash, 'low');
          setPreloadedVideos(prev => [...prev, testimonial.vimeoId]);
        }, (index + 1) * 1000); // Stagger by 1 second per video
      });
    }
  }, [isInView]);

  // Navigation handlers
  const nextTestimonial = useCallback(() => {
    if (!currentTestimonial) return;
    
    // Hide current video first
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: false
    }));
    
    // Then update index on next animation frame
    requestAnimationFrame(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= testimonials.length ? 0 : nextIndex;
      });
      setKey(prev => prev + 1);
    });
  }, [currentTestimonial]);

  const prevTestimonial = useCallback(() => {
    if (!currentTestimonial) return;
    
    // Hide current video first
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: false
    }));
    
    // Then update index on next animation frame
    requestAnimationFrame(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = prevIndex - 1;
        return nextIndex < 0 ? testimonials.length - 1 : nextIndex;
      });
      setKey(prev => prev + 1);
    });
  }, [currentTestimonial]);

  const goToTestimonial = useCallback((index: number) => {
    if (index === activeIndex || !currentTestimonial || index >= testimonials.length) return;
    
    // Hide current video first
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: false
    }));
    
    // Then update index on next animation frame
    requestAnimationFrame(() => {
      setActiveIndex(index);
      setKey(prev => prev + 1);
    });
  }, [activeIndex, currentTestimonial]);

  // Video loading handlers
  const handleVideoLoaded = useCallback((vimeoId: string) => {
    setVideosLoaded(prev => ({
      ...prev,
      [vimeoId]: true
    }));
    
    // Show the video once loaded
    requestAnimationFrame(() => {
      setVideoVisible(prev => ({
        ...prev,
        [vimeoId]: true
      }));
    });
  }, []);

  const handleRetry = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  // Preload next video when current one is loaded
  useEffect(() => {
    if (!currentTestimonial) return;
    
    if (videosLoaded[currentTestimonial.vimeoId]) {
      const nextIndex = (activeIndex + 1) % testimonials.length;
      const nextTestimonial = testimonials[nextIndex];
      
      if (nextTestimonial && !preloadedVideos.includes(nextTestimonial.vimeoId)) {
        preloadVimeoVideo(nextTestimonial.vimeoId, nextTestimonial.hash);
        setPreloadedVideos(prev => [...prev, nextTestimonial.vimeoId]);
      }
    }
  }, [videosLoaded, activeIndex, currentTestimonial, preloadedVideos]);

  // Update video visibility when active index changes
  useEffect(() => {
    if (!currentTestimonial) return;
    
    setVideoVisible(prev => ({
      ...prev,
      [currentTestimonial.vimeoId]: videosLoaded[currentTestimonial.vimeoId] || false
    }));
  }, [activeIndex, currentTestimonial, videosLoaded]);

  if (!currentTestimonial) {
    return <div className="py-16 md:py-20 bg-gray-50">Loading testimonials...</div>;
  }

  return (
    <section ref={containerRef} id="testimonials" className="py-16 bg-white">
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
                    <VideoTestimonial 
                      vimeoId={currentTestimonial.vimeoId} 
                      hash={currentTestimonial.hash} 
                      onLoaded={handleVideoLoaded} 
                      isVisible={videoVisible[currentTestimonial.vimeoId] || false} 
                      isMobile={isMobile} 
                      uniqueKey={`${currentTestimonial.vimeoId}-${key}`}
                      onRetry={handleRetry}
                    />
                    
                    {!videoVisible[currentTestimonial.vimeoId] && <VideoLoader />}
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
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
