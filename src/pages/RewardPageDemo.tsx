import React from "react";
import { PixelButton } from "../components/ui/pixel-button";
import { PixelCard } from "../components/ui/pixel-card";

const RewardPageDemo: React.FC = () => {
  const testAddPoints = () => {
    if (window.addEcoPoints) {
      window.addEcoPoints(25);
      alert("Added 25 eco points! Check the rewards page.");
    } else {
      alert("Global function not available. Visit the rewards page first.");
    }
  };

  const testPuzzleComplete = () => {
    if (window.onPuzzleComplete) {
      window.onPuzzleComplete();
    } else {
      alert("Global function not available. Visit the rewards page first.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <PixelCard className="p-6">
        <h2 className="font-pixel text-lg text-center mb-4">Reward Page Demo</h2>
        <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground mb-4">
                First, visit the main Rewards page to load the functions, then come back here and click the buttons to test them.
            </p>
            <PixelButton onClick={testAddPoints} className="w-full">
                Test: Add 25 Eco Points
            </PixelButton>
            <PixelButton onClick={testPuzzleComplete} variant="outline" className="w-full">
                Test: Trigger Puzzle Completion Popup
            </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default RewardPageDemo;