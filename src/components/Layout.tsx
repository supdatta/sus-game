import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PixelButton } from "./ui/pixel-button";
import "../index.css";
import { Outlet } from "react-router-dom";
import leavesBackground from "../assets/leaves.jpeg";
import brownBackground from "../assets/brown.png";
import pixelTexture from "../assets/pixel_texture.png";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActivePage = (path: string) => {
    // For home page, check if it's exactly "/sus-game/" or the root path
    if (path === "/sus-game/") {
      return location.pathname === "/sus-game/" || location.pathname === "/";
    }
    // For other pages, check if the pathname starts with the path
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative" style={{backgroundImage: `url(${pixelTexture}), url(${brownBackground})`, backgroundSize: "auto, cover", backgroundRepeat: "repeat, no-repeat", backgroundAttachment: "fixed", backgroundBlendMode: "overlay", opacity: 0.8}}>
      {/* Header */}
      <header className="border-b-4 border-border p-4 shadow-pixel sticky top-0 z-50" style={{backgroundImage: `url(${leavesBackground})`, backgroundSize: "repeat", backgroundRepeat: "repeat"}}>
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link to="/sus-game/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center" style={{boxShadow: "2px 2px 0 rgba(0,0,0,0.5)"}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl text-white whitespace-nowrap" style={{textShadow: "1px 1px 0 rgba(0,0,0,0.5)"}}>
              Sus-10-able Game
            </h1>
          </Link>

          <nav className="flex flex-wrap gap-3">
            <Link to="/sus-game/">
              <PixelButton 
                variant={isActivePage("/sus-game/") ? "primary" : "outline"}
                size="sm"
                className="nav-button"
              >
                Home
              </PixelButton>
            </Link>
            <Link to="/sus-game/dashboard">
              <PixelButton 
                variant={isActivePage("/sus-game/dashboard") ? "primary" : "outline"}
                size="sm"
                className="nav-button"
              >
                Quest
              </PixelButton>
            </Link>
            <Link to="/sus-game/resources">
              <PixelButton 
                variant={isActivePage("/sus-game/resources") ? "primary" : "outline"}
                size="sm"
                className="nav-button"
              >
                Rewards
              </PixelButton>
            </Link>
            <Link to="/sus-game/leaderboard">
              <PixelButton 
                variant={isActivePage("/sus-game/leaderboard") ? "primary" : "outline"}
                size="sm"
                className="nav-button"
              >
                Leaderboard
              </PixelButton>
            </Link>
            <Link to="/sus-game/eco-scan">
              <PixelButton 
                variant={isActivePage("/sus-game/eco-scan") ? "primary" : "outline"}
                size="sm"
                className="nav-button"
              >
                Eco-Scan
              </PixelButton>
            </Link>
            <Link to="/sus-game/teaching">
              <PixelButton 
                variant={isActivePage("/sus-game/teaching") ? "primary" : "outline"}
                size="sm"
                className="nav-button"
              >
                Teaching
              </PixelButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 relative" style={{backgroundImage: `url(${brownBackground})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${pixelTexture})`,
            backgroundSize: '32px',
            backgroundRepeat: 'repeat',
            backgroundBlendMode: 'overlay',
            opacity: 0.2,
          }}
        ></div>
        <div className="main-content-area relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-border p-4 text-center text-sm text-white" style={{backgroundImage: `url(${leavesBackground})`, backgroundSize: "repeat", backgroundRepeat: "repeat"}}>
        <div className="container mx-auto">
          <div className="flex justify-center gap-6 mb-3">
            <div className="w-6 h-6" style={{backgroundImage: "var(--pixel-leaf)", backgroundSize: "contain"}}></div>
            <div className="w-6 h-6" style={{backgroundImage: "var(--pixel-water)", backgroundSize: "contain"}}></div>
            <div className="w-6 h-6" style={{backgroundImage: "var(--pixel-sprout)", backgroundSize: "contain"}}></div>
          </div>
          <p style={{textShadow: "1px 1px 0 rgba(0,0,0,0.5)"}}>© 2025 Sus-10-able Game. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export { Layout };