import React from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { ProgressBar } from "@/components/ui/progress-bar";

const DashboardPage: React.FC = () => {
  // Mock data for demonstration
  const userStats = {
    level: 5,
    xp: 750,
    xpToNext: 1000,
    completedQuests: 12,
    carbonSaved: 45.6,
  };

  const recentQuests = [
    { id: 1, title: "Reduce Plastic Use", status: "completed", xp: 50 },
    { id: 2, title: "Plant a Tree", status: "completed", xp: 75 },
    { id: 3, title: "Energy Conservation", status: "in-progress", xp: 100 },
    { id: 4, title: "Water Saving Challenge", status: "available", xp: 60 },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-pixel text-2xl text-foreground mb-8 text-center">
          Your Quest Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <PixelCard className="text-center">
            <div className="text-2xl font-pixel text-primary mb-2">
              {userStats.level}
            </div>
            <div className="text-xs font-pixel text-muted-foreground">
              Level
            </div>
          </PixelCard>

          <PixelCard className="text-center">
            <div className="text-2xl font-pixel text-secondary mb-2">
              {userStats.completedQuests}
            </div>
            <div className="text-xs font-pixel text-muted-foreground">
              Quests Done
            </div>
          </PixelCard>

          <PixelCard className="text-center">
            <div className="text-2xl font-pixel text-accent mb-2">
              {userStats.carbonSaved}kg
            </div>
            <div className="text-xs font-pixel text-muted-foreground">
              Carbon Saved
            </div>
          </PixelCard>

          <PixelCard className="text-center">
            <div className="text-2xl font-pixel text-primary mb-2">
              {userStats.xp}
            </div>
            <div className="text-xs font-pixel text-muted-foreground">
              Experience
            </div>
          </PixelCard>
        </div>

        {/* Progress Section */}
        <PixelCard className="mb-8">
          <h2 className="font-pixel text-lg text-foreground mb-4">
            Level Progress
          </h2>
          <ProgressBar 
            value={userStats.xp} 
            max={userStats.xpToNext} 
            className="mb-4"
          />
          <p className="font-pixel text-xs text-muted-foreground">
            {userStats.xpToNext - userStats.xp} XP to Level {userStats.level + 1}
          </p>
        </PixelCard>

        {/* Quest List */}
        <div className="grid md:grid-cols-2 gap-6">
          <PixelCard>
            <h2 className="font-pixel text-lg text-foreground mb-6">
              Available Quests
            </h2>
            
            <div className="space-y-4">
              {recentQuests.map((quest) => (
                <div 
                  key={quest.id}
                  className="flex items-center justify-between p-4 bg-muted border-2 border-border"
                >
                  <div className="flex-1">
                    <h3 className="font-pixel text-sm text-foreground mb-1">
                      {quest.title}
                    </h3>
                    <p className="font-pixel text-xs text-muted-foreground">
                      {quest.xp} XP
                    </p>
                  </div>
                  
                  <PixelButton 
                    size="sm"
                    variant={quest.status === "completed" ? "primary" : 
                            quest.status === "in-progress" ? "secondary" : "outline"}
                    disabled={quest.status === "completed"}
                  >
                    {quest.status === "completed" ? "Done" :
                     quest.status === "in-progress" ? "Continue" : "Start"}
                  </PixelButton>
                </div>
              ))}
            </div>
          </PixelCard>

          <PixelCard>
            <h2 className="font-pixel text-lg text-foreground mb-6">
              Achievements
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-primary/10 border-2 border-primary">
                <div className="w-8 h-8 bg-primary border-2 border-foreground mr-4"></div>
                <div>
                  <h3 className="font-pixel text-sm text-foreground">
                    Eco Warrior
                  </h3>
                  <p className="font-pixel text-xs text-muted-foreground">
                    Complete 10 quests
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-secondary/10 border-2 border-secondary">
                <div className="w-8 h-8 bg-secondary border-2 border-foreground mr-4"></div>
                <div>
                  <h3 className="font-pixel text-sm text-foreground">
                    Planet Protector
                  </h3>
                  <p className="font-pixel text-xs text-muted-foreground">
                    Save 50kg of CO2
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-muted border-2 border-border opacity-50">
                <div className="w-8 h-8 bg-muted-foreground border-2 border-foreground mr-4"></div>
                <div>
                  <h3 className="font-pixel text-sm text-muted-foreground">
                    Green Champion
                  </h3>
                  <p className="font-pixel text-xs text-muted-foreground">
                    Reach level 10
                  </p>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;