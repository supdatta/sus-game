import React, { useState } from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { ProgressBar } from "@/components/ui/progress-bar";

const ResourcesPage: React.FC = () => {
  const [unlockedLevels, setUnlockedLevels] = useState(1);

  const gameLevels = [
    {
      id: 1,
      title: "Forest Guardian",
      description: "Learn about deforestation and plant trees to restore the magical forest. Master the basics of carbon absorption and ecosystem balance.",
      difficulty: "Beginner",
      progress: 100,
      unlocked: true,
      theme: "🌲",
      color: "primary"
    },
    {
      id: 2,
      title: "Ocean Cleaner",
      description: "Dive deep to clean ocean pollution and protect marine life. Discover the impact of plastic waste on ocean ecosystems.",
      difficulty: "Beginner",
      progress: unlockedLevels > 1 ? 75 : 0,
      unlocked: unlockedLevels >= 2,
      theme: "🌊",
      color: "secondary"
    },
    {
      id: 3,
      title: "Energy Master",
      description: "Build renewable energy systems and manage a sustainable city. Learn about solar, wind, and other clean energy sources.",
      difficulty: "Intermediate",
      progress: unlockedLevels > 2 ? 50 : 0,
      unlocked: unlockedLevels >= 3,
      theme: "⚡",
      color: "accent"
    },
    {
      id: 4,
      title: "Climate Champion",
      description: "Face the ultimate challenge to reverse climate change. Combine all your knowledge to save the planet from environmental collapse.",
      difficulty: "Advanced",
      progress: unlockedLevels > 3 ? 25 : 0,
      unlocked: unlockedLevels >= 4,
      theme: "🌍",
      color: "primary"
    }
  ];

  const handlePlayLevel = (levelId: number) => {
    if (levelId <= unlockedLevels) {
      // Here you would navigate to the game or open a modal
      console.log(`Playing level ${levelId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-pixel text-2xl text-foreground mb-4 text-center">
          Game Levels
        </h1>
        
        <p className="font-pixel text-xs text-muted-foreground text-center mb-8 max-w-2xl mx-auto leading-relaxed">
          Progress through sustainability challenges and unlock new levels. Each level teaches important environmental concepts while having fun!
        </p>

        {/* Overall Progress */}
        <PixelCard className="mb-8 max-w-2xl mx-auto">
          <h2 className="font-pixel text-sm text-foreground mb-4 text-center">
            Overall Progress
          </h2>
          <ProgressBar value={unlockedLevels} max={gameLevels.length} />
          <p className="font-pixel text-xs text-muted-foreground text-center mt-2">
            {unlockedLevels} of {gameLevels.length} levels unlocked
          </p>
        </PixelCard>

        {/* Game Levels Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {gameLevels.map((level) => (
            <PixelCard 
              key={level.id} 
              className={`flex flex-col relative ${
                !level.unlocked ? 'opacity-60' : 'hover:transform hover:-translate-y-1 transition-transform duration-200'
              }`}
            >
              {/* Lock overlay for locked levels */}
              {!level.unlocked && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <p className="font-pixel text-xs text-muted-foreground">
                      Complete previous level
                    </p>
                  </div>
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">{level.theme}</div>
                  <div className={`px-2 py-1 border-2 text-xs font-pixel ${
                    level.difficulty === "Beginner" 
                      ? "bg-primary/20 border-primary text-primary"
                      : level.difficulty === "Intermediate"
                      ? "bg-secondary/20 border-secondary text-secondary"
                      : "bg-accent/20 border-accent text-accent"
                  }`}>
                    {level.difficulty}
                  </div>
                </div>

                <h3 className="font-pixel text-sm text-foreground mb-2">
                  Level {level.id}: {level.title}
                </h3>
                
                <p className="font-pixel text-xs text-muted-foreground mb-4 leading-relaxed">
                  {level.description}
                </p>

                {level.unlocked && level.progress > 0 && (
                  <div className="mb-4">
                    <p className="font-pixel text-xs text-muted-foreground mb-2">
                      Progress: {level.progress}%
                    </p>
                    <ProgressBar value={level.progress} max={100} />
                  </div>
                )}
              </div>

              <PixelButton 
                className="w-full mt-auto"
                variant={level.unlocked ? "primary" : "outline"}
                onClick={() => handlePlayLevel(level.id)}
                disabled={!level.unlocked}
              >
                {level.unlocked ? (level.progress > 0 ? "Continue" : "Start Level") : "Locked"}
              </PixelButton>
            </PixelCard>
          ))}
        </div>

        {/* Achievements Section */}
        <PixelCard className="max-w-2xl mx-auto">
          <h2 className="font-pixel text-lg text-foreground mb-4 text-center">
            Your Achievements
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: "🌱", name: "First Steps", unlocked: unlockedLevels >= 1 },
              { icon: "🏆", name: "Champion", unlocked: unlockedLevels >= 2 },
              { icon: "⭐", name: "Expert", unlocked: unlockedLevels >= 3 },
              { icon: "👑", name: "Master", unlocked: unlockedLevels >= 4 }
            ].map((achievement, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl mb-2 ${!achievement.unlocked ? 'grayscale opacity-50' : ''}`}>
                  {achievement.icon}
                </div>
                <p className={`font-pixel text-xs ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default ResourcesPage;