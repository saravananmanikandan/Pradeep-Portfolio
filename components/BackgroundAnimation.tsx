import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Orb = ({ 
  color, 
  size, 
  initialX, 
  initialY, 
  delay = 0,
  duration = 20 
}: { 
  color: string; 
  size: string; 
  initialX: string | number; 
  initialY: string | number;
  delay?: number;
  duration?: number;
}) => {
  // Generate random movement patterns
  const randomX = [0, 30, -20, 40, 0];
  const randomY = [0, -40, 20, -30, 0];
  const randomScale = [1, 1.1, 0.9, 1.05, 1];

  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] md:blur-[120px] mix-blend-screen dark:mix-blend-screen opacity-60 dark:opacity-30 ${color} ${size}`}
      style={{ left: initialX, top: initialY }}
      animate={{
        x: randomX.map(v => v * 2), // Amplify movement slightly
        y: randomY.map(v => v * 2),
        scale: randomScale,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
};

export const BackgroundAnimation: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base Background Color - Deep Matte Black for Dark, Soft Sand/Grey for Light */}
      <div className="absolute inset-0 bg-[#F5F5F7] dark:bg-[#050505] transition-colors duration-500" />

      {/* SVG Noise Overlay for Texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] mix-blend-overlay" 
        style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* Floating Orbs - Antigravity Effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Top Left - Periwinkle/Blue */}
        <Orb 
            color="bg-brand-periwinkle dark:bg-indigo-900" 
            size="w-[40vw] h-[40vw] max-w-[600px] max-h-[600px]" 
            initialX="-10%" 
            initialY="-10%" 
            duration={25}
        />

        {/* Bottom Right - Warm/Sand */}
        <Orb 
            color="bg-orange-200 dark:bg-brand-sepia" 
            size="w-[50vw] h-[50vw] max-w-[700px] max-h-[700px]" 
            initialX="60%" 
            initialY="60%" 
            delay={5}
            duration={30}
        />

        {/* Center - Subtle Pulse */}
        <Orb 
            color="bg-blue-200 dark:bg-slate-800" 
            size="w-[30vw] h-[30vw] max-w-[500px] max-h-[500px]" 
            initialX="35%" 
            initialY="30%" 
            delay={2}
            duration={20}
        />
        
        {/* Antigravity Rising Particles (CSS only for performance) */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
            <div className="absolute bottom-0 left-[20%] w-1 h-1 bg-white rounded-full animate-float" style={{ animationDuration: '15s', animationDelay: '0s' }}></div>
            <div className="absolute bottom-0 left-[50%] w-2 h-2 bg-white rounded-full animate-float" style={{ animationDuration: '25s', animationDelay: '5s' }}></div>
            <div className="absolute bottom-0 left-[80%] w-1.5 h-1.5 bg-white rounded-full animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
};
