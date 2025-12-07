import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Initiatives } from './components/Initiatives';
import { NetworkGame } from './components/NetworkGame';
import { FamilyHistory } from './components/FamilyHistory';
import { InitiativesPage } from './components/InitiativesPage';
import { Footer } from './components/Footer';
import { BackgroundAnimation } from './components/BackgroundAnimation';

function App() {
  const [view, setView] = useState<'home' | 'family-history' | 'initiatives'>('home');

  const handleNavigate = (page: 'home' | 'family-history' | 'initiatives', hash?: string) => {
    setView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page === 'home' && hash) {
      // Allow time for the Home view to render before scrolling to hash
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-200 selection:bg-brand-periwinkle/30 selection:text-brand-black dark:selection:text-white relative">
      <BackgroundAnimation />
      
      <div className="relative z-10">
        <Navbar currentView={view} onNavigate={handleNavigate} />
        
        <main>
          {view === 'home' ? (
            <>
              <Hero />
              <About />
              <Experience />
              <Initiatives onNavigate={handleNavigate} />
              <NetworkGame />
            </>
          ) : view === 'family-history' ? (
            <FamilyHistory />
          ) : (
            <InitiativesPage />
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;