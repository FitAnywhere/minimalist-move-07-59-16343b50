
import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  glow: number;
}

interface FloatingParticlesProps {
  className?: string;
  isHovered?: boolean;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = memo(({ 
  className,
  isHovered = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameRateRef = useRef<number>(0);
  
  // Enhanced color palette for a more refined look
  const colors = ['#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2', '#FFE098', '#FFF4B0'];
  const isEnhanced = className?.includes('enhanced-particles');

  // Memoize dimension update function
  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      if (width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height });
        canvas.width = width;
        canvas.height = height;
      }
    }
  }, [dimensions.width, dimensions.height]);

  // Initialize particles once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    // Initialize particles with more variety for enhanced version
    const particleCount = isEnhanced 
      ? Math.floor(dimensions.width / 10) // More particles for enhanced version
      : Math.floor(dimensions.width / 15);
    
    // Adjust particle count for mobile screens to improve performance
    const isMobile = window.innerWidth < 768;
    const adjustedParticleCount = isMobile ? Math.floor(particleCount * 0.6) : particleCount;
    
    const particles: Particle[] = [];

    for (let i = 0; i < adjustedParticleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * (isEnhanced ? 2.5 : 2) + (isEnhanced ? 0.8 : 1),
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + (isEnhanced ? 0.3 : 0.2),
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: isEnhanced ? Math.random() * 5 + 2 : Math.random() * 3 + 1
      });
    }

    particlesRef.current = particles;
  }, [dimensions.width, dimensions.height, isEnhanced]);

  // Handle window resize with throttling
  useEffect(() => {
    const handleResize = () => {
      if (frameRateRef.current % 5 === 0) { // Only update dimensions every 5 frames
        updateDimensions();
      }
    };

    updateDimensions();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDimensions]);

  // Animation loop with frame rate control
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const drawParticles = (timestamp: number) => {
      // Control frame rate (target 30fps for better performance)
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed < 33) { // ~30fps (1000ms / 30 = 33.33ms per frame)
        animationRef.current = requestAnimationFrame(drawParticles);
        return;
      }

      lastTimeRef.current = timestamp;
      frameRateRef.current++;
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      particlesRef.current.forEach(particle => {
        // Drawing with enhanced glow
        ctx.beginPath();
        
        // Create glow effect
        if (isEnhanced || isHovered) {
          const glowIntensity = isHovered ? particle.glow * 1.4 : particle.glow;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * glowIntensity
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.globalAlpha = particle.opacity * (isHovered ? 0.5 : 0.4);
          ctx.arc(particle.x, particle.y, particle.size * glowIntensity, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity * (isHovered ? 1.2 : 1);
        ctx.fill();
      });

      // Update positions - optimized calculations
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const now = Date.now() * 0.001;
      const isMobile = window.innerWidth < 768;
      
      particlesRef.current = particlesRef.current.map(particle => {
        let newX = particle.x;
        let newY = particle.y;

        if (isHovered) {
          // Move particles toward center when hovered - optimized calculation
          const distanceX = centerX - particle.x;
          const distanceY = centerY - particle.y;
          
          // Enhanced gather effect with slight pulsing
          const gatherSpeed = isEnhanced ? 0.015 : 0.01;
          newX += distanceX * gatherSpeed;
          newY += distanceY * gatherSpeed;
          
          // Add subtle pulse effect when hovered - using pre-calculated sine value
          const pulseFactor = Math.sin(now * 3) * 0.25;
          newX += distanceX * pulseFactor * 0.007;
          newY += distanceY * pulseFactor * 0.007;
        } else {
          // Normal floating movement - gentler on mobile for performance
          const floatSpeed = isMobile ? 
            (isEnhanced ? 0.4 : 0.3) : 
            (isEnhanced ? 0.6 : 0.5);
          
          // Pre-calculate sin/cos values for performance
          const sinVal = Math.sin(now * particle.speed);
          const cosVal = Math.cos(now * particle.speed);
          
          newX += sinVal * floatSpeed;
          newY += cosVal * floatSpeed;
          
          // Boundary check - optimized to avoid unnecessary calculations
          if (newX < 0) newX = dimensions.width;
          else if (newX > dimensions.width) newX = 0;
          if (newY < 0) newY = dimensions.height;
          else if (newY > dimensions.height) newY = 0;
        }

        // More efficient calculation of size and opacity pulsing
        const commonSinValue = Math.sin(now * 2);
        
        const sizePulse = isHovered ? 
          commonSinValue * 0.15 : 
          commonSinValue * 0.1;
          
        const opacityPulse = isHovered ?
          commonSinValue * 0.25 : 
          commonSinValue * 0.2;

        return {
          ...particle,
          x: newX,
          y: newY,
          // Enhanced size pulsing - more efficient calculation
          size: isEnhanced || isHovered ? 
            particle.size * (1 + sizePulse) : 
            particle.size,
          // Enhanced opacity pulsing - more efficient calculation
          opacity: (isEnhanced || isHovered) ? 
            particle.opacity * (1 + opacityPulse) : 
            particle.opacity
        };
      });

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    animationRef.current = requestAnimationFrame(drawParticles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isHovered, isEnhanced]);

  // Use touch events for mobile compatibility
  const handleTouch = (event: React.TouchEvent) => {
    event.preventDefault();
    // The hover effect will be handled by the parent component
  };

  return (
    <canvas 
      ref={canvasRef} 
      className={cn("absolute inset-0 pointer-events-none z-0", className)}
      width={dimensions.width}
      height={dimensions.height}
      onTouchStart={handleTouch}
      onTouchEnd={handleTouch}
    />
  );
});

FloatingParticles.displayName = 'FloatingParticles';

export default FloatingParticles;
