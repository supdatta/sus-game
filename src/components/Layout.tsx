import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PixelButton } from "./ui/pixel-button";
import "../index.css";
import leavesBackground from "../assets/leaves.jpeg";
import brownBackground from "../assets/brown.png";
import pixelTexture from "../assets/pixel_texture.png";
import { AuthContext } from "@/context/AuthContext";
import captyImg from "../assets/Capty_Website_Wali.png";
import dattaImg from "../assets/Datta_Website_Wala.png";

export function Layout() {
  const location = useLocation();
  const isActivePage = (path: string) => location.pathname === path;

  // Award +5 eco points when exiting any game route ("/game/*")
  const auth = React.useContext(AuthContext);
  const prevPathRef = React.useRef(location.pathname);
  React.useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;
    const wasInGame = prev.includes('/game/');
    const nowInGame = curr.includes('/game/');
    if (wasInGame && !nowInGame) {
      auth?.addEcoPoints?.(5, 'Game/quest session completed');
    }
    prevPathRef.current = curr;
  }, [location.pathname]);

  // Grant pending external game reward on return
  React.useEffect(() => {
    const pending = localStorage.getItem('pendingExternalGame');
    if (pending === '1') {
      auth?.addEcoPoints?.(5, 'Game/quest session completed');
      localStorage.removeItem('pendingExternalGame');
    }
  }, []);

  // Corrected navigation links without the `/sus-game/` prefix
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Quest" },
    { path: "/resources", label: "Rewards" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/eco-scan", label: "Eco-Scan" },
    { path: "/teaching", label: "Teaching" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative" style={{backgroundImage: `url(${pixelTexture}), url(${brownBackground})`, backgroundSize: "auto, cover", backgroundRepeat: "repeat, no-repeat", backgroundAttachment: "fixed", backgroundBlendMode: "overlay", opacity: 0.8}}>
      {/* Character-styled eco points banner */}
      <PointsBanner />
      <header className="border-b-4 border-border p-4 shadow-pixel sticky top-0 z-50" style={{backgroundImage: `url(${leavesBackground})`, backgroundSize: "repeat", backgroundRepeat: "repeat"}}>
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center" style={{boxShadow: "2px 2px 0 rgba(0,0,0,0.5)"}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <h1 className="text-xl md:text-2xl text-white whitespace-nowrap" style={{textShadow: "1px 1px 0 rgba(0,0,0,0.5)"}}>Sus-10-able Game</h1>
          </Link>
          <nav className="flex flex-wrap gap-3">
            {navLinks.map(link => (
              <Link to={link.path} key={link.path}>
                <PixelButton 
                  variant={isActivePage(link.path) ? "primary" : "outline"}
                  size="sm"
                  className="nav-button"
                >
                  {link.label}
                </PixelButton>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 relative" style={{backgroundImage: `url(${brownBackground})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${pixelTexture})`, backgroundSize: '32px', backgroundRepeat: 'repeat', backgroundBlendMode: 'overlay', opacity: 0.2 }}></div>
        <div className="main-content-area relative z-10">
          {/* Outlet renders the currently active page component from App.tsx */}
          <Outlet /> 
        </div>
      </main>

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

// Inline component to render the Capty & Datta banner on point gain
const PointsBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [payload, setPayload] = React.useState<{points: number; reason: string} | null>(null);
  React.useEffect(() => {
    const onEarn = (e: any) => {
      setPayload(e.detail);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(t);
    };
    window.addEventListener('ecoPointsEarned', onEarn as any);
    return () => window.removeEventListener('ecoPointsEarned', onEarn as any);
  }, []);

  if (!visible || !payload) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3" style={{pointerEvents: 'none'}}>
      <img src={captyImg} alt="Capty" className="h-28 w-auto object-contain" style={{ imageRendering: 'pixelated' }} />
      <div className="bg-card border-4 border-border shadow-pixel px-4 py-3">
        <p className="font-pixel text-xs text-foreground">+{payload.points} Eco Points</p>
        <p className="font-pixel text-[10px] text-muted-foreground">{payload.reason}</p>
      </div>
      <img src={dattaImg} alt="Datta" className="h-36 w-auto object-contain" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
};