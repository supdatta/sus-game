import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/pixel-button';
import { ArrowLeft } from 'lucide-react';

// A simple mapping to hold the URLs for different games/levels.
// This makes it easy to add more games in the future.
const gameRegistry: Record<string, string> = {
    "energy-conservation": "/games/energy-conserver/index.html",
    "waste-dungeon": "/games/waste-dungeon/index.html", // Example path for level 2
    "hangman": "/games/hangman/index.html",             // Example path for hangman
    "word-search": "/games/word-search/index.html",
    "crossword": "/games/crossword/index.html",
    "quiz": "/games/quiz/index.html",
    // You can add more quests and their corresponding game URLs
};


const GamePage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();

  // Find the URL for the current quest, or set to null if not found
  const gameUrl = questId ? gameRegistry[questId] : null;

  return (
    // This div creates the full-screen overlay
    <div className="fixed inset-0 w-screen h-screen bg-black z-50 flex flex-col items-center justify-center">
      
      {/* --- FLOATING "RETURN" BUTTON --- */}
      <PixelButton 
        onClick={() => navigate(-1)} // Navigates to the previous page (Dashboard)
        variant="secondary" // Light colored variant
        className="absolute top-4 left-4 z-10 flex items-center gap-2"
        size="sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Return
      </PixelButton>

      {/* --- GAME DISPLAY AREA --- */}
      {gameUrl ? (
        <iframe
          src={gameUrl}
          title={`Game - ${questId}`}
          className="w-full h-full border-0"
          allowFullScreen
        />
      ) : (
        // Fallback content if a game URL isn't found for the questId
        <div className="text-center">
            <h1 className="font-pixel text-2xl text-white">
                Game loading for: {questId}
            </h1>
            <p className="font-pixel text-lg text-gray-400 mt-4">
                (Game content for this quest is not yet configured)
            </p>
        </div>
      )}
    </div>
  );
};

export default GamePage;