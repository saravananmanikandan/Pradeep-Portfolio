import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDownRight, Move } from 'lucide-react';

// --- Physics Circles Component ---
const PhysicsCircles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const colors = ['#FCD34D', '#60A5FA', '#34D399', '#F87171', '#A78BFA'];
    const balls: any[] = [];
    const numBalls = 50;
    const mouse = { x: -1000, y: -1000 };

    class Ball {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      gravity: number;
      friction: number;

      constructor() {
        this.radius = Math.random() * 20 + 10;
        this.x = Math.random() * width;
        this.y = Math.random() * height - height; // Start above
        this.vx = 0;
        this.vy = 0;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.gravity = 0.6;
        this.friction = 0.7;
      }

      update() {
        // Gravity
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        // Floor collision
        if (this.y + this.radius > height) {
          this.y = height - this.radius;
          this.vy *= -this.friction;
        }

        // Wall collision
        if (this.x + this.radius > width) {
          this.x = width - this.radius;
          this.vx *= -this.friction;
        } else if (this.x - this.radius < 0) {
          this.x = this.radius;
          this.vx *= -this.friction;
        }

        // Mouse Repulsion (Crush effect)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 20;
          const pushY = Math.sin(angle) * force * 20;
          
          this.vx -= pushX;
          this.vy -= pushY;
        }

        this.draw();
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }

    // Init balls
    for (let i = 0; i < numBalls; i++) {
      balls.push(new Ball());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      balls.forEach(ball => ball.update());
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full bg-[#1A1A1A]" />;
};

// --- Elastic String Component ---
const ElasticString = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseY = useMotionValue(50); // Vertical center relative percent

  // Spring physics for the string bounce back
  const pathY = useSpring(mouseY, { stiffness: 300, damping: 10 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    
    // Normalize to 0-100 range for the SVG path logic
    const height = rect.height;
    const yPercent = (relativeY / height) * 100;
    
    // Clamp
    const clampedY = Math.min(Math.max(yPercent, 0), 100);
    mouseY.set(clampedY);
  };

  const handleMouseLeave = () => {
    mouseY.set(50); // Snap back to center
    setIsHovered(false);
  };

  // Convert spring value to path definition string
  const pathD = useTransform(pathY, (y) => {
    return `M0 50 Q 150 ${y} 300 50`; 
  });

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative flex items-center justify-center bg-[#1A1A1A] overflow-hidden cursor-row-resize"
    >
        <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
            <span className="text-xs font-mono text-white/30 pointer-events-none tracking-widest">INTERACTIVE</span>
        </div>
        <svg viewBox="0 0 300 100" className="w-full h-full pointer-events-none preserve-3d" preserveAspectRatio="none">
            <motion.path 
                d={pathD} 
                fill="none" 
                stroke={isHovered ? "#FCD34D" : "#ffffff"} 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
            />
        </svg>
    </div>
  );
};

export const Hero: React.FC = () => {
  const [isPolaroidHovered, setIsPolaroidHovered] = useState(false);

  return (
    <section id="home" className="min-h-screen pt-24 pb-8 px-2 md:px-4 flex flex-col font-sans overflow-hidden">
      
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 auto-rows-[minmax(0,auto)]">
        
        {/* --- Top Row: Identity (Full Width) --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-12 h-[55vh] min-h-[400px] bg-[#1A1A1A]/90 backdrop-blur-md rounded-[2rem] border border-white/5 relative flex items-center justify-center overflow-hidden group shadow-2xl"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            
            <div className="relative z-10 flex flex-col items-center text-center pointer-events-none">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-4 md:mb-6"
                >
                    <span className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                    <p className="font-mono text-sm md:text-base text-white/50 tracking-widest uppercase">Hello, I'm</p>
                </motion.div>
                
                <h1 className="font-display text-[12vw] font-bold text-white leading-[0.9] tracking-tighter mix-blend-screen transition-all duration-500">
                    Pradeep <span className={`transition-opacity duration-500 ${isPolaroidHovered ? 'opacity-20' : 'opacity-100'}`}>Kanna.</span>
                </h1>
            </div>

            {/* Draggable Polaroid */}
            <motion.div 
                drag
                dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
                whileHover={{ scale: 1.05, rotate: 2, cursor: 'grab' }}
                whileDrag={{ scale: 1.1, rotate: 0, cursor: 'grabbing' }}
                onMouseEnter={() => setIsPolaroidHovered(true)}
                onMouseLeave={() => setIsPolaroidHovered(false)}
                className="absolute right-[5%] md:right-[15%] top-[20%] w-56 md:w-72 p-3 pb-12 bg-white shadow-2xl rotate-[6deg] hidden md:block cursor-grab active:cursor-grabbing"
            >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-12 bg-accent-blue/30 rotate-12 backdrop-blur-sm z-20 rounded-sm"></div>
                <div className="w-full aspect-[4/5] bg-slate-200 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                    <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Pradeep" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>

             {/* Decorative Elements */}
             <div className="absolute top-10 left-10 text-white/10 hidden md:block">
                <Move size={24} />
             </div>
        </motion.div>


        {/* --- Bottom Row: Roles & Interactive --- */}

        {/* Box 1: Roles Description */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 h-[300px] bg-[#1A1A1A]/90 backdrop-blur-md rounded-[2rem] p-8 md:p-10 flex flex-col justify-between border border-white/5 group relative overflow-hidden shadow-xl"
        >
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-[80px] group-hover:bg-accent-purple/10 transition-colors" />
             
             <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                   Engineer. Journalist. Historian.
                </h3>
                <p className="font-display text-3xl md:text-4xl font-bold text-white/30 leading-tight">
                   Startup Generalist.
                </p>
             </div>

             <div className="flex items-center justify-between">
                <span className="px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-white/50 uppercase tracking-wider group-hover:bg-white/5 transition-colors">
                    Based in India
                </span>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white text-white group-hover:text-black transition-all duration-300">
                    <ArrowDownRight size={20} />
                </div>
             </div>
        </motion.div>

        {/* Box 2: Physics Circles */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 h-[300px] bg-[#1A1A1A] rounded-[2rem] overflow-hidden border border-white/5 relative group shadow-xl"
        >   
            <div className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity opacity-100 group-hover:opacity-0">
                <span className="text-xs font-bold text-white/80 tracking-wider">PHYSICS PLAYGROUND</span>
            </div>
            <PhysicsCircles />
        </motion.div>

        {/* Box 3: Elastic String */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 h-[300px] bg-[#1A1A1A] rounded-[2rem] overflow-hidden border border-white/5 shadow-xl"
        >
            <ElasticString />
        </motion.div>

      </div>
    </section>
  );
};