import React, { useState, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PixelButton } from './pixel-button';
import { LogIn, LogOut, User } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext'; // Import AuthContext
import { AuthModal } from '../auth/AuthModal'; // Import AuthModal

// --- Icon Imports ---
import { Home, Trophy, Shield, ScanLine, BarChart3, GraduationCap } from 'lucide-react';

// Export this array to be used by the mobile header
export const navItems = [
  { to: '/sus-game/', label: 'Home', icon: Home },
  { to: '/sus-game/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/sus-game/teaching', label: 'Modules', icon: GraduationCap },
  { to: '/sus-game/resources', label: 'Rewards', icon: Trophy },
  { to: '/sus-game/leaderboard', label: 'Leaderboard', icon: Shield },
  { to: '/sus-game/eco-scan', label: 'EcoScan', icon: ScanLine },
];

export const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) return null; // or a loading spinner
  const { user, isAuthenticated, logout } = authContext;

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r-4 border-border bg-card sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* Top Nav Items */}
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-12 md:w-12',
                    pathname === item.to ? 'bg-primary/20 text-primary' : ''
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-pixel">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            {isAuthenticated && user ? (
                <>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex flex-col items-center text-center">
                            <User className="h-6 w-6 text-primary" />
                            <span className="font-pixel text-xs text-muted-foreground mt-1">{user.ecoPoints} pts</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-pixel">{user.username}</TooltipContent>
                 </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                      <PixelButton onClick={logout} variant="ghost" size="icon" className="h-12 w-12">
                        <LogOut className="h-6 w-6" />
                      </PixelButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-pixel">Logout</TooltipContent>
                 </Tooltip>
                </>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <PixelButton onClick={() => setAuthModalOpen(true)} variant="ghost" size="icon" className="h-12 w-12">
                        <LogIn className="h-6 w-6" />
                    </PixelButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-pixel">Login / Sign Up</TooltipContent>
                </Tooltip>
            )}
        </nav>
      </aside>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
