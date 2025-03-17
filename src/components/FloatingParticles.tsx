
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
  const colors = ['#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2'];

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

    // Initialize particles
    const particleCount = Math.floor(dimensions.width / 15); // Adjust based on width
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    particlesRef.current = particles;

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      particlesRef.current.forEach(particle => {
        // Drawing
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
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
          newX += distanceX * 0.01;
          newY += distanceY * 0.01;
        } else {
          // Normal floating movement
          newX += Math.sin(Date.now() * 0.001 * particle.speed) * 0.5;
          newY += Math.cos(Date.now() * 0.001 * particle.speed) * 0.5;
          
          // Boundary check
          if (newX < 0) newX = dimensions.width;
          if (newX > dimensions.width) newX = 0;
          if (newY < 0) newY = dimensions.height;
          if (newY > dimensions.height) newY = 0;
        }

        return {
          ...particle,
          x: newX,
          y: newY,
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
  }, [dimensions, isHovered]);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn("absolute inset-0 pointer-events-none z-0", className)}
      width={dimensions.width}
      height={dimensions.height}
    />
  );
};

export default FloatingParticles;
