
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const images = [
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408246/44_nnkfe5.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749481218/Neon_Green_Fitness_and_Gym_Tips_Carousel_Instagram_Post_5_q4x78j.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408237/42_ozxxdn.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749480525/Neon_Green_Fitness_and_Gym_Tips_Carousel_Instagram_Post_4_jljvlh.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408245/43_tlkqgd.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749480382/58_hn78d8.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749478288/Neon_Green_Fitness_and_Gym_Tips_Carousel_Instagram_Post_1_tl0kfa.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408284/36_ely4pq.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408285/30_xu4ljl.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408286/31_fkb6l1.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408287/33_snxgki.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408279/34_tkyirg.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408278/35_cyyf2m.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408294/37_ar3noo.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1749408283/28_hxqe7h.png"
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

  // Only start carousel rotation once first image is loaded - changed to 1 second
  useEffect(() => {
    if (!imagesLoaded[0]) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000);

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
