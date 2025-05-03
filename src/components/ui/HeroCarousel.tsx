
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const images = [
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/1_doj-Photoroom_9_-Photoroom_7_y2vlxo.jpg",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/IMG_20250427_114419_333_vqgbst.jpg",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745755066/IMG_20250427_114421_715_kx0t3m.jpg"
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl",
      isMobile 
        ? "aspect-square w-full" 
        : "max-w-[480px] w-full aspect-square mx-auto md:ml-0 md:mr-8" // 20-30% larger than 400px and shifted left
    )}>
      {images.map((image, index) => (
        <div
          key={image}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000",
            currentIndex === index ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={image}
            alt={`Hero image ${index + 1}`}
            className="w-full h-full object-cover rounded-xl"
            width={1080}
            height={1080}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
