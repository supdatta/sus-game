import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
// --- FIX: Changed to relative paths to avoid build errors ---
import { PixelButton } from "../components/ui/pixel-button";
import { PixelCard } from "../components/ui/pixel-card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <PixelCard>
          <div className="w-24 h-24 bg-destructive border-4 border-foreground mx-auto mb-6 flex items-center justify-center">
            <span className="font-pixel text-2xl text-destructive-foreground">404</span>
          </div>
          
          <h1 className="font-pixel text-xl text-foreground mb-4">
            Quest Not Found!
          </h1>
          
          <p className="font-pixel text-xs text-muted-foreground mb-6 leading-relaxed">
            Oops! This path doesn't lead to any sustainable adventures. 
            Let's get you back on track to save the planet!
          </p>
          
          {/* --- FIX: Changed link to point to the quests dashboard --- */}
          <Link to="/sus-game/dashboard">
            <PixelButton variant="primary" size="lg" className="w-full">
              Return to Quests
            </PixelButton>
          </Link>
        </PixelCard>
      </div>
    </div>
  );
};

export default NotFound;

