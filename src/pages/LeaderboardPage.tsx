import React, { useState } from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { useNavigate } from "react-router-dom";
import { LeaderboardCard } from "@/components/ui/LeaderboardCard";
import { YourRankingCard } from "@/components/ui/YourRankingCard";

type TimePeriod = "weekly" | "monthly" | "all-time";

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");

  const weeklyLeaderboard = [
    { rank: 1, name: "EcoMaster2024", school: "Greenwood High", schoolRank: 1, xp: 2450, level: 12, carbonSaved: 1250 },
    { rank: 2, name: "GreenWarrior", school: "Riverside Academy", schoolRank: 2, xp: 2200, level: 11, carbonSaved: 980 },
    { rank: 3, name: "PlanetSaver", school: "Oceanview School", schoolRank: 1, xp: 1980, level: 10, carbonSaved: 870 },
    { rank: 4, name: "ClimateHero", school: "Summit Elementary", schoolRank: 3, xp: 1750, level: 9, carbonSaved: 765 },
    { rank: 5, name: "SustainPro", school: "Forest Hills", schoolRank: 2, xp: 1620, level: 8, carbonSaved: 695 },
    { rank: 6, name: "EcoChamp", school: "Brighton School", schoolRank: 4, xp: 1450, level: 8, carbonSaved: 620 },
    { rank: 7, name: "NatureGuard", school: "Willow Creek", schoolRank: 1, xp: 1320, level: 7, carbonSaved: 560 },
    { rank: 8, name: "GreenThumb", school: "Maplewood Academy", schoolRank: 5, xp: 1180, level: 7, carbonSaved: 480 },
    { rank: 9, name: "EarthDefender", school: "Pine Ridge", schoolRank: 2, xp: 1050, level: 6, carbonSaved: 420 },
    { rank: 10, name: "EnviroKid", school: "Discovery School", schoolRank: 3, xp: 920, level: 6, carbonSaved: 380 },
  ];

  const monthlyLeaderboard = [
    { rank: 1, name: "GreenWarrior", school: "Riverside Academy", schoolRank: 2, xp: 9900, level: 26, carbonSaved: 5100 },
    { rank: 2, name: "EcoMaster2024", school: "Greenwood High", schoolRank: 1, xp: 9800, level: 25, carbonSaved: 5000 },
    { rank: 3, name: "ClimateHero", school: "Summit Elementary", schoolRank: 3, xp: 8900, level: 24, carbonSaved: 4700 },
    { rank: 4, name: "PlanetSaver", school: "Oceanview School", schoolRank: 1, xp: 8800, level: 23, carbonSaved: 4600 },
    { rank: 5, name: "EcoChamp", school: "Brighton School", schoolRank: 4, xp: 8300, level: 22, carbonSaved: 4300 },
    { rank: 6, name: "SustainPro", school: "Forest Hills", schoolRank: 2, xp: 8200, level: 21, carbonSaved: 4200 },
    { rank: 7, name: "GreenThumb", school: "Maplewood Academy", schoolRank: 5, xp: 7800, level: 20, carbonSaved: 3900 },
    { rank: 8, name: "NatureGuard", school: "Willow Creek", schoolRank: 1, xp: 7600, level: 19, carbonSaved: 3800 },
    { rank: 9, name: "EnviroKid", school: "Discovery School", schoolRank: 3, xp: 7100, level: 18, carbonSaved: 3500 },
    { rank: 10, name: "EarthDefender", school: "Pine Ridge", schoolRank: 2, xp: 7000, level: 17, carbonSaved: 3400 },
  ];

  const allTimeLeaderboard = [
    { rank: 1, name: "PlanetSaver", school: "Oceanview School", schoolRank: 1, xp: 55000, level: 110, carbonSaved: 27000 },
    { rank: 2, name: "EcoMaster2024", school: "Greenwood High", schoolRank: 1, xp: 50000, level: 100, carbonSaved: 25000 },
    { rank: 3, name: "GreenWarrior", school: "Riverside Academy", schoolRank: 2, xp: 48000, level: 98, carbonSaved: 24000 },
    { rank: 4, name: "SustainPro", school: "Forest Hills", schoolRank: 2, xp: 45000, level: 95, carbonSaved: 22500 },
    { rank: 5, name: "ClimateHero", school: "Summit Elementary", schoolRank: 3, xp: 44000, level: 94, carbonSaved: 22000 },
    { rank: 6, name: "NatureGuard", school: "Willow Creek", schoolRank: 1, xp: 41000, level: 91, carbonSaved: 20500 },
    { rank: 7, name: "EcoChamp", school: "Brighton School", schoolRank: 4, xp: 40000, level: 90, carbonSaved: 20000 },
    { rank: 8, name: "EarthDefender", school: "Pine Ridge", schoolRank: 2, xp: 38000, level: 88, carbonSaved: 19000 },
    { rank: 9, name: "GreenThumb", school: "Maplewood Academy", schoolRank: 5, xp: 36000, level: 86, carbonSaved: 18000 },
    { rank: 10, name: "EnviroKid", school: "Discovery School", schoolRank: 3, xp: 32000, level: 82, carbonSaved: 16000 },
  ];

  const leaderboardData = {
    weekly: weeklyLeaderboard,
    monthly: monthlyLeaderboard,
    "all-time": allTimeLeaderboard,
  };

  const currentUserData = {
    weekly: {
      rank: 15,
      name: "You",
      school: "Your School",
      schoolRank: 10,
      xp: 750,
      level: 5,
      carbonSaved: 455
    },
    monthly: {
      rank: 25,
      name: "You",
      school: "Your School",
      schoolRank: 15,
      xp: 3750,
      level: 15,
      carbonSaved: 1455
    },
    "all-time": {
      rank: 50,
      name: "You",
      school: "Your School",
      schoolRank: 20,
      xp: 10750,
      level: 35,
      carbonSaved: 5455
    }
  };

  const currentUser = currentUserData[timePeriod];

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

  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl p-4">
        <h1 className="font-pixel text-2xl text-foreground mb-8 text-center">
          Global Leaderboard
        </h1>

        {/* Time Period Selector */}
        <div className="flex justify-center gap-2 mb-8">
          <PixelButton
            variant={timePeriod === "weekly" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleTimePeriodChange("weekly")}
          >
            Weekly
          </PixelButton>
          <PixelButton
            variant={timePeriod === "monthly" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleTimePeriodChange("monthly")}
          >
            Monthly
          </PixelButton>
          <PixelButton
            variant={timePeriod === "all-time" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleTimePeriodChange("all-time")}
          >
            All Time
          </PixelButton>
        </div>

        {/* Your Ranking Card */}
        <YourRankingCard 
          currentUser={currentUser}
          getRankColor={getRankColor}
          layout={timePeriod}
        />

        {/* Leaderboard List */}
        <PixelCard className="p-6">
          <h2 className="font-pixel text-lg text-foreground mb-6">Top Players</h2>
          
          <div className="space-y-4">
            {leaderboardData[timePeriod].map((player) => (
              <LeaderboardCard 
                key={player.rank}
                player={player}
                getRankIcon={getRankIcon}
                getRankColor={getRankColor}
                layout={timePeriod === 'weekly' ? 'default' : timePeriod}
              />
            ))}
          </div>
        </PixelCard>

        
        <div className="mt-8 text-center">
          <PixelCard className="max-w-2xl mx-auto">
            <h2 className="font-pixel text-lg text-foreground mb-4">
              Climb the Ranks!
            </h2>
            <p className="font-pixel text-xs text-muted-foreground mb-6 leading-relaxed">
              Complete more quests, save more CO₂, and help the planet while competing 
              with eco-warriors from around the world.
            </p>
            <PixelButton variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
              Start New Quest
            </PixelButton>
          </PixelCard>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
