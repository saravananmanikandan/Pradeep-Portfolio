import React from 'react';
import { Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#F5F5F7] dark:bg-brand-black pt-24 pb-8 border-t border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-500 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-8 text-slate-900 dark:text-slate-100">Let's Connect.</h2>
            <div className="flex flex-col gap-4 items-start">
              <a 
                href="mailto:pradeepkanna585@gmail.com"
                className="flex items-center gap-3 text-xl text-slate-600 dark:text-slate-400 hover:text-accent-red transition-colors group"
              >
                <div className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:bg-accent-red/10 transition-colors">
                    <Mail size={20} />
                </div>
                pradeepkanna585@gmail.com
              </a>
              <a 
                href="https://linkedin.com/in/pradeepkanna" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-xl text-slate-600 dark:text-slate-400 hover:text-accent-blue transition-colors group"
              >
                <div className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:bg-accent-blue/10 transition-colors">
                    <Linkedin size={20} />
                </div>
                LinkedIn Profile
              </a>
              <a 
                href="#"
                className="flex items-center gap-3 text-xl text-slate-600 dark:text-slate-400 hover:text-accent-green transition-colors group"
              >
                 <div className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:bg-accent-green/10 transition-colors">
                    <ArrowUpRight size={20} />
                </div>
                Taptol
              </a>
            </div>
          </div>
          
          <div className="flex flex-col justify-end items-start md:items-end text-right">
             <p className="text-slate-500 dark:text-slate-500 max-w-sm text-left md:text-right mb-6">
                Open for collaborations on Policy Research, Heritage Conservation, and Strategic Tech Initiatives.
             </p>
             <div className="text-slate-600 dark:text-slate-600 text-sm">
                &copy; 2025 Pradeep Kanna Ravichandran.<br/>All Rights Reserved.
             </div>
          </div>
        </div>
      </div>

      {/* Footer Ticker */}
      <div className="w-full bg-brand-periwinkle/5 border-y border-slate-200 dark:border-white/5 py-3 relative overflow-hidden flex items-center">
        <div className="animate-ticker whitespace-nowrap flex gap-16 items-center">
          {[1,2,3,4].map(i => (
             <React.Fragment key={i}>
                <span className="text-slate-500 dark:text-slate-400 font-display text-lg uppercase tracking-wider hover:text-accent-purple transition-colors">Recognition: Invited to PM's Meeting (Feb 2025)</span>
                <span className="w-2 h-2 rounded-full bg-accent-yellow/50"></span>
                <span className="text-slate-500 dark:text-slate-400 font-display text-lg uppercase tracking-wider hover:text-accent-aqua transition-colors">Ministry of Textiles Report</span>
                <span className="w-2 h-2 rounded-full bg-accent-red/50"></span>
                <span className="text-slate-500 dark:text-slate-400 font-display text-lg uppercase tracking-wider hover:text-accent-green transition-colors">Bharat Tex 2025</span>
                <span className="w-2 h-2 rounded-full bg-accent-blue/50"></span>
             </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};
