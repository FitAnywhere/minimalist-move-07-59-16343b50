
import { useRef, useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const exerciseImages = [
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/36_tzpycv.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/37_atfe5o.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/30_gcqcbp.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/29_aien4c.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/28_swid5q.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/40_rvhycs.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/35_uc5ypj.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/31_z1ja4w.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/32_ucwxqa.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/33_twqq1p.png',
  'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506380/34_kvn8lo.png'
];

const OneTruthSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % exerciseImages.length
      );
    }, 1700);

    return () => clearInterval(interval);
  }, [isInView]);

  const renderCarousel = () => (
    <div className="relative w-full max-w-xs mx-auto md:max-w-sm">
      <div className="aspect-square relative overflow-hidden rounded-2xl shadow-lg">
        {exerciseImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Exercise ${index + 1}`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );

  const renderTextContent = () => (
    <div className={cn(
      "space-y-6",
      isMobile ? "text-center" : "text-left"
    )}>
      <div className={cn(
        "transition-all duration-1000 transform",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
          ENDLESS EXERCISES
          <span className={cn(
            "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
            isInView ? "scale-x-100" : "scale-x-0"
          )}></span>
        </h2>
      </div>

      <div className={cn(
        "transition-all duration-1000 transform space-y-4",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )} style={{ animationDelay: "200ms" }}>
        <p className="text-lg text-gray-700 leading-relaxed">
          Yes, you can do all that and a lot more.
          <br />
          But real strength comes from doing 4 core exercises correct way.
        </p>
      </div>

      {isMobile && (
        <div className={cn(
          "transition-all duration-1000 transform",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )} style={{ animationDelay: "400ms" }}>
          {renderCarousel()}
        </div>
      )}

      <div className={cn(
        "transition-all duration-1000 transform space-y-3",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )} style={{ animationDelay: "600ms" }}>
        <h3 className="text-xl font-bold text-black">
          TRAIN SMART
        </h3>
        <p className="text-lg text-gray-700">
          Thats how you win in 15-minutes a day.
        </p>
      </div>

      <div className="py-4"></div>

      <div className={cn(
        "transition-all duration-1000 transform",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )} style={{ animationDelay: "800ms" }}>
        <p className="text-lg text-gray-600 italic">
          Your coach will give you a plan that does exactly that.
        </p>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {isMobile ? (
            renderTextContent()
          ) : (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                {renderTextContent()}
              </div>
              <div className="order-2">
                <div className={cn(
                  "transition-all duration-1000 transform",
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )} style={{ animationDelay: "400ms" }}>
                  {renderCarousel()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OneTruthSection;
