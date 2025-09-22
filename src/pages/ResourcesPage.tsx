import React, { useState, useEffect } from "react";
import { PixelCard } from "../components/ui/pixel-card";
import { PixelButton } from "../components/ui/pixel-button";
import { ProgressBar } from "../components/ui/progress-bar";

// Global type declarations for window functions
declare global {
  interface Window {
    addEcoPoints: (amount: number) => void;
    onPuzzleComplete: () => void;
  }
}

// TypeScript interfaces for our data structures
interface BadgeData {
  id: string;
  name: string;
  emoji: string;
  threshold: number;
  unlocked: boolean;
}

// --- ADDED INTERFACE FOR SHOP ITEMS ---
interface ShopItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  category: "waste-reduction" | "transportation" | "reforestation" | "renewable-energy";
}

interface DailyQuest {
  id: string;
  title: string;
  current: number;
  target: number;
  reward: string; // Emoji for the reward
  completed: boolean;
}

const ResourcesPage: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [ecoPoints, setEcoPoints] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lastClaimDate, setLastClaimDate] = useState<string>("");
  const [streakDays, setStreakDays] = useState<boolean[]>(Array(7).fill(false));
  const [showCompletionPopup, setShowCompletionPopup] = useState<boolean>(false);
  
  // --- ADDED STATE FOR THE SHOP ---
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [showRedemptionModal, setShowRedemptionModal] = useState<boolean>(false);
  const [redeemedItem, setRedeemedItem] = useState<ShopItem | null>(null);

  const [badges, setBadges] = useState<BadgeData[]>([
    { id: "plastic", name: "Plastic Reducer", emoji: "♻️", threshold: 50, unlocked: false },
    { id: "water", name: "Water Saver", emoji: "💧", threshold: 100, unlocked: false },
    { id: "carbon", name: "Carbon Cutter", emoji: "🌱", threshold: 200, unlocked: false },
    { id: "tree", name: "Tree Planter", emoji: "🌳", threshold: 500, unlocked: false },
  ]);
  
  // --- ADDED SHOP ITEM DATA ---
  const shopItems: ShopItem[] = [
    { id: "bottle", name: "Reusable Bottle", cost: 30, description: "Reduce plastic waste", icon: "🥤", category: "waste-reduction" },
    { id: "bike", name: "Bike Ride Pass", cost: 50, description: "Eco-friendly travel", icon: "🚲", category: "transportation" },
    { id: "plant", name: "Plant a Tree", cost: 100, description: "Help reforestation", icon: "🌱", category: "reforestation" },
    { id: "solar", name: "Solar Panel Kit", cost: 150, description: "Clean energy for home", icon: "☀️", category: "renewable-energy" },
  ];

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([
    { id: "quest-lesson", title: "Complete 1 lesson", current: 0, target: 1, reward: "📦", completed: false },
    { id: "quest-scan", title: "Scan 3 items", current: 0, target: 3, reward: "🥈", completed: false },
    { id: "quest-time", title: "Learn for 15 mins", current: 0, target: 15, reward: "🏆", completed: false },
  ]);

  // --- DATA LOADING & GLOBAL FUNCTIONS ---
  useEffect(() => {
    const savedEcoPoints = localStorage.getItem("ecoPoints");
    const savedStreak = localStorage.getItem("streak");
    const savedLastClaimDate = localStorage.getItem("lastClaimDate");
    const savedBadges = localStorage.getItem("badges");
    const savedStreakDays = localStorage.getItem("streakDays");
    const savedQuests = localStorage.getItem("dailyQuests");

    const points = savedEcoPoints ? parseInt(savedEcoPoints) : 0;
    setEcoPoints(points);
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLastClaimDate) setLastClaimDate(savedLastClaimDate);
    if (savedStreakDays) setStreakDays(JSON.parse(savedStreakDays));
    if (savedQuests) setDailyQuests(JSON.parse(savedQuests));

    if (savedBadges) {
        setBadges(JSON.parse(savedBadges));
    } else {
        updateBadges(points, true);
    }
    
    window.addEcoPoints = (amount: number) => {
        setEcoPoints(prev => {
            const newPoints = prev + amount;
            localStorage.setItem("ecoPoints", newPoints.toString());
            updateBadges(newPoints);
            return newPoints;
        });
    };

    window.onPuzzleComplete = () => {
        setShowCompletionPopup(true);
        setTimeout(() => setShowCompletionPopup(false), 3500);
    };
  }, []);

  // --- HELPER FUNCTIONS ---
  const updateBadges = (points: number, fromLoad: boolean = false) => {
    setBadges(prevBadges => {
        const updatedBadges = prevBadges.map(badge => ({ ...badge, unlocked: points >= badge.threshold }));
        if (!fromLoad) localStorage.setItem("badges", JSON.stringify(updatedBadges));
        return updatedBadges;
    });
  };

  const handleClaimDailyReward = () => {
    const today = new Date().toDateString();
    if (lastClaimDate !== today) {
        const newPoints = ecoPoints + 10;
        const newStreak = streak + 1;
        let newStreakDays = [...streakDays];
        if (newStreak === 1 || newStreak > 7) newStreakDays = Array(7).fill(false);
        if(newStreak-1 < 7) newStreakDays[newStreak-1] = true;

        const finalStreak = (newStreak === 7) ? 0 : newStreak;
        if(finalStreak === 0) newStreakDays = Array(7).fill(false);

        setEcoPoints(newPoints);
        setStreak(finalStreak);
        setLastClaimDate(today);
        setStreakDays(newStreakDays);

        localStorage.setItem("ecoPoints", newPoints.toString());
        localStorage.setItem("streak", finalStreak.toString());
        localStorage.setItem("lastClaimDate", today);
        localStorage.setItem("streakDays", JSON.stringify(newStreakDays));
        updateBadges(newPoints);
    }
  };

  // --- ADDED SHOP PURCHASE HANDLER ---
  const handlePurchase = (item: ShopItem) => {
    if (ecoPoints >= item.cost) {
      const newPoints = ecoPoints - item.cost;
      setEcoPoints(newPoints);
      localStorage.setItem("ecoPoints", newPoints.toString());
      updateBadges(newPoints);
      
      setRedeemedItem(item);
      setShowRedemptionModal(true);
    } else {
      alert("You don't have enough points!");
    }
  };
  
  const closeRedemptionModal = () => {
      setShowRedemptionModal(false);
      setRedeemedItem(null);
  }

  const canClaimDaily = lastClaimDate !== new Date().toDateString();
  const treesToShow = Math.min(Math.floor(ecoPoints / 20), 18);

  return (
    <div className="p-4" style={{backgroundColor: "#F0D8C2"}}>
      <PixelCard className="mb-8 p-4">
        <div className="flex justify-between items-center">
            <h1 className="font-pixel text-xl md:text-2xl text-foreground">Rewards Hub</h1>
            <div className="flex items-center gap-2 border-2 border-foreground p-2 bg-secondary">
                <span className="font-pixel text-sm text-secondary-foreground">Eco Points:</span>
                <span className="font-pixel text-lg text-secondary-foreground font-bold">{ecoPoints}</span>
            </div>
        </div>
      </PixelCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PixelCard className="p-6">
            <h2 className="font-pixel text-lg text-center mb-4">🏆 Achievement Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map(badge => (
                <div key={badge.id} className={`p-4 border-2 flex flex-col items-center justify-center gap-2 text-center ${badge.unlocked ? 'bg-primary/20 border-primary' : 'bg-muted filter grayscale opacity-60'}`}>
                  <span className="text-4xl">{badge.emoji}</span>
                  <span className="font-pixel text-xs font-bold">{badge.name}</span>
                  <span className={`font-pixel text-xs font-bold ${badge.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                    {badge.unlocked ? "UNLOCKED" : `${badge.threshold} pts`}
                  </span>
                </div>
              ))}
            </div>
          </PixelCard>

          <PixelCard className="p-6">
            <h2 className="font-pixel text-lg text-center mb-4">🌍 Virtual Eco-World</h2>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {Array.from({ length: 18 }).map((_, index) => (
                <div key={index} className={`aspect-square border-2 flex items-center justify-center ${index < treesToShow ? 'bg-primary border-primary' : index === treesToShow ? 'bg-accent/30 border-accent animate-pulse' : 'bg-muted'}`}>
                  {index < treesToShow && <span className="text-2xl animate-bounce">🌳</span>}
                </div>
              ))}
            </div>
            <p className="font-pixel text-center text-xs text-muted-foreground">You have planted {treesToShow} of 18 trees. Plant a new tree every 20 Eco Points!</p>
          </PixelCard>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <PixelCard className="p-6">
            <h2 className="font-pixel text-lg text-center mb-4">🔥 Daily Streak</h2>
            <p className="font-pixel text-center text-sm text-muted-foreground mb-4">
                {streak > 0 ? `You're on a ${streak}-day streak!` : "Claim your first reward to start!"}
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {streakDays.map((claimed, index) => (
                <div key={index} className={`w-10 h-10 border-2 flex items-center justify-center ${claimed ? 'bg-primary border-primary text-2xl' : 'bg-muted'}`}>
                  {claimed ? '🔥' : ''}
                </div>
              ))}
            </div>
            <PixelButton onClick={handleClaimDailyReward} disabled={!canClaimDaily} className="w-full">
              {canClaimDaily ? "Claim Daily +10 Points" : "Claimed Today"}
            </PixelButton>
          </PixelCard>
          
          <PixelCard className="p-6">
              <h2 className="font-pixel text-lg text-center mb-4">🕹️ Daily Quests</h2>
              <div className="space-y-4">
                  {dailyQuests.map(quest => (
                      <div key={quest.id} className={`p-2 border-2 ${quest.completed ? 'opacity-50' : ''}`}>
                          <div className="flex justify-between items-center mb-1">
                              <p className="font-pixel text-xs">{quest.title}</p>
                              <p className="font-pixel text-xl">{quest.reward}</p>
                          </div>
                          <ProgressBar value={(quest.current / quest.target) * 100} />
                          <p className="font-pixel text-xs text-right mt-1 text-muted-foreground">{quest.current}/{quest.target}</p>
                      </div>
                  ))}
              </div>
          </PixelCard>

          {/* --- NEW ECO SHOP SECTION --- */}
          <PixelCard className="p-6">
            <h2 className="font-pixel text-lg text-center mb-4">🛒 Eco Shop</h2>
            <div className="space-y-4">
                {shopItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-2 border-2 border-border">
                        <span className="text-4xl">{item.icon}</span>
                        <div className="flex-grow">
                            <p className="font-pixel text-sm font-bold">{item.name}</p>
                            <p className="font-pixel text-xs text-primary">{item.cost} points</p>
                        </div>
                        <PixelButton size="sm" onClick={() => handlePurchase(item)} disabled={ecoPoints < item.cost}>
                            Buy
                        </PixelButton>
                    </div>
                ))}
            </div>
          </PixelCard>
        </div>
      </div>

      {/* --- POPUP MODALS --- */}
      {showCompletionPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <PixelCard className="p-8 text-center max-w-sm border-4 border-primary">
            <span className="text-6xl animate-bounce">🎉</span>
            <h2 className="font-pixel text-lg my-4">Challenge Complete!</h2>
            <p className="mb-6 text-muted-foreground">Great job! You've earned Eco Points!</p>
            <PixelButton onClick={() => setShowCompletionPopup(false)}>Awesome!</PixelButton>
          </PixelCard>
        </div>
      )}

      {showRedemptionModal && redeemedItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <PixelCard className="p-8 text-center max-w-sm border-4 border-accent">
            <span className="text-6xl animate-bounce">{redeemedItem.icon}</span>
            <h2 className="font-pixel text-lg my-4">Item Redeemed!</h2>
            <p className="mb-6 text-muted-foreground">You have successfully redeemed the {redeemedItem.name}!</p>
            <PixelButton onClick={closeRedemptionModal}>Continue</PixelButton>
          </PixelCard>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;