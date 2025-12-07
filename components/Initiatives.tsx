import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Calendar, Newspaper, PenTool } from 'lucide-react';
import { BlogPost } from '../types';

type TabType = 'blogs' | 'events' | 'media';

const SpotlightCard: React.FC<{ item: BlogPost; index: number }> = ({ item, index }) => {
  const divRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  // Helper to extract text from content if excerpt is missing
  const getExcerpt = () => {
    if (item.excerpt?.rendered) return item.excerpt.rendered;
    if (item.content?.rendered) {
      const div = document.createElement('div');
      div.innerHTML = item.content.rendered;
      const text = div.textContent || div.innerText || '';
      return text.substring(0, 120) + '...';
    }
    return '';
  };

  return (
    <motion.a
      ref={divRef}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 overflow-hidden h-[340px] shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-500 backdrop-blur-md"
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(163, 180, 214, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Animated Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-periwinkle/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-md bg-slate-50 dark:bg-white/5">
                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-brand-periwinkle transition-colors">
                <ArrowRight size={16} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
        </div>

        <h3 
            className="font-display text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 line-clamp-2 group-hover:text-brand-periwinkle transition-colors leading-tight"
            dangerouslySetInnerHTML={{ __html: item.title.rendered }} 
        />
        
        <div 
            className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 font-light leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity"
            dangerouslySetInnerHTML={{ __html: getExcerpt() }} 
        />
      </div>

      <div className="relative z-10 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
         <span className="text-xs font-medium text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center gap-2">
            Read Full Story <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
         </span>
      </div>
    </motion.a>
  );
};

export const Initiatives: React.FC<{ onNavigate?: (page: 'initiatives') => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('blogs');
  const [data, setData] = useState<{
    blogs: BlogPost[];
    events: BlogPost[];
    media: BlogPost[];
  }>({ blogs: [], events: [], media: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, eventsRes, hinduRes] = await Promise.all([
          fetch('https://pradeepkanna.com/wp-json/wp/v2/posts?per_page=3'),
          fetch('https://pradeepkanna.com/wp-json/wp/v2/events?per_page=3'),
          fetch('https://pradeepkanna.com/wp-json/wp/v2/hindu_article?per_page=3')
        ]);

        const posts = await postsRes.json();
        const events = await eventsRes.json();
        const hindu = await hinduRes.json();

        setData({
          blogs: posts,
          events: events,
          media: hindu
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'blogs', label: 'Thoughts', icon: PenTool },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'media', label: 'Media', icon: Newspaper },
  ];

  const currentData = data[activeTab];

  return (
    <section id="initiatives" className="py-24 px-6 border-t border-slate-200 dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h2 className="font-display text-4xl font-bold mb-3 text-slate-900 dark:text-slate-100">Initiatives & Contributions</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                    Exploring the intersections of policy, culture, and technology through writing, public engagement, and journalism.
                </p>
            </div>
            
            {/* Custom Tab Navigation */}
            <div className="flex p-1 bg-slate-200/80 dark:bg-white/5 rounded-xl backdrop-blur-sm">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`
                                relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                                ${activeTab === tab.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
                            `}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-lg shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Icon size={16} />
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="min-h-[400px]">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-brand-periwinkle" size={40} />
                </div>
            ) : (
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <SpotlightCard key={item.id} item={item} index={index} />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                            <p className="text-slate-400">No recent content found in this category.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
        
        <div className="flex justify-center mt-12">
            <button 
                onClick={() => onNavigate && onNavigate('initiatives')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-periwinkle/20"
            >
                <span className="relative z-10">Explore All Initiatives</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-brand-periwinkle/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
        </div>
      </div>
    </section>
  );
};