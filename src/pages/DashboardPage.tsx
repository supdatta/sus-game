import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";
import { ProgressBar } from "../components/ui/progress-bar";
import forestSceneImg from "../assets/forest-scene.png";

// Placeholder images
import energyImg from "../assets/Save Energy.png";
import wasteImg from "../assets/Save Forest.png";
import lockedImg from "../assets/character-2.png";
import hangmanImg from "../assets/magic-character.png";
import quizImg from "../assets/character-1.png";

// Character Images
import lavikImg from '../assets/Lavik_Website_Wala.png';
import p26Img from '../assets/P26_Website_wali.png';

// ICONS
const StarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"></path></svg> );
const LeafIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-5-5-5-12-5-12C7 4.5 12 2 12 2s5 2.5 5 8c0 0 0 7-5 12z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg> );
const PlayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> );

const StackedCard: React.FC<{ message: string }> = ({ message }) => (
    <div className="relative w-72 h-40">
        <PixelCard className="absolute top-2 left-2 w-full h-full bg-card/60"> </PixelCard>
        <PixelCard className="absolute top-1 left-1 w-full h-full bg-card/80"> </PixelCard>
        <PixelCard className="relative w-full h-full bg-card p-4 flex items-center justify-center">
            <p className="font-pixel text-sm text-center text-foreground leading-relaxed">{message}</p>
        </PixelCard>
    </div>
);


const DashboardPage: React.FC = () => {
  const [levelProgress, setLevelProgress] = useState<Record<string, number>>({});
  const [continueQuest, setContinueQuest] = useState<any>(null);

  const mainLevels = [
    { id: "energy-conserver", title: "Level 1: Energy Conserver", description: "Learn about energy conservation...", image: energyImg, locked: false },
    { id: "waste-dungeon", title: "Level 2: Waste Dungeon", description: "Navigate the dungeon of disposables...", image: wasteImg, locked: false },
    { id: "level-3", title: "Level 3: ???", description: "A new challenge awaits...", image: lockedImg, locked: true },
    { id: "level-4", title: "Level 4: ???", description: "Only the mightiest eco-warriors can enter here.", image: lockedImg, locked: true },
  ];

  useEffect(() => {
    const loadedProgress: Record<string, number> = {};
    mainLevels.forEach(level => {
      const saved = localStorage.getItem(`game-progress-${level.id}`);
      loadedProgress[level.id] = saved ? parseInt(saved, 10) : 0;
    });
    setLevelProgress(loadedProgress);

    const lastPlayedId = localStorage.getItem('lastPlayedLevelId');
    let questToContinue = null;

    if (lastPlayedId) {
        questToContinue = mainLevels.find(l => l.id === lastPlayedId);
    }
    
    if (!questToContinue) {
        questToContinue = mainLevels.find(l => !l.locked);
    }

    setContinueQuest(questToContinue);

  }, []);

  const handleLevelClick = (levelId: string) => {
    localStorage.setItem('lastPlayedLevelId', levelId);
    const newContinueQuest = mainLevels.find(l => l.id === levelId);
    if (newContinueQuest) {
        setContinueQuest(newContinueQuest);
    }
  };

  const userData = { level: 5, ecoPoints: 70 };
  
  const minigames = [ 
      { id: "hangman", title: "Eco Hangman", description: "Guess the green words!", image:"public/artic.png" }, 
      { id: "word-search", title: "Word Search", description: "Find the hidden eco terms.", image:"public/wordsearch.png" }, 
      { id: "crossword", title: "Crossword", description: "Solve the sustainability puzzle.", image:"public/crossword.png" }, 
      { id: "quiz", title: "Eco Quiz", description: "Test your eco-knowledge!", image:"public/quiz game.png" }
    ];

    // Helper component to wrap content in the correct link type
    const ConditionalLink: React.FC<{quest: any, children: React.ReactNode, className?: string}> = ({ quest, children, className }) => {
      if (quest.id === 'energy-conserver') {
        // --- THIS IS THE CORRECTED LINE ---
        // It now uses the correct folder/file path and Vite's BASE_URL
        const gameUrl = `${import.meta.env.BASE_URL}energy-conserver/Project1.html`;
        
        return <a href={gameUrl} className={className} onClick={() => handleLevelClick(quest.id)}>{children}</a>;
      }
      return <Link to={`/sus-game/game/${quest.id}`} className={className} onClick={() => handleLevelClick(quest.id)}>{children}</Link>;
    };

  return (
    <div className="min-h-screen bg-background p-4" style={{backgroundColor: "#F0D8C2"}}>
      <div className="container mx-auto max-w-5xl">
        <PixelCard className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center border-2 border-foreground"><StarIcon /></div>
                <div>
                  <p className="font-pixel text-xs text-muted-foreground">Level</p>
                  <p className="font-pixel text-lg text-foreground">{userData.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-pixel text-xs text-muted-foreground">Eco Points</p>
                <div className="flex items-center justify-end space-x-2">
                    <p className="font-pixel text-lg text-foreground">{userData.ecoPoints.toLocaleString()}</p>
                    <LeafIcon />
                </div>
              </div>
            </div>
        </PixelCard>
        
        {continueQuest && (
            <div className="mb-12">
                <h2 className="font-pixel text-xl mb-4" style={{ color: '#44392E' }}>Continue Playing</h2>
                <ConditionalLink quest={continueQuest} className="block group">
                    <PixelCard className="relative overflow-hidden p-0">
                        <img src={continueQuest.image} alt={continueQuest.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <h3 className="font-pixel text-lg text-white mb-2">{continueQuest.title}</h3>
                            <ProgressBar value={levelProgress[continueQuest.id] || 0} max={100} />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 border-2 border-white/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayIcon />
                        </div>
                    </PixelCard>
                </ConditionalLink>
            </div>
        )}
        
        <div className="mb-12">
            <h2 className="font-pixel text-xl mb-4" style={{ color: '#44392E' }}>Levels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mainLevels.map(level => {
                    const progress = levelProgress[level.id] || 0;
                    return (
                        <PixelCard key={level.id} className={`p-0 overflow-hidden ${level.locked ? 'cursor-not-allowed' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <img src={level.image} alt={level.title} className={`w-full h-full object-cover ${level.locked ? 'filter grayscale' : ''}`} />
                                    {level.locked && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><LockIcon/></div>}
                                </div>
                                <div className="flex-grow p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h3 className="font-pixel text-lg text-foreground">{level.title}</h3>
                                        <p className="font-pixel text-xs text-muted-foreground my-2">{level.description}</p>
                                        <ProgressBar value={progress} max={100} className="my-2"/>
                                    </div>
                                    {level.locked ? (
                                        <PixelButton size="sm" disabled className="w-full mt-2">Locked</PixelButton>
                                    ) : (
                                        <ConditionalLink quest={level} className="block mt-2">
                                            <PixelButton variant={progress >= 100 ? "secondary" : "primary"} size="sm" className="w-full">
                                                {progress >= 100 ? "Replay" : progress > 0 ? "Continue" : "Start Now"}
                                            </PixelButton>
                                        </ConditionalLink>
                                    )}
                                </div>
                            </div>
                        </PixelCard>
                    );
                })}
            </div>
        </div>

        <div>
            <h2 className="font-pixel text-xl mb-4" style={{ color: '#44392E' }}>Minigames</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {minigames.map(game => (
                    <Link to={`/sus-game/game/${game.id}`} key={game.id} className="block group h-full">
                        <PixelCard className="p-0 overflow-hidden text-center h-full flex flex-col">
                            <img src={game.image} alt={game.title} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="p-4 flex-grow flex flex-col justify-center">
                                <h3 className="font-pixel text-base text-foreground">{game.title}</h3>
                                <p className="font-pixel text-xs text-muted-foreground mt-1">{game.description}</p>
                            </div>
                        </PixelCard>
                    </Link>
                ))}
            </div>
        </div>

        <div className="hidden lg:flex justify-between items-center w-full mt-16 px-4">
            <img src={lavikImg} alt="Lavik Character" className="h-80 w-auto object-contain" style={{ imageRendering: 'pixelated' }} />
            <StackedCard message="Need a break? Try the minigames! They're a fun way to earn extra Eco Points." />
            <img src={p26Img} alt="P26 Character" className="h-80 w-auto object-contain" style={{ imageRendering: 'pixelated' }} />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
