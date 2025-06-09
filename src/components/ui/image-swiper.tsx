
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface ImageSwiperProps {
  images: string[];
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

export const ImageSwiper: React.FC<ImageSwiperProps> = ({
  images,
  cardWidth = 256,
  cardHeight = 352,
  className = "",
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null);
  const autoSwipeInterval = useRef<NodeJS.Timeout | null>(null);

  const [cardOrder, setCardOrder] = useState<number[]>(
    Array.from({ length: images.length }, (_, i) => i)
  );
  const [paused, setPaused] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return [];
    return [...cardStackRef.current.querySelectorAll(".image-card")] as HTMLElement[];
  }, []);

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards();
    return cards[0] || null;
  }, [getCards]);

  const updatePositions = useCallback(() => {
    const cards = getCards();
    cards.forEach((card, i) => {
      card.style.setProperty("--i", (i + 1).toString());
      card.style.setProperty("--swipe-x", "0px");
      card.style.setProperty("--swipe-rotate", "0deg");
      card.style.opacity = "1";
    });
  }, [getCards]);

  const swipeNext = useCallback(() => {
    const card = getActiveCard();
    if (!card) return;

    const direction = swipeCount % 2 === 0 ? 1 : -1;
    card.style.setProperty("--swipe-x", `${direction * 300}px`);
    card.style.setProperty("--swipe-rotate", `${direction * 20}deg`);

    setTimeout(() => {
      setCardOrder((prev) => {
        if (prev.length === 0) return [];
        return [...prev.slice(1), prev[0]];
      });
      setSwipeCount((prev) => prev + 1);
    }, 300);
  }, [getActiveCard, swipeCount]);

  useEffect(() => {
    if (!paused) {
      autoSwipeInterval.current = setInterval(() => {
        swipeNext();
      }, 1000);
    }
    return () => {
      if (autoSwipeInterval.current) clearInterval(autoSwipeInterval.current);
    };
  }, [paused, swipeNext]);

  useEffect(() => {
    updatePositions();
  }, [cardOrder, updatePositions]);

  useEffect(() => {
    const container = cardStackRef.current;
    if (!container) return;

    const pause = () => setPaused(true);
    const resume = () => setPaused(false);

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("touchstart", pause);
    container.addEventListener("touchend", resume);

    return () => {
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <section
      className={`relative grid place-content-center select-none ${className}`}
      ref={cardStackRef}
      style={{
        width: "min(420px, 90vw)",
        height: "min(420px, 90vw)",
        touchAction: "none",
        transformStyle: "preserve-3d",
        "--card-perspective": "700px",
        "--card-z-offset": "12px",
        "--card-y-offset": "7px",
        "--card-max-z-index": images.length.toString(),
        "--card-swap-duration": "0.3s",
      } as React.CSSProperties}
    >
      {cardOrder.map((originalIndex, displayIndex) => (
        <article
          key={`${images[originalIndex]}-${originalIndex}`}
          className="image-card absolute cursor-grab active:cursor-grabbing
                     place-self-center border border-slate-400 rounded-xl
                     shadow-md overflow-hidden will-change-transform transition-all duration-300
                     w-[300px] h-[300px] md:w-[384px] md:h-[384px]"
          style={{
            "--i": (displayIndex + 1).toString(),
            zIndex: images.length - displayIndex,
            transform: `perspective(var(--card-perspective))
                       translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                       translateY(calc(var(--card-y-offset) * var(--i)))
                       translateX(var(--swipe-x, 0px))
                       rotateY(var(--swipe-rotate, 0deg))`,
          } as React.CSSProperties}
        >
          <img
            src={images[originalIndex]}
            alt={`Swiper image ${originalIndex + 1}`}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
        </article>
      ))}
    </section>
  );
};
