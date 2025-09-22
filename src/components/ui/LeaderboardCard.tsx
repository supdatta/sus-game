import React from 'react';
import { PixelCard } from './pixel-card';

interface LeaderboardCardProps {
  player: {
    rank: number;
    name: string;
    school: string;
    schoolRank: number;
    xp: number;
    level: number;
    carbonSaved: number;
  };
  getRankIcon: (rank: number) => string;
  getRankColor: (rank: number) => string;
  layout: 'default' | 'monthly' | 'all-time';
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ player, getRankIcon, getRankColor, layout }) => {
  if (layout === 'monthly') {
    return (
      <PixelCard className={`flex flex-col p-5 border-2 ${player.rank <= 3 ? getRankColor(player.rank) : 'bg-muted border-border'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 flex items-center justify-center border-2 font-pixel text-sm ${player.rank <= 3 ? 'border-current' : 'border-foreground'}`}>
              {player.rank <= 3 ? getRankIcon(player.rank) : `#${player.rank}`}
            </div>
            <div className="flex flex-col">
              <div className="font-pixel text-base text-foreground">{player.name}</div>
              <div className="font-pixel text-sm text-muted-foreground">Level {player.level}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-pixel text-base text-foreground">{player.xp.toLocaleString()} Eco Points</div>
            <div className="font-pixel text-sm text-muted-foreground">{player.carbonSaved} Eco Scan Score</div>
          </div>
        </div>
        <PixelCard className="bg-primary/10 border-primary p-3 flex items-center justify-between">
          <div className="font-pixel text-sm text-foreground">School: {player.school}</div>
          <div className={`w-12 h-12 flex items-center justify-center border-2 font-pixel text-sm ${getRankColor(player.schoolRank)}`}>
            #{player.schoolRank}
          </div>
        </PixelCard>
      </PixelCard>
    );
  }

  if (layout === 'all-time') {
    return (
      <PixelCard className={`grid grid-cols-3 gap-4 p-5 border-2 ${player.rank <= 3 ? getRankColor(player.rank) : 'bg-muted border-border'}`}>
        <div className="col-span-1 flex items-center space-x-4">
          <div className={`w-12 h-12 flex items-center justify-center border-2 font-pixel text-sm ${player.rank <= 3 ? 'border-current' : 'border-foreground'}`}>
            {player.rank <= 3 ? getRankIcon(player.rank) : `#${player.rank}`}
          </div>
          <div className="flex flex-col">
            <div className="font-pixel text-base text-foreground">{player.name}</div>
            <div className="font-pixel text-sm text-muted-foreground">Level {player.level}</div>
          </div>
        </div>
        <div className="col-span-1 text-center">
          <div className="font-pixel text-base text-foreground">{player.xp.toLocaleString()} Eco Points</div>
          <div className="font-pixel text-sm text-muted-foreground">{player.carbonSaved} Eco Scan Score</div>
        </div>
        <div className="col-span-1 flex items-center justify-end">
          <PixelCard className="bg-primary/10 border-primary p-3 flex items-center space-x-4">
            <div className="font-pixel text-sm text-foreground">School: {player.school}</div>
            <div className={`w-12 h-12 flex items-center justify-center border-2 font-pixel text-sm ${getRankColor(player.schoolRank)}`}>
              #{player.schoolRank}
            </div>
          </PixelCard>
        </div>
      </PixelCard>
    );
  }

  return (
    <div className={`flex flex-col p-5 border-2 ${player.rank <= 3 ? getRankColor(player.rank) : 'bg-muted border-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 flex items-center justify-center border-2 font-pixel text-sm ${player.rank <= 3 ? 'border-current' : 'border-foreground'}`}>
            {player.rank <= 3 ? getRankIcon(player.rank) : `#${player.rank}`}
          </div>
          <div className="flex flex-col">
            <div className="font-pixel text-base text-foreground">{player.name}</div>
            <div className="font-pixel text-sm text-muted-foreground">Level {player.level}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-pixel text-base text-foreground">{player.xp.toLocaleString()} Eco Points</div>
          <div className="font-pixel text-sm text-muted-foreground">{player.carbonSaved} Eco Scan Score</div>
        </div>
      </div>
      <PixelCard className="bg-primary/10 border-primary p-3 flex items-center justify-between">
        <div className="font-pixel text-sm text-foreground">School: {player.school}</div>
        <div className={`w-12 h-12 flex items-center justify-center border-2 font-pixel text-sm ${getRankColor(player.schoolRank)}`}>
          #{player.schoolRank}
        </div>
      </PixelCard>
    </div>
  );
};