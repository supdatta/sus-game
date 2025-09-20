import React from "react";
import { Link } from 'react-router-dom';
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import character1Img from "@/assets/character-1.png";
import character2Img from "@/assets/character-2.png";
import plantImg from "@/assets/plant.svg";
import booksImg from "@/assets/books.svg";
import medalImg from "@/assets/medal.svg";
import forestSceneImg from "@/assets/forest-scene.png";

const DashboardPage: React.FC = () => {
  // Mock data for demonstration
  const userStats = {
    level: 5,
    ecoPoints: 750,
    ecoPointsToNext: 1000,
    completedQuests: 12,
  };

  const recentQuests = [
    { id: 1, title: "Reduce Plastic Use", status: "completed", ecoPoints: 50, image: plantImg },
    { id: 2, title: "Plant a Tree", status: "completed", ecoPoints: 75, image: booksImg },
    { id: 3, title: "Energy Conservation", status: "in-progress", ecoPoints: 100, image: medalImg },
    { id: 4, title: "Water Saving Challenge", status: "available", ecoPoints: 60, image: forestSceneImg },
  ];

  return (
     <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 right-10 w-3 h-3 bg-primary/20 border border-primary animate-pulse"></div>
      <div className="absolute top-40 left-20 w-4 h-4 bg-secondary/20 border border-secondary animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-accent/20 border border-accent animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Floating character */}
      <div className="absolute bottom-10 left-10 w-16 h-20 opacity-20 animate-pixel-bounce" style={{animationDelay: '2s'}}>
        <img src={character2Img} alt="Character" className="w-full h-full object-contain" style={{imageRendering: 'pixelated'}} />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="font-pixel text-2xl text-foreground mb-8 text-center">
          Your Quest Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
            <div className="text-2xl font-pixel text-primary mb-2">
              {userStats.ecoPoints}
            </div>
            <div className="text-xs font-pixel text-muted-foreground">
              Eco Points
            </div>
          </PixelCard>
        </div>

        {/* Current Level Section */}
        <PixelCard className="mb-8">
          <h2 className="font-pixel text-lg text-foreground mb-4">
            Current Level
          </h2>
          <ProgressBar
            value={userStats.level}
            max={100}
            className="mb-4"
          />
          <p className="font-pixel text-xs text-muted-foreground">
            You are at level {userStats.level}
          </p>
        </PixelCard>

        {/* Progress Section */}
        <PixelCard className="mb-8">
          <h2 className="font-pixel text-lg text-foreground mb-4">
            Level Progress
          </h2>
          <ProgressBar 
            value={userStats.ecoPoints} 
            max={userStats.ecoPointsToNext} 
            className="mb-4"
          />
          <p className="font-pixel text-xs text-muted-foreground">
            {userStats.ecoPointsToNext - userStats.ecoPoints} Eco Points to Level {userStats.level + 1}
          </p>
        </PixelCard>

        {/* Quest List */}
        <div className="grid md:grid-cols-2 gap-6">
          {recentQuests.map((quest) => (
            <PixelCard key={quest.id} className="flex flex-col">
              <img src={quest.image} alt={quest.title} className="w-full h-32 object-cover mb-4" style={{imageRendering: 'pixelated'}} />
              <div className="flex-grow">
                <h3 className="font-pixel text-lg text-foreground mb-2">
                  {quest.title}
                </h3>
                <p className="font-pixel text-sm text-muted-foreground mb-4">
                  {quest.ecoPoints} Eco Points
                </p>
              </div>
              {quest.status !== "completed" && (
                <Link to={`/sus-game/game/${quest.id}`} className="mt-auto">
                  <PixelButton 
                    variant={quest.status === "in-progress" ? "secondary" : "outline"}
                    className="w-full"
                  >
                    {quest.status === "in-progress" ? "Continue" : "Start"}
                  </PixelButton>
                </Link>
              )}
              {quest.status === "completed" && (
                <PixelButton variant="primary" disabled className="w-full mt-auto">
                  Done
                </PixelButton>
              )}
            </PixelCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
