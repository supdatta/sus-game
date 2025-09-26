import React, { useContext, useMemo } from "react";
import { PixelCard } from "./pixel-card";
import { Star, Leaf } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { AuthContext } from "@/context/AuthContext";
import defaultAvatar from "@/assets/character-1.png";

interface LevelEcoPointsBarProps {
  level?: number; // Optional: if not provided, computed from ecoPoints
  ecoPoints?: number; // Optional: if not provided, read from AuthContext
  profileSrc?: string; // Optional profile image src
}

// Level curve: simple and readable. Every 100 points = +1 level
const POINTS_PER_LEVEL = 100;
const SEGMENTS = 16; // pixel segments shown in the progress bar

const LevelEcoPointsBar: React.FC<LevelEcoPointsBarProps> = ({ level, ecoPoints, profileSrc }) => {
  const auth = useContext(AuthContext);
  const username = auth?.user?.username ?? "Player";
  const points = ecoPoints ?? auth?.user?.ecoPoints ?? 0;

  const { currentLevel, xpInLevel, percentToNext, filledSegments } = useMemo(() => {
    const computedLevel = Math.floor(points / POINTS_PER_LEVEL) + 1;
    const xp = points % POINTS_PER_LEVEL;
    const percent = Math.min((xp / POINTS_PER_LEVEL) * 100, 100);
    const filled = Math.round((percent / 100) * SEGMENTS);
    return {
      currentLevel: level ?? computedLevel,
      xpInLevel: xp,
      percentToNext: percent,
      filledSegments: filled,
    };
  }, [points, level]);

  const initials = useMemo(() => {
    const n = username.trim();
    if (!n) return "?";
    const parts = n.split(" ");
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }, [username]);

  return (
    <PixelCard className="bg-card text-card-foreground border-border p-3 sm:p-4 flex items-center gap-3 sm:gap-4 mb-8">
      {/* Avatar */}
      <div className="shrink-0">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-border" style={{ boxShadow: "var(--pixel-shadow)", imageRendering: "pixelated" }}>
          <AvatarImage src={profileSrc || defaultAvatar} alt={username} className="object-cover" style={{ imageRendering: "pixelated" }} />
          <AvatarFallback className="font-pixel text-xs sm:text-sm">{initials}</AvatarFallback>
        </Avatar>
      </div>

      {/* Info + Progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          {/* Level */}
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 sm:p-2 border-2 border-green-400 shadow" style={{ boxShadow: "var(--pixel-shadow)" }}>
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="font-pixel text-sm sm:text-lg">Level {currentLevel}</div>
          </div>

          {/* Eco Points */}
          <div className="flex items-center gap-2">
            <div className="font-pixel text-sm sm:text-lg tabular-nums">{points}</div>
            <div className="bg-green-600 p-1.5 sm:p-2 border-2 border-green-400 shadow" style={{ boxShadow: "var(--pixel-shadow)" }}>
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Segmented progress bar - pixel style */}
        <div className="mt-3 sm:mt-4">
          <div className="flex gap-1">
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div
                key={i}
                className={
                  "h-3 sm:h-3.5 flex-1 border-2 " +
                  (i < filledSegments
                    ? "bg-primary border-primary"
                    : "bg-muted border-border")
                }
                style={{ boxShadow: i < filledSegments ? "var(--pixel-shadow)" : undefined }}
                aria-hidden
              />
            ))}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground font-pixel">
            <span>XP: {xpInLevel}/{POINTS_PER_LEVEL}</span>
            <span>{Math.round(percentToNext)}% to next</span>
          </div>
        </div>
      </div>
    </PixelCard>
  );
};

export default LevelEcoPointsBar;
