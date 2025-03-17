
import React, { useRef, useEffect, useState } from 'react';
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

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  className,
  isHovered = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  
  // Enhanced color palette for a more refined look
  const colors = ['#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2', '#FFE098', '#FFF4B0'];
  const isEnhanced = className?.includes('enhanced-particles');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const container = canvas.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        setDimensions({ width, height });
        canvas.width = width;
        canvas.height = height;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Initialize particles with more variety for enhanced version
    const particleCount = isEnhanced 
      ? Math.floor(dimensions.width / 10) // More particles for enhanced version
      : Math.floor(dimensions.width / 15);
    
    // Adjust particle count for mobile screens to improve performance
    const isMobile = window.innerWidth < 768;
    const adjustedParticleCount = isMobile ? particleCount * 0.7 : particleCount;
    
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

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions.width, dimensions.height, isEnhanced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
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

      // Update positions
      particlesRef.current = particlesRef.current.map(particle => {
        // Center coordinates (for hover effect)
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;

        let newX = particle.x;
        let newY = particle.y;

        if (isHovered) {
          // Move particles toward center when hovered
          const distanceX = centerX - particle.x;
          const distanceY = centerY - particle.y;
          
          // Enhanced gather effect with slight pulsing
          const gatherSpeed = isEnhanced ? 0.015 : 0.01;
          newX += distanceX * gatherSpeed;
          newY += distanceY * gatherSpeed;
          
          // Add subtle pulse effect when hovered
          const pulseFactor = Math.sin(Date.now() * 0.003) * 0.25;
          newX += distanceX * pulseFactor * 0.007;
          newY += distanceY * pulseFactor * 0.007;
        } else {
          // Normal floating movement - gentler on mobile for performance
          const isMobile = window.innerWidth < 768;
          const floatSpeed = isMobile ? 
            (isEnhanced ? 0.4 : 0.3) : 
            (isEnhanced ? 0.6 : 0.5);
          
          newX += Math.sin(Date.now() * 0.001 * particle.speed) * floatSpeed;
          newY += Math.cos(Date.now() * 0.001 * particle.speed) * floatSpeed;
          
          // Boundary check
          if (newX < 0) newX = dimensions.width;
          if (newX > dimensions.width) newX = 0;
          if (newY < 0) newY = dimensions.height;
          if (newY > dimensions.height) newY = 0;
        }

        // More dynamic size and opacity changes when hovered
        const sizePulse = isHovered ? 
          Math.sin(Date.now() * 0.004) * 0.15 : 
          Math.sin(Date.now() * 0.002) * 0.1;
          
        const opacityPulse = isHovered ?
          Math.sin(Date.now() * 0.006) * 0.25 : 
          Math.sin(Date.now() * 0.004) * 0.2;

        return {
          ...particle,
          x: newX,
          y: newY,
          // Enhanced size pulsing
          size: isEnhanced || isHovered ? 
            particle.size * (1 + sizePulse) : 
            particle.size,
          // Enhanced opacity pulsing
          opacity: (isEnhanced || isHovered) ? 
            particle.opacity * (1 + opacityPulse) : 
            particle.opacity
        };
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

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
};

export default FloatingParticles;
