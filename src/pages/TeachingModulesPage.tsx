import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";

import saveWaterImg from "../assets/Save Water.png";
import saveEnergyImg from "../assets/Save Energy.png";
import saveForestImg from "../assets/Save Forest.png";
import sdgImg from "../assets/SDG.png";

// --- HELPER FUNCTION ---
const getCompletedModules = (): Record<string, boolean> => {
  const savedStatus = localStorage.getItem("completedModules");
  return savedStatus ? JSON.parse(savedStatus) : {};
};

const TeachingModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [completedModules, setCompletedModules] = useState(getCompletedModules);

  const modules = [
    {
      id: "water-conservation",
      title: "Water Conservation",
      description: "Learn how to save water in daily life and protect our water resources",
      difficulty: "Beginner",
      duration: "15 min",
      image: saveWaterImg
    },
    {
      id: "forest-conservation",
      title: "Forest Conservation",
      description: "Master the art of reducing, reusing, and recycling waste",
      difficulty: "Beginner",
      duration: "12 min",
      image: saveForestImg
    },
    {
      id: "energy-conservation",
      title: "Energy Conservation",
      description: "Understand the imperative for conserving energy and practical strategies.",
      difficulty: "Intermediate",
      duration: "20 min",
      image: saveEnergyImg
    },
    {
      id: "sdg-part-1",
      title: "SDG Part 1",
      description: "Understand the Sustainable Development Goals (SDGs) and their core framework.",
      difficulty: "Beginner",
      duration: "20 min",
      image: sdgImg
    },
    {
      id: "sdg-part-2",
      title: "SDG Part 2",
      description: "Explore SDGs related to Equality, Justice, Economic Development, and Infrastructure.",
      difficulty: "Intermediate",
      duration: "25 min",
      image: sdgImg
    },
    {
      id: "sdg-part-3",
      title: "SDG Part 3",
      description: "Learn about environmental SDGs, Climate Action, and the Call to Action for global partnerships.",
      difficulty: "Advanced",
      duration: "22 min",
      image: sdgImg
    },
  ];

  const completedId = searchParams.get("completed");
  const completedModule = modules.find((m) => m.id === completedId);

  useEffect(() => {
    const handleStorageChange = () => {
      setCompletedModules(getCompletedModules());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-primary/20 text-primary border-primary";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
      case "Advanced": return "bg-destructive/20 text-destructive border-destructive";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const completedCount = Object.values(completedModules).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="container mx-auto max-w-6xl" style={{backgroundColor: "#F0D8C2"}}>
        {/* Header */}
        <div className="text-center mb-8 pt-8" >
          <h1 
            className="font-pixel text-2xl md:text-3xl mb-4"
            style={{ color: '#44392E' }} // Set to dark brown
          >
            e-Learning Modules
          </h1>
          <p 
            className="font-pixel text-xs md:text-sm max-w-2xl mx-auto"
            style={{ color: '#756A5D' }} // Set to a complementary muted brown
          >
            Expand your environmental knowledge with our comprehensive learning modules.
            Each module is designed to teach you practical skills for a sustainable future.
          </p>
        </div>

        {/* Completion Banner */}
        {completedId && (
          <PixelCard className="mb-8 border-4 border-green-500">
            <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-center md:text-left">
                <h2 className="font-pixel text-sm text-green-700 mb-1">Module marked as read</h2>
                <p className="font-pixel text-xs text-green-800">
                  Completed "{completedModule?.title ?? completedId}". Explore more modules below.
                </p>
              </div>
              <PixelButton variant="secondary" onClick={() => setSearchParams({})}>
                Dismiss
              </PixelButton>
            </div>
          </PixelCard>
        )}

        {/* Progress Overview */}
        <PixelCard className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h2 className="font-pixel text-lg text-foreground mb-2">Your Progress</h2>
              <p className="font-pixel text-xs text-muted-foreground">
                {completedCount} of {modules.length} modules completed
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary border-2 border-foreground flex items-center justify-center mb-2">
                  <span className="font-pixel text-lg text-primary-foreground">{completedCount}</span>
                </div>
                <p className="font-pixel text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-muted border-2 border-border flex items-center justify-center mb-2">
                  <span className="font-pixel text-lg text-muted-foreground">{modules.length - completedCount}</span>
                </div>
                <p className="font-pixel text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const isCompleted = completedModules[module.id] || false;

            return(
              <PixelCard key={module.id} className="p-0 relative overflow-hidden hover:transform hover:-translate-y-1 transition-transform duration-200 flex flex-col">
                {/* Module Image */}
                <div className="h-32 bg-muted border-b-4 border-border relative overflow-hidden flex-shrink-0">
                  <img 
                    src={module.image} 
                    alt={module.title}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>

                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary border-2 border-foreground flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Unified content wrapper for consistent alignment */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Title and description area that expands to fill space */}
                  <div className="flex-grow">
                    <h3 className="font-pixel text-sm text-foreground mb-2">{module.title}</h3>
                    <p className="font-pixel text-xs text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Meta and button area that stays at the bottom */}
                  <div className="mt-4 flex-shrink-0">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className={`font-pixel px-2 py-1 border-2 ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                      <span className="font-pixel text-muted-foreground">{module.duration}</span>
                    </div>
                    <PixelButton 
                      variant={isCompleted ? "secondary" : "primary"} 
                      size="sm" 
                      className="w-full"
                      // THIS IS THE FIX: The path is now correct for the router setup.
                      onClick={() => navigate(`/module/${module.id}`)}
                    >
                      {isCompleted ? "Review Module" : "Start Module"}
                    </PixelButton>
                  </div>
                </div>
              </PixelCard>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default TeachingModulesPage;