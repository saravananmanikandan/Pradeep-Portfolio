import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const content = [
  "I am an Electrical and Electronics Engineer",
  "bridging the gap between Technology, Policy, and Culture.",
  "Currently serving as Chief of Staff at YNOS Venture Engine,",
  "I guide the Indian startup ecosystem under Prof. Thillai Rajan,",
  "translating data into actionable policy frameworks.",
  "Previously, I managed strategic partnerships for India Speaks Ai",
  "during the June 2024 Election Cycle,",
  "leveraging technology for large-scale democratic outreach.",
  "Beyond the digital realm, I am deeply rooted in history,",
  "leading the Madurai Local History Group",
  "to preserve the 19th-century heritage of my hometown.",
  "I build systems that last."
];

const TextLine: React.FC<{ text: string; index: number; total: number }> = ({ text, index, total }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.2, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.95, 1.05, 0.95]);
  const x = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [-20, 0, -20]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, scale, x }}
      className="py-4 md:py-6"
    >
      <span className="font-display text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-400 dark:from-white dark:to-slate-400 leading-tight block">
        {text}
      </span>
    </motion.div>
  );
};

export const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center items-center py-24 px-6 relative overflow-hidden">
      {/* Subtle Background Glow - Kept but made more subtle to blend with global animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-periwinkle/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl w-full relative z-10 text-center">
        {content.map((line, i) => (
          <TextLine key={i} text={line} index={i} total={content.length} />
        ))}
      </div>
    </section>
  );
};