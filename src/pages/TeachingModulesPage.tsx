import React from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import forestSceneImg from "@/assets/forest-scene.png";
import magicCharacterImg from "@/assets/magic-character.png";

const TeachingModulesPage: React.FC = () => {
  const modules = [
    {
      id: 1,
      title: "Water Conservation",
      description: "Learn how to save water in daily life and protect our water resources",
      difficulty: "Beginner",
      duration: "15 min",
      completed: false,
      image: forestSceneImg
    },
    {
      id: 2,
      title: "Renewable Energy",
      description: "Discover the power of solar, wind, and other renewable energy sources",
      difficulty: "Intermediate",
      duration: "20 min",
      completed: true,
      image: magicCharacterImg
    },
    {
      id: 3,
      title: "Waste Management",
      description: "Master the art of reducing, reusing, and recycling waste",
      difficulty: "Beginner",
      duration: "12 min",
      completed: false,
      image: forestSceneImg
    },
    {
      id: 4,
      title: "Climate Change",
      description: "Understand the science behind climate change and how to combat it",
      difficulty: "Advanced",
      duration: "25 min",
      completed: false,
      image: magicCharacterImg
    },
    {
      id: 5,
      title: "Sustainable Living",
      description: "Adopt eco-friendly practices for a sustainable lifestyle",
      difficulty: "Intermediate",
      duration: "18 min",
      completed: false,
      image: forestSceneImg
    },
    {
      id: 6,
      title: "Biodiversity Protection",
      description: "Learn about protecting wildlife and ecosystem diversity",
      difficulty: "Advanced",
      duration: "22 min",
      completed: false,
      image: magicCharacterImg
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-primary/20 text-primary border-primary";
      case "Intermediate": return "bg-secondary/20 text-secondary border-secondary";
      case "Advanced": return "bg-accent/20 text-accent border-accent";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-4">
            Teaching Modules
          </h1>
          <p className="font-pixel text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
            Expand your environmental knowledge with our comprehensive learning modules.
            Each module is designed to teach you practical skills for a sustainable future.
          </p>
        </div>

        {/* Progress Overview */}
        <PixelCard className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="font-pixel text-lg text-foreground mb-2">Your Progress</h2>
              <p className="font-pixel text-xs text-muted-foreground">
                1 of {modules.length} modules completed
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center mb-2">
                  <span className="font-pixel text-xs text-primary-foreground">1</span>
                </div>
                <p className="font-pixel text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-muted border-2 border-border flex items-center justify-center mb-2">
                  <span className="font-pixel text-xs text-muted-foreground">{modules.length - 1}</span>
                </div>
                <p className="font-pixel text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <PixelCard key={module.id} className="relative overflow-hidden hover:transform hover:-translate-y-1 transition-transform duration-200">
              {/* Module Image */}
              <div className="h-32 bg-muted border-b-4 border-border mb-4 relative overflow-hidden">
                <img 
                  src={module.image} 
                  alt={module.title}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                
                {/* Completion Badge */}
                {module.completed && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary border-2 border-foreground flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Module Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-pixel text-sm text-foreground mb-2">{module.title}</h3>
                  <p className="font-pixel text-xs text-muted-foreground leading-relaxed">
                    {module.description}
                  </p>
                </div>

                {/* Module Meta */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-pixel px-2 py-1 border-2 ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                  <span className="font-pixel text-muted-foreground">{module.duration}</span>
                </div>

                {/* Action Button */}
                <PixelButton 
                  variant={module.completed ? "secondary" : "primary"} 
                  size="sm" 
                  className="w-full"
                  disabled={module.completed}
                >
                  {module.completed ? "Completed" : "Start Module"}
                </PixelButton>
              </div>
            </PixelCard>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <PixelCard className="max-w-md mx-auto">
            <h3 className="font-pixel text-lg text-foreground mb-4">Ready to Learn More?</h3>
            <p className="font-pixel text-xs text-muted-foreground mb-6">
              Complete all modules to become an environmental expert and unlock special rewards!
            </p>
            <PixelButton variant="accent" size="lg">
              View All Achievements
            </PixelButton>
          </PixelCard>
        </div>
      </div>
    </div>
  );
};

export default TeachingModulesPage;