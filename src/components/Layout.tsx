import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PixelButton } from "./ui/pixel-button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-4 border-border p-4 shadow-pixel">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary border-2 border-foreground"></div>
            <h1 className="font-pixel text-lg text-foreground">
              Sus-10-able Game
            </h1>
          </Link>

          <nav className="flex space-x-2">
            <Link to="/">
              <PixelButton 
                variant={isActivePage("/") ? "primary" : "outline"}
                size="sm"
              >
                Home
              </PixelButton>
            </Link>
            <Link to="/dashboard">
              <PixelButton 
                variant={isActivePage("/dashboard") ? "primary" : "outline"}
                size="sm"
              >
                Dashboard
              </PixelButton>
            </Link>
            <Link to="/resources">
              <PixelButton 
                variant={isActivePage("/resources") ? "primary" : "outline"}
                size="sm"
              >
                Levels
              </PixelButton>
            </Link>
            <Link to="/leaderboard">
              <PixelButton 
                variant={isActivePage("/leaderboard") ? "primary" : "outline"}
                size="sm"
              >
                Leaderboard
              </PixelButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t-4 border-border p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p className="font-pixel text-xs text-muted-foreground">
            © 2024 Sus-10-able Game - Learn to Save Our Planet
          </p>
        </div>
      </footer>
    </div>
  );
};

export { Layout };