import React from 'react';
import { useParams } from 'react-router-dom';

const GamePage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <h1 className="font-pixel text-2xl text-foreground">
        Welcome to Quest: {questId}
      </h1>
      <p className="font-pixel text-lg text-muted-foreground mt-4">
        (Game content for quest {questId} will go here)
      </p>
    </div>
  );
};

export default GamePage;