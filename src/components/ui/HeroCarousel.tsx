
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { debounce } from '@/utils/eventOptimizers';

const images = [
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843343/52_gllnot.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/54_vqvmdl.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843343/51_oorfmr.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/55_uojy1l.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/50_vomtqy.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750843344/53_qhgfx6.png"
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Debounced resize handler
  const debouncedResize = useRef(
    debounce(() => {
      if (carouselRef.current) {
        const rect = carouselRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    }, 300)
  );

  // Initialize image load status and preload images
  useEffect(() => {
    setImagesLoaded(new Array(images.length).fill(false));
    
    // Preload images with priority for first few
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.loading = index < 3 ? 'eager' : 'lazy';
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });
  }, []);

  // Set up resize listener
  useEffect(() => {
    const resizeHandler = debouncedResize.current;
    window.addEventListener('resize', resizeHandler);
    
    // Initial size calculation
    if (carouselRef.current) {
      const rect = carouselRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // Carousel rotation with slower timing
  useEffect(() => {
    if (!imagesLoaded[0]) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [imagesLoaded]);

  return (
    <div 
      ref={carouselRef}
      className={cn(
        "relative overflow-hidden rounded-xl",
        isMobile 
          ? "aspect-square w-full" 
          : "max-w-[480px] w-full aspect-square mx-auto md:ml-0 md:mr-8"
      )}
    >
      {images.map((image, index) => (
        <div
          key={image}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000",
            currentIndex === index ? "opacity-100" : "opacity-0",
            index === 0 ? "" : "will-change-opacity"
          )}
        >
          <img
            src={image}
            alt={`Hero image ${index + 1}`}
            className="w-full h-full object-cover rounded-xl"
            width={containerSize.width || 480}
            height={containerSize.height || 480}
            sizes="(max-width: 768px) 100vw, 480px"
            loading={index === 0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            fetchPriority={index === 0 ? "high" : "auto"}
            onLoad={() => {
              if (index === 0 && carouselRef.current) {
                carouselRef.current.style.opacity = "1";
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
