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
  vx: number; // Added velocity x
  vy: number; // Added velocity y
  targetX: number; // Added target position x
  targetY: number; // Added target position y
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
      canvas.height = 650 * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = '720px';
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const initParticles = () => {
      particles.current = [];
      const isMobile = window.innerWidth < 768;
      const baseParticleCount = isMobile ? 15000 : 8000;
      const numParticles = Math.floor((canvas.width * canvas.height) / baseParticleCount);

      for (let i = 0; i < numParticles; i++) {
        const size = Math.random() * (isMobile ? 2 : 3) + 1.5;
        const opacity = Math.random() * 0.4 + 0.2;
        const color = theme === 'dark' 
          ? `hsla(217, 91%, 60%, ${opacity})`
          : `hsla(221, 83%, 53%, ${opacity})`;

        const x = Math.random() * (canvas.width / window.devicePixelRatio);
        const y = Math.random() * (canvas.height / window.devicePixelRatio);

        particles.current.push({
          x,
          y,
          size,
          color,
          speed: Math.random() * (isMobile ? 0.6 : 0.8) + 0.2,
          direction: Math.random() * Math.PI * 2,
          opacity,
          vx: 0, // Initial velocity x
          vy: 0, // Initial velocity y
          targetX: x, // Initial target position
          targetY: y
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      particles.current.forEach((particle) => {
        // Update target position
        particle.targetX += Math.cos(particle.direction) * particle.speed;
        particle.targetY += Math.sin(particle.direction) * particle.speed;

        // Bounce off edges
        if (particle.targetX < 0 || particle.targetX > canvas.width / window.devicePixelRatio) {
          particle.direction = Math.PI - particle.direction + (Math.random() * 0.2 - 0.1);
        }
        if (particle.targetY < 0 || particle.targetY > canvas.height / window.devicePixelRatio) {
          particle.direction = -particle.direction + (Math.random() * 0.2 - 0.1);
        }

        // Smooth movement with easing
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        
        // Add velocity with friction
        particle.vx += dx * 0.1; // Acceleration factor (adjust for speed)
        particle.vy += dy * 0.1;
        particle.vx *= 0.95; // Friction/damping (adjust for smoothness)
        particle.vy *= 0.95;

        // Update position with velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        const isMobile = window.innerWidth < 768;
        const maxDistance = isMobile ? 80 : 120;

        particles.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance && distance > 0) {
            ctx.beginPath();
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, otherParticle.x, otherParticle.y
            );
            const baseColor = theme === 'dark' 
              ? 'rgba(59, 130, 246,'
              : 'rgba(37, 99, 235,';

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

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme]);

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