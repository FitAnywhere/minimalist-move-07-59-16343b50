
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const images = [
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/1_doj-Photoroom_9_-Photoroom_7_y2vlxo.jpg",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/IMG_20250427_114419_333_vqgbst.jpg",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/IMG_20250427_114421_715_kx0t3m.jpg",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1747161397/streeee_zbon82.png"
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Initialize image load status array
  useEffect(() => {
    setImagesLoaded(new Array(images.length).fill(false));
    
    // Preload images
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });
  }, []);

  // Only start carousel rotation once first image is loaded
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
        "relative overflow-hidden rounded-xl content-visibility-auto",
        isMobile 
          ? "aspect-square w-full" 
          : "max-w-[480px] w-full aspect-square mx-auto md:ml-0 md:mr-8" // 20-30% larger than 400px and shifted left
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
            width={1080}
            height={1080}
            loading={index === 0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            fetchPriority={index === 0 ? "high" : "auto"}
            onLoad={() => {
              if (index === 0 && carouselRef.current) {
                // This will help LCP on the first image
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
