import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PixelButton } from '../components/ui/pixel-button';
import heroBackgroundVideo from '/herosection.mp4';
import { PixelCard } from "../components/ui/pixel-card";
import { AuthModal } from "../components/auth/AuthModal";

// SVGs for the feature cards
const LearningSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-foreground relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);
const ImpactSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-foreground relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 13.62A10 10 0 0 1 12 22a10 10 0 0 1-9.5-8.38"></path><path d="M15.5 2a10 10 0 0 0-7.38 15.1"></path><path d="M2.5 10.38A10 10 0 0 1 12 2a10 10 0 0 1 9.5 8.38"></path><path d="M8.5 22a10 10 0 0 0-7.38-15.1"></path><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"></path></svg>
);
const ProgressSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-foreground relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8a2 2 0 0 1 0 2.8l-6 6a2 2 0 0 1-2.8 0l-4-4a2 2 0 0 1 0-2.8l6-6a2 2 0 0 1 2.8 0z"></path></svg>
);
const EcoScanSVG = () => (
    <svg className="w-4 h-4 text-secondary-foreground" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{imageRendering: 'pixelated'}}>
      <path d="M2 2H4V4H2V2ZM6 2H8V4H6V2ZM10 2H12V4H10V2ZM2 6H4V8H2V6ZM2 10H4V12H2V10ZM6 12H8V14H6V12ZM10 12H12V14H10V12ZM14 10H12V8H14V10ZM14 6H12V4H14V6ZM6 6H10V10H6V6Z" fill="currentColor"/>
    </svg>
);

const HomePage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openAuthModal = (mode: "login" | "signup") => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    closeAuthModal();
  };
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <>
      <style>{`
        /* --- CLEAN GLASS STYLE --- */
        .hero-card-style {
          --card: transparent; 
          background-color: rgba(255, 255, 255, 0.1) !important; /* Faint transparent base, texture removed */
          backdrop-filter: blur(4px); /* Slightly increased blur for effect */
          border-width: 2px;
        }

        /* --- STRONG TEXT OUTLINE FOR VISIBILITY --- */
        .hero-text-shadow {
          text-shadow: 
            2px 2px 0px #3C4423, 
            -2px 2px 0px #3C4423, 
            2px -2px 0px #3C4423, 
            -2px -2px 0px #3C4423;
        }
      `}</style>
      
      <div className="min-h-screen bg-background">
        
        {/* Hero Section with Full-screen Video */}
        <div className="relative h-screen text-white overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={heroBackgroundVideo}
            autoPlay loop muted playsInline
          ></video>
          
          <section className="relative h-full flex items-center justify-center">
            <div className="relative z-10 text-center max-w-xl mx-auto px-4">
              {/* --- HERO CARD WITH TRANSPARENT GLASS EFFECT --- */}
              <PixelCard className="hero-card-style relative overflow-hidden border-white/50">
                <div className="relative z-10 p-4">
                  <h1 className="font-pixel text-4xl md:text-5xl text-white mb-6 hero-text-shadow">
                    Sus-10-able Game
                  </h1>
                  <p className="font-pixel text-sm md:text-base text-white mb-8 leading-relaxed hero-text-shadow">
                    Join the ultimate environmental adventure! Learn about sustainability, complete eco-friendly challenges, and save our beautiful planet one quest at a time.
                  </p>
                  <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                    <Link to="/sus-game/dashboard">
                      <PixelButton variant="primary" size="lg" className="w-full md:w-auto">
                        <span>Start Quest</span>
                      </PixelButton>
                    </Link>
                    <Link to="/sus-game/eco-scan">
                      <PixelButton variant="secondary" size="lg" className="w-full md:w-auto flex items-center justify-center space-x-2">
                        <EcoScanSVG />
                        <span>Eco Scan</span>
                      </PixelButton>
                    </Link>
                  </div>
                </div>
              </PixelCard>
            </div>
          </section>
        </div>

        {/* Features Section */}
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-pixel text-xl md:text-2xl text-center text-foreground mb-12">
              Why Join Our Quest?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Feature Cards */}
              <PixelCard className="text-center hover:transform hover:-translate-y-1 transition-transform duration-200 bg-card">
                <div className="w-16 h-16 bg-primary border-4 border-foreground mx-auto mb-4 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-2 bg-primary-glow animate-pulse opacity-50"></div>
                  <LearningSVG />
                </div>
                <h3 className="font-pixel text-sm text-foreground mb-4">Interactive Learning</h3>
                <p className="font-pixel text-xs text-muted-foreground leading-relaxed">Discover environmental concepts through fun, gamified experiences</p>
              </PixelCard>
              <PixelCard className="text-center hover:transform hover:-translate-y-1 transition-transform duration-200 bg-card">
                <div className="w-16 h-16 bg-secondary border-4 border-foreground mx-auto mb-4 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-2 bg-secondary animate-pulse opacity-30"></div>
                  <ImpactSVG />
                </div>
                <h3 className="font-pixel text-sm text-foreground mb-4">Real Impact</h3>
                <p className="font-pixel text-xs text-muted-foreground leading-relaxed">Learn actions you can take to make a real difference in your community</p>
              </PixelCard>
              <PixelCard className="text-center hover:transform hover:-translate-y-1 transition-transform duration-200 bg-card">
                <div className="w-16 h-16 bg-accent border-4 border-foreground mx-auto mb-4 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-2 bg-accent animate-pulse opacity-40"></div>
                  <ProgressSVG />
                </div>
                <h3 className="font-pixel text-sm text-foreground mb-4">Track Progress</h3>
                <p className="font-pixel text-xs text-muted-foreground leading-relaxed">Monitor your environmental impact and compete with friends</p>
              </PixelCard>
            </div>
          </div>
        </section>
      </div>
      
      {/* FIXED BUTTONS (Unchanged) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2">
          {!isLoggedIn ? (
            <>
              <PixelButton variant="outline" size="sm" onClick={() => openAuthModal("login")} className="bg-background/80 backdrop-blur-sm">Login</PixelButton>
              <PixelButton variant="primary" size="sm" onClick={() => openAuthModal("signup")} className="bg-primary/80 backdrop-blur-sm">Sign Up</PixelButton>
            </>
          ) : (
            <PixelButton variant="outline" size="sm" onClick={handleLogout} className="bg-background/80 backdrop-blur-sm text-destructive-foreground border-destructive hover:bg-destructive hover:text-destructive-foreground">Logout</PixelButton>
          )}
        </div>
        <Link to="/sus-game/teaching">
          <PixelButton variant="accent" size="sm" className="shadow-pixel animate-pixel-glow">Teaching Modules</PixelButton>
        </Link>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        mode="login"
        onModeChange={(mode) => console.log("Auth mode changed:", mode)}
      /> 
    </>
  );
};

export default HomePage;
