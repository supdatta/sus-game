import React from 'react';
import { PixelCard } from './pixel-card';

interface YourRankingCardProps {
  currentUser: {
    rank: number;
    name: string;
    school: string;
    schoolRank: number;
    xp: number;
    level: number;
    carbonSaved: number;
  };
  getRankColor: (rank: number) => string;
  layout: 'weekly' | 'monthly' | 'all-time';
}

export const YourRankingCard: React.FC<YourRankingCardProps> = ({ currentUser, getRankColor, layout }) => {
  if (layout === 'monthly') {
    return (
      <PixelCard className="mb-8 bg-primary/10 border-primary p-6">
        <h2 className="font-pixel text-lg text-foreground mb-4">Your Ranking</h2>
        <div className="flex flex-col items-center justify-center mb-4">
          <div className={`w-20 h-20 flex items-center justify-center border-4 font-pixel text-2xl ${getRankColor(currentUser.rank)} mb-4`}>
            #{currentUser.rank}
          </div>
          <div className="flex flex-col items-center">
            <div className="font-pixel text-xl text-foreground">{currentUser.name}</div>
            <div className="font-pixel text-md text-muted-foreground">Level {currentUser.level}</div>
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="font-pixel text-lg text-foreground">{currentUser.xp} Eco Points</div>
          <div className="font-pixel text-md text-muted-foreground">{currentUser.carbonSaved} Eco Scan Score</div>
        </div>
        <PixelCard className={`bg-primary/10 border-primary p-4 flex items-center justify-between`}>
          <div className="font-pixel text-base text-foreground">Your School: {currentUser.school}</div>
          <div className={`w-14 h-14 flex items-center justify-center border-4 font-pixel text-base ${getRankColor(currentUser.schoolRank)}`}>
            #{currentUser.schoolRank}
          </div>
        </PixelCard>
      </PixelCard>
    );
  }

  if (layout === 'all-time') {
    return (
      <PixelCard className="mb-8 bg-primary/10 border-primary p-6">
        <h2 className="font-pixel text-lg text-foreground mb-4 text-center">Your All-Time Ranking</h2>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center">
                <div className={`w-24 h-24 flex items-center justify-center border-4 font-pixel text-3xl ${getRankColor(currentUser.rank)}`}>
                    #{currentUser.rank}
                </div>
                <div className="font-pixel text-2xl text-foreground mt-2">{currentUser.name}</div>
                <div className="font-pixel text-lg text-muted-foreground">Level {currentUser.level}</div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
                <div className="font-pixel text-xl text-foreground">{currentUser.xp} Eco Points</div>
                <div className="font-pixel text-lg text-muted-foreground">{currentUser.carbonSaved} Eco Scan Score</div>
                <PixelCard className={`bg-primary/10 border-primary p-4 flex items-center justify-between`}>
                    <div className="font-pixel text-base text-foreground">Your School: {currentUser.school}</div>
                    <div className={`w-14 h-14 flex items-center justify-center border-4 font-pixel text-base ${getRankColor(currentUser.schoolRank)}`}>
                        #{currentUser.schoolRank}
                    </div>
                </PixelCard>
            </div>
        </div>
      </PixelCard>
    );
  }

  // Default weekly layout
  return (
    <PixelCard className="mb-8 bg-primary/10 border-primary p-6">
      <h2 className="font-pixel text-lg text-foreground mb-4">Your Ranking</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 flex items-center justify-center border-4 font-pixel text-base ${getRankColor(currentUser.rank)}`}>
            #{currentUser.rank}
          </div>
          <div className="flex flex-col">
            <div className="font-pixel text-base text-foreground">{currentUser.name}</div>
            <div className="font-pixel text-sm text-muted-foreground">Level {currentUser.level}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-pixel text-base text-foreground">{currentUser.xp} Eco Points</div>
          <div className="font-pixel text-sm text-muted-foreground">{currentUser.carbonSaved} Eco Scan Score</div>
        </div>
      </div>
      <PixelCard className={`bg-primary/10 border-primary p-4 flex items-center justify-between`}>
        <div className="font-pixel text-base text-foreground">Your School: {currentUser.school}</div>
        <div className={`w-14 h-14 flex items-center justify-center border-4 font-pixel text-base ${getRankColor(currentUser.schoolRank)}`}>
          #{currentUser.schoolRank}
        </div>
      </PixelCard>
    </PixelCard>
  );
};