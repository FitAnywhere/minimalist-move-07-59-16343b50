
"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}
interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}
interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}
interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {}
}: CircularTestimonialsProps) => {
  // Color & font config
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

  // Touch/Swipe state for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        const newWidth = imageContainerRef.current.offsetWidth;
        setContainerWidth(newWidth);
        console.log('Container width updated:', newWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [activeIndex, testimonialsLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);
  
  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // Touch handlers for swipe functionality (mobile only)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      console.log('Swiped left - moving to next');
      handleNext();
    } else if (isRightSwipe) {
      console.log('Swiped right - moving to previous');
      handlePrev();
    }
  }, [isMobile, touchStart, touchEnd, handleNext, handlePrev]);

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const offset = (index - activeIndex + testimonialsLength) % testimonialsLength;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)"
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)"
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)"
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)"
    };
  }

  // Framer Motion variants for quote
  const quoteVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };

  // Check if mobile - add debugging
  console.log('Is mobile:', isMobile, 'Container width:', containerWidth);

  // CSS-in-JS styles - remove max-width restriction on desktop
  const containerStyles: React.CSSProperties = {
    width: '100%',
    ...(isMobile ? {
      maxWidth: '56rem',
      padding: '2rem'
    } : {
      padding: '2rem 4rem',
      // More padding on desktop
      minWidth: '900px' // Ensure minimum width for proper layout
    })
  };

  // Updated grid styles for proper desktop layout
  const gridStyles: React.CSSProperties = {
    display: 'flex',
    ...(isMobile ? {
      flexDirection: 'column',
      gap: '2rem',
      alignItems: 'center'
    } : {
      flexDirection: 'row',
      gap: '1rem',
      // Minimal gap to remove empty space
      alignItems: 'center',
      justifyContent: 'flex-start'
      // Start alignment to keep images positioned and text close
    })
  };

  // Updated image container styles - proper sizing for desktop
  const imageContainerStyles: React.CSSProperties = {
    position: 'relative',
    ...(isMobile ? {
      width: '75%',
      height: '0',
      paddingBottom: '100%',
      margin: '0 auto'
    } : {
      width: '400px',
      // Increased from 350px
      height: '400px',
      // Increased from 350px
      flexShrink: 0
    }),
    perspective: '1000px'
  };
  const imageStyles: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
  };

  // Updated content styles for desktop layout
  const contentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    ...(isMobile ? {
      textAlign: 'center',
      width: '100%'
    } : {
      flex: 1,
      textAlign: 'center',
      alignItems: 'center',
      width: '800px', // Fixed wider width for horizontal text
      maxWidth: '800px',
      paddingLeft: '2rem' // Space from images
    })
  };

  // Name styles - centered above testimonial text for desktop
  const nameStyles: React.CSSProperties = {
    fontWeight: 'bold',
    marginBottom: isMobile ? '1rem' : '1.5rem',
    ...(isMobile ? {} : {
      textAlign: 'center',
      width: '100%'
    })
  };

  // Quote styles - full width for desktop to display horizontally 
  const quoteStyles: React.CSSProperties = {
    lineHeight: 1.75,
    marginBottom: isMobile ? '1.5rem' : '2rem',
    ...(isMobile ? {} : {
      width: '100%',
      textAlign: 'center' // Center align text
    })
  };

  // Arrow buttons styles - centered below testimonial text for desktop
  const arrowButtonsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '1.5rem',
    ...(isMobile ? {
      paddingTop: '1.5rem',
      justifyContent: 'center'
    } : {
      paddingTop: '0',
      justifyContent: 'center',
      width: '100%'
    })
  };

  const arrowButtonStyles: React.CSSProperties = {
    width: '2.7rem',
    height: '2.7rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none'
  };

  return <div style={containerStyles}>
      <div style={gridStyles} className="px-0 lg:px-[235px]">
        {/* Images */}
        <div 
          style={imageContainerStyles} 
          ref={imageContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {testimonials.map((testimonial, index) => <img key={testimonial.src} src={testimonial.src} alt={testimonial.name} style={{
          ...imageStyles,
          ...getImageStyle(index)
        }} data-index={index} />)}
        </div>
        {/* Content */}
        <div style={contentStyles}>
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} variants={quoteVariants} initial="initial" animate="animate" exit="exit" transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}>
              <h3 style={{
              ...nameStyles,
              color: colorName,
              fontSize: fontSizeName
            }}>
                {activeTestimonial.name}
              </h3>
              <motion.p style={{
              ...quoteStyles,
              color: colorTestimony,
              fontSize: fontSizeQuote
            }}>
                {activeTestimonial.quote.split(" ").map((word, i) => <motion.span key={i} initial={{
                filter: "blur(10px)",
                opacity: 0,
                y: 5
              }} animate={{
                filter: "blur(0px)",
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.22,
                ease: "easeInOut",
                delay: 0.025 * i
              }} style={{
                display: "inline-block"
              }}>
                    {word}&nbsp;
                  </motion.span>)}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          <div style={arrowButtonsStyles}>
            <button style={{
            ...arrowButtonStyles,
            backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg
          }} onClick={handlePrev} onMouseEnter={() => setHoverPrev(true)} onMouseLeave={() => setHoverPrev(false)} aria-label="Previous testimonial">
              <FaArrowLeft size={28} color={colorArrowFg} />
            </button>
            <button style={{
            ...arrowButtonStyles,
            backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg
          }} onClick={handleNext} onMouseEnter={() => setHoverNext(true)} onMouseLeave={() => setHoverNext(false)} aria-label="Next testimonial">
              <FaArrowRight size={28} color={colorArrowFg} />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default CircularTestimonials;
