import React from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";

const LeaderboardPage: React.FC = () => {
  const leaderboardData = [
    { rank: 1, name: "EcoMaster2024", xp: 2450, level: 12, carbonSaved: 125.8 },
    { rank: 2, name: "GreenWarrior", xp: 2200, level: 11, carbonSaved: 98.3 },
    { rank: 3, name: "PlanetSaver", xp: 1980, level: 10, carbonSaved: 87.1 },
    { rank: 4, name: "ClimateHero", xp: 1750, level: 9, carbonSaved: 76.4 },
    { rank: 5, name: "SustainPro", xp: 1620, level: 8, carbonSaved: 69.8 },
    { rank: 6, name: "EcoChamp", xp: 1450, level: 8, carbonSaved: 62.1 },
    { rank: 7, name: "NatureGuard", xp: 1320, level: 7, carbonSaved: 55.9 },
    { rank: 8, name: "GreenThumb", xp: 1180, level: 7, carbonSaved: 48.7 },
    { rank: 9, name: "EarthDefender", xp: 1050, level: 6, carbonSaved: 42.3 },
    { rank: 10, name: "EnviroKid", xp: 920, level: 6, carbonSaved: 38.2 },
  ];

  const currentUser = {
    rank: 15,
    name: "You",
    xp: 750,
    level: 5,
    carbonSaved: 45.6
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500 border-yellow-500 bg-yellow-500/10";
    if (rank === 2) return "text-gray-400 border-gray-400 bg-gray-400/10";
    if (rank === 3) return "text-orange-500 border-orange-500 bg-orange-500/10";
    return "text-muted-foreground border-muted-foreground bg-muted";
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="font-pixel text-2xl text-foreground mb-8 text-center">
          Global Leaderboard
        </h1>

        {/* Time Period Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <PixelButton variant="primary" size="sm">Weekly</PixelButton>
          <PixelButton variant="outline" size="sm">Monthly</PixelButton>
          <PixelButton variant="outline" size="sm">All Time</PixelButton>
        </div>

        {/* Your Ranking Card */}
        <PixelCard className="mb-8 bg-primary/10 border-primary">
          <h2 className="font-pixel text-lg text-foreground mb-4">Your Ranking</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 flex items-center justify-center border-4 font-pixel text-sm ${getRankColor(currentUser.rank)}`}>
                #{currentUser.rank}
              </div>
              <div>
                <div className="font-pixel text-sm text-foreground">{currentUser.name}</div>
                <div className="font-pixel text-xs text-muted-foreground">Level {currentUser.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-pixel text-sm text-foreground">{currentUser.xp} XP</div>
              <div className="font-pixel text-xs text-muted-foreground">{currentUser.carbonSaved}kg CO₂ saved</div>
            </div>
          </div>
        </PixelCard>

        {/* Leaderboard List */}
        <PixelCard>
          <h2 className="font-pixel text-lg text-foreground mb-6">Top Players</h2>
          
          <div className="space-y-3">
            {leaderboardData.map((player) => (
              <div 
                key={player.rank}
                className={`flex items-center justify-between p-4 border-2 ${
                  player.rank <= 3 ? getRankColor(player.rank) : "bg-muted border-border"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 flex items-center justify-center border-2 font-pixel text-xs ${
                    player.rank <= 3 ? "border-current" : "border-foreground"
                  }`}>
                    {player.rank <= 3 ? getRankIcon(player.rank) : `#${player.rank}`}
                  </div>
                  
                  <div>
                    <div className="font-pixel text-sm text-foreground">
                      {player.name}
                    </div>
                    <div className="font-pixel text-xs text-muted-foreground">
                      Level {player.level}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-pixel text-sm text-foreground">
                    {player.xp.toLocaleString()} XP
                  </div>
                  <div className="font-pixel text-xs text-muted-foreground">
                    {player.carbonSaved}kg CO₂
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PixelCard>

        {/* Achievement Challenges */}
        <div className="mt-8 text-center">
          <PixelCard className="max-w-2xl mx-auto">
            <h2 className="font-pixel text-lg text-foreground mb-4">
              Climb the Ranks!
            </h2>
            <p className="font-pixel text-xs text-muted-foreground mb-6 leading-relaxed">
              Complete more quests, save more CO₂, and help the planet while competing 
              with eco-warriors from around the world.
            </p>
            <PixelButton variant="hero" size="lg">
              Start New Quest
            </PixelButton>
          </PixelCard>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;