import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
  opacity: number;
}

export const Particles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = 600 * dpr; // Fixed height for hero section
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = '600px';
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000); // Increased particle density

      for (let i = 0; i < numParticles; i++) {
        const size = Math.random() * 3 + 1.5; // Increased particle size
        const opacity = Math.random() * 0.4 + 0.2; // Increased opacity range
        
        // Adjust color based on theme
        const color = theme === 'dark' 
          ? `hsla(217, 91%, 60%, ${opacity})` // Brighter blue for dark theme
          : `hsla(221, 83%, 53%, ${opacity})`; // Standard blue for light theme

        particles.current.push({
          x: Math.random() * (canvas.width / window.devicePixelRatio),
          y: Math.random() * (canvas.height / window.devicePixelRatio),
          size,
          color,
          speed: Math.random() * 0.8 + 0.2, // Slightly faster movement
          direction: Math.random() * Math.PI * 2,
          opacity
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      particles.current.forEach((particle) => {
        // Update position with smoother movement
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        // Bounce off edges with slight randomization
        if (particle.x < 0 || particle.x > canvas.width / window.devicePixelRatio) {
          particle.direction = Math.PI - particle.direction + (Math.random() * 0.2 - 0.1);
        }
        if (particle.y < 0 || particle.y > canvas.height / window.devicePixelRatio) {
          particle.direction = -particle.direction + (Math.random() * 0.2 - 0.1);
        }

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections with enhanced visibility
        particles.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 120; // Increased connection distance

          if (distance < maxDistance && distance > 0) {
            ctx.beginPath();
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, otherParticle.x, otherParticle.y
            );
            
            const baseColor = theme === 'dark' 
              ? 'rgba(59, 130, 246,' // Brighter blue for dark theme
              : 'rgba(37, 99, 235,'; // Standard blue for light theme

            gradient.addColorStop(0, `${baseColor}${0.2 * (1 - distance / maxDistance)})`);
            gradient.addColorStop(1, `${baseColor}0)`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme]); // Re-initialize when theme changes

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};