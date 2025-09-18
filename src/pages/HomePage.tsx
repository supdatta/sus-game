import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PixelButton } from '@/components/ui/pixel-button';
import heroBackgroundImage from '../assets/hero-background.png';
import { Button } from "@/components/ui/button";
import Medal from "../assets/medal.svg?react";
import Plant from "../assets/plant.svg?react";
import Books from "../assets/books.svg?react";
import { PixelCard } from "@/components/ui/pixel-card";
import { AuthModal } from "../components/auth/AuthModal";
import character1Img from "../assets/character-1.png";
import character2Img from "../assets/character-2.png";

const HomePage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = (mode: "login" | "signup") => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero-background.mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/sus-game/hero-background.png"
      ></video>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        {/* The video is now directly referenced in the main video tag above, this section is redundant */}
        {/* <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ imageRendering: "pixelated" }}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroBackgroundVideo} type="video/mp4" />
        </video> */}
        <div className="absolute inset-0 bg-background/10"></div>
        
        <div className="relative z-10 text-center max-w-xl mx-auto px-4">
          {/* Floating decorative elements */}
          <div className="absolute -top-10 -left-10 w-8 h-8 bg-primary/30 border-2 border-primary animate-pixel-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -top-5 -right-15 w-6 h-6 bg-secondary/30 border-2 border-secondary animate-pixel-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-8 left-20 w-10 h-10 bg-accent/30 border-2 border-accent animate-pixel-bounce" style={{animationDelay: '1.5s'}}></div>
          
          <PixelCard className="bg-background/20 backdrop-blur-sm relative overflow-hidden border-white/30">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-4 h-4 bg-primary border border-primary-glow animate-pulse"></div>
              <div className="absolute top-8 right-8 w-3 h-3 bg-secondary border border-secondary animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-6 left-12 w-5 h-5 bg-accent border border-accent animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            <div className="relative z-10">
              <h1 className="font-pixel text-2xl md:text-4xl text-white mb-6 animate-pixel-bounce drop-shadow-lg">
                Sus-10-able Game
              </h1>
              
              <p className="font-pixel text-xs md:text-sm text-white/90 mb-8 leading-relaxed drop-shadow-md">
                Join the ultimate environmental adventure! Learn about sustainability,
                complete eco-friendly challenges, and save our beautiful planet
                one quest at a time.
              </p>
              
              {/* Visual stats/features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/20 border-2 border-primary mx-auto mb-2 flex items-center justify-center">
                    <Plant className="h-full w-full" />
                  </div>
                  <p className="font-pixel text-xs text-white/80">Fun Games</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-secondary/20 border-2 border-secondary mx-auto mb-2 flex items-center justify-center">
                    <Medal className="h-full w-full" />
                  </div>
                  <p className="font-pixel text-xs text-white/80">Rewards</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-accent/20 border-2 border-accent mx-auto mb-2 flex items-center justify-center">
                    <Books className="h-full w-full" />
                  </div>
                  <p className="font-pixel text-xs text-white/80">Learn</p>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                <Link to="/sus-game/dashboard">
                  <PixelButton variant="hero" size="lg" className="w-full md:w-auto">
                    Start Quest
                  </PixelButton>
                </Link>
                
                <Link to="/sus-game/resources">
                  <PixelButton variant="secondary" size="lg" className="w-full md:w-auto">
                    Learn More
                  </PixelButton>
                </Link>
              </div>
            </div>
          </PixelCard>
        </div>
      </section>

      {/* Features Section */}
       <section className="py-20 bg-background relative overflow-hidden">
        {/* Floating Character Decorations */}
        <div className="absolute top-10 left-10 w-16 h-20 opacity-30 animate-pixel-bounce" style={{animationDelay: '0.5s'}}>
          <img src={character1Img} alt="Character" className="w-full h-full object-contain" style={{imageRendering: 'pixelated'}} />
        </div>
        <div className="absolute top-40 right-20 w-20 h-24 opacity-20 animate-pixel-bounce" style={{animationDelay: '1.5s'}}>
          <img src={character2Img} alt="Character" className="w-full h-full object-contain" style={{imageRendering: 'pixelated'}} />
        </div>
        
        {/* Decorative pixel elements */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-primary/20 border border-primary animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-secondary/20 border border-secondary animate-pulse" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute top-1/2 left-20 w-3 h-3 bg-accent/20 border border-accent animate-pulse" style={{animationDelay: '1.2s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-pixel text-xl md:text-2xl text-center text-foreground mb-12">
            Why Join Our Quest?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <PixelCard className="text-center hover:transform hover:-translate-y-1 transition-transform duration-200">
              <div className="w-16 h-16 bg-primary border-4 border-foreground mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-2 bg-primary-glow animate-pulse opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🎓</div>
              </div>
              <h3 className="font-pixel text-sm text-foreground mb-4">
                Interactive Learning
              </h3>
              <p className="font-pixel text-xs text-muted-foreground leading-relaxed">
                Discover environmental concepts through fun, gamified experiences
              </p>
            </PixelCard>
            
            <PixelCard className="text-center hover:transform hover:-translate-y-1 transition-transform duration-200">
              <div className="w-16 h-16 bg-secondary border-4 border-foreground mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-2 bg-secondary animate-pulse opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🌱</div>
              </div>
              <h3 className="font-pixel text-sm text-foreground mb-4">
                Real Impact
              </h3>
              <p className="font-pixel text-xs text-muted-foreground leading-relaxed">
                Learn actions you can take to make a real difference in your community
              </p>
            </PixelCard>
            
            <PixelCard className="text-center hover:transform hover:-translate-y-1 transition-transform duration-200">
              <div className="w-16 h-16 bg-accent border-4 border-foreground mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-2 bg-accent animate-pulse opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">📊</div>
              </div>
              <h3 className="font-pixel text-sm text-foreground mb-4">
                Track Progress
              </h3>
              <p className="font-pixel text-xs text-muted-foreground leading-relaxed">
                Monitor your environmental impact and compete with friends
              </p>
            </PixelCard>
          </div>
        </div>
      </section>
    
      {/* Teaching Modules Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link to="/sus-game/teaching">
          <PixelButton 
            variant="accent" 
            size="sm"
            className="shadow-pixel animate-pixel-glow"
          >
            Teaching Modules
          </PixelButton>
        </Link>
      </div>

      {/* Auth Buttons - Fixed Top Right */}
      <div className="fixed top-20 right-6 z-50 flex flex-col space-y-2">
        <PixelButton 
          variant="outline" 
          size="sm"
          onClick={() => openAuthModal("login")}
          className="bg-background/80 backdrop-blur-sm border-primary hover:bg-primary hover:text-primary-foreground"
        >
          Login
        </PixelButton>
        <PixelButton 
          variant="primary" 
          size="sm"
          onClick={() => openAuthModal("signup")}
          className="bg-primary/80 backdrop-blur-sm"
        >
          Sign Up
        </PixelButton>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        mode="login" // Default mode, can be changed by openAuthModal
        onModeChange={(mode) => console.log("Auth mode changed:", mode)} // Placeholder for actual mode change logic
      />  
        
    
    </div>
  );
};

export default HomePage;