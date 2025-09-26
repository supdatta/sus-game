import React, { useState, useEffect, useContext } from "react";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import "./RewardPage.css";
import { AuthContext } from "@/context/AuthContext";

interface BadgeData {
  id: string;
  name: string;
  emoji: string;
  threshold: number;
  unlocked: boolean;
}

interface ShopItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  category: string;
  status: "available" | "locked" | "sold-out";
  type: "digital" | "physical";
  isNew: boolean;
  isHot: boolean;
}

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  reward: string;
  completed: boolean;
}

const RewardPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const ecoPoints = auth?.user?.ecoPoints ?? 0;
  const [streak, setStreak] = useState<number>(0);
  const [lastClaimDate, setLastClaimDate] = useState<string>("");
  const [streakDays, setStreakDays] = useState<boolean[]>(new Array(7).fill(false));
  const [motivationMessage, setMotivationMessage] = useState<number>(0);
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showRedemptionModal, setShowRedemptionModal] = useState<boolean>(false);
  const [redeemedItem, setRedeemedItem] = useState<ShopItem | null>(null);

  const motivationMessages = [
    "Keep it up! 🌟",
    "Consistency is the key! 🌱",
    "You're growing greener every day 🌍",
    "Every day counts! 🌿",
    "Building habits, saving the planet! 🌎",
    "You're on fire! 🔥",
    "Eco-warrior in the making! ⚡"
  ];

  const [showCompletionPopup, setShowCompletionPopup] = useState<boolean>(false);
  const [badges, setBadges] = useState<BadgeData[]>([
    { id: "plastic", name: "Plastic Reducer", emoji: "♻️", threshold: 20, unlocked: false },
    { id: "water", name: "Water Saver", emoji: "💧", threshold: 50, unlocked: false },
    { id: "carbon", name: "Carbon Cutter", emoji: "🌱", threshold: 75, unlocked: false },
    { id: "tree", name: "Tree Planter", emoji: "🌳", threshold: 100, unlocked: false },
  ]);

  const shopItems: ShopItem[] = [
    { id: "bottle", name: "Reusable Bottle", cost: 30, description: "Reduce plastic waste", icon: "🥤", category: "waste-reduction", status: "available", type: "physical", isNew: false, isHot: true },
    { id: "bike", name: "Bike Ride Pass", cost: 50, description: "Eco-friendly transportation", icon: "🚲", category: "transportation", status: "available", type: "digital", isNew: false, isHot: false },
    { id: "plant", name: "Plant a Tree", cost: 100, description: "Help reforestation efforts", icon: "🌱", category: "reforestation", status: "available", type: "physical", isNew: true, isHot: false },
    { id: "solar", name: "Solar Panel Kit", cost: 150, description: "Clean energy for your home", icon: "☀️", category: "renewable-energy", status: "available", type: "physical", isNew: false, isHot: true },
  ];

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([
    { id: "quest-complete-lesson", title: "Complete 1 lesson", description: "Finish one sustainability lesson", current: 0, target: 1, reward: "chest", completed: false },
    { id: "quest-listen-exercises", title: "Listen to 5 exercises", description: "Complete 5 listening exercises", current: 0, target: 5, reward: "silver-chest", completed: false },
    { id: "quest-spend-time", title: "Spend 15 minutes learning", description: "Spend 15 minutes in learning activities", current: 0, target: 15, reward: "gold-chest", completed: false },
  ]);

  const [timeLeft, setTimeLeft] = useState<string>("13 hours left");

  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const timeDiff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeLeft(`${hours} hours left`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes} minutes left`);
      } else {
        setTimeLeft("Time's up!");
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Rotate motivation messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationMessage(prev => (prev + 1) % motivationMessages.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, [motivationMessages.length]);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Deprecated: ecoPoints are now managed via AuthContext user.ecoPoints
    const savedStreak = localStorage.getItem("streak");
    const savedLastClaimDate = localStorage.getItem("lastClaimDate");
    const savedBadges = localStorage.getItem("badges");
    const savedDailyQuests = localStorage.getItem("dailyQuests");
    const savedStreakDays = localStorage.getItem("streakDays");

    // if (savedEcoPoints) setEcoPoints(parseInt(savedEcoPoints)); // removed
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLastClaimDate) setLastClaimDate(savedLastClaimDate);
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    if (savedDailyQuests) setDailyQuests(JSON.parse(savedDailyQuests));
    if (savedStreakDays) setStreakDays(JSON.parse(savedStreakDays));
    
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));

    // Set up global functions
    (window as any).addEcoPoints = (amount: number, reason: string = "Reward granted") => {
      if (auth?.addEcoPoints) auth.addEcoPoints(amount, reason);
      updateBadges((auth?.user?.ecoPoints ?? 0) + amount);
    };
    
    (window as any).onPuzzleComplete = () => {
        setShowCompletionPopup(true);
        // Auto-hide after 3 seconds
        setTimeout(() => setShowCompletionPopup(false), 3000);
    };
  }, []);

  // Update badges based on eco points
  const updateBadges = (points: number) => {
    setBadges(prev => {
      const updated = prev.map(badge => ({ ...badge, unlocked: points >= badge.threshold }));
      localStorage.setItem("badges", JSON.stringify(updated));
      return updated;
    });
  };

  // Handle daily reward claim
  const handleClaimDailyReward = () => {
    const today = new Date().toDateString();
    if (lastClaimDate !== today) {
      const newStreak = lastClaimDate === "" ? 1 : streak + 1;

      const newStreakDays = [...streakDays];
      const currentDayIndex = newStreak - 1; 
      if (currentDayIndex >= 0 && currentDayIndex < 7) {
        newStreakDays[currentDayIndex] = true;
      }

      // Award Auth-based eco points
      auth?.addEcoPoints?.(10, "Daily reward claimed");

      setStreak(newStreak);
      setLastClaimDate(today);
      setStreakDays(newStreakDays);

      localStorage.setItem("streak", newStreak.toString());
      localStorage.setItem("lastClaimDate", today);
      localStorage.setItem("streakDays", JSON.stringify(newStreakDays));
      updateBadges(ecoPoints + 10);
    }
  };

  // Handle shop item purchase
  const handlePurchase = (item: ShopItem) => {
    if (ecoPoints >= item.cost) {
      // Deduct points via AuthContext
      auth?.addEcoPoints?.(-item.cost, `Redeemed ${item.name}`);
      updateBadges(ecoPoints - item.cost);
      
      setRedeemedItem(item);
      setShowRedemptionModal(true);

      setTimeout(() => {
        setShowRedemptionModal(false);
        setRedeemedItem(null);
      }, 3000);

    } else {
      alert(`❌ Not enough eco points! You need ${item.cost - ecoPoints} more points to purchase ${item.name}.`);
    }
  };

  // Handle favorite toggle
  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(Array.from(newFavorites)));
  };

  // Filter shop items
  const filteredShopItems = shopItems.filter(item => {
    if (shopFilter === "all") return true;
    if (shopFilter === "digital") return item.type === "digital";
    if (shopFilter === "physical") return item.type === "physical";
    return true;
  });

  const getItemProgress = (cost: number) => {
    return Math.min((ecoPoints / cost) * 100, 100);
  };

  // Handle quest progress update (demo function)
  const updateQuestProgress = (questId: string, increment: number = 1) => {
    setDailyQuests(prev => {
      const updated = prev.map(quest => {
        if (quest.id === questId) {
          const newCurrent = Math.min(quest.current + increment, quest.target);
          const wasCompleted = quest.completed;
          const completed = newCurrent >= quest.target;
          if (!wasCompleted && completed) {
            auth?.addEcoPoints?.(5, "Mission completed (Rewards)");
          }
          return { ...quest, current: newCurrent, completed };
        }
        return quest;
      });
      localStorage.setItem("dailyQuests", JSON.stringify(updated));
      return updated;
    });
  };

  const simulateQuestProgress = (questId: string) => {
    updateQuestProgress(questId, 1);
  };
  
  // Calculate trees for eco-world
  const getTreeCount = () => Math.floor(ecoPoints / 20);
  const maxTrees = 18; // 6x3 grid
  const treesToShow = Math.min(getTreeCount(), maxTrees);

  const canClaimDaily = lastClaimDate !== new Date().toDateString();

  return (
    <div className="reward-page">
      <div className="container mx-auto max-w-6xl">
      <header className="reward-header mb-8">
        <div className="header-title-group">
          <h1 className="reward-title">🌟 Eco-Rewards Hub: Your Green Journey! 🌟</h1>
          <p className="reward-subtitle">Earn points, redeem perks, and track your green journey.</p>
        </div>
        <div className="eco-points-display">
          <span className="eco-points-label">Eco Points:</span>
          <span className="eco-points-value">{ecoPoints}</span>
        </div>
      </header>
      
      <div className="reward-content">
        <main className="reward-main">
          {/* Badges Section */}
          <PixelCard className="badges-section">
            <div className="p-6">
              <div className="badges-header">
                <h2 className="font-pixel text-lg text-foreground mb-2 text-center">🏆 Achievement Badges</h2>
                  <div className="badges-progress">
                    <div className="progress-info">
                        <span className="progress-text">Progress: {badges.filter(b => b.unlocked).length}/{badges.length} unlocked</span>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${(badges.filter(b => b.unlocked).length / badges.length) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
              </div>
              <div className="badges-grid">
                {badges.map((badge) => {
                  const progress = Math.min((ecoPoints / badge.threshold) * 100, 100);
                  const isUnlocked = badge.unlocked;
                  const isNext = !isUnlocked && ecoPoints >= (badge.threshold - 20);
                  return (
                    <div
                      key={badge.id}
                      className={`badge-item ${isUnlocked ? "unlocked" : isNext ? "next-badge" : "locked"}`}
                    >
                      <div className="badge-icon-container">
                        <div className="badge-emoji">{badge.emoji}</div>
                        {isUnlocked && <div className="unlock-sparkle">✨</div>}
                        {isNext && <div className="next-indicator">🌟</div>}
                      </div>
                      <div className="badge-content">
                        <div className="badge-name">{badge.name}</div>
                        <div className="badge-threshold">
                          {isUnlocked ? "✓ Unlocked" : `${badge.threshold} points`}
                        </div>
                        {!isUnlocked && (
                            <div className="badge-progress">
                                <div className="mini-progress-bar">
                                    <div className="mini-progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="progress-percentage">{Math.round(progress)}%</span>
                            </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PixelCard>
          
          {/* Streak Section */}
          <PixelCard className="streak-section">
            <div className="p-6">
              <h2 className="font-pixel text-lg text-foreground mb-4 text-center">🔥 Daily Streak</h2>
              <div className="streak-counter">
                  <div className="streak-count-text">
                      {streak === 0 ? "Start your eco journey!" : `You're on a ${streak}-day streak!`}
                  </div>
              </div>

              <div className="streak-progress-container">
                  <div className="streak-progress-bar">
                      {Array.from({ length: 7 }, (_, index) => (
                          <div key={index} className={`streak-day-slot ${streakDays[index] ? 'claimed' : 'unclaimed'}`}>
                              {streakDays[index] ? '🔥' : '🔲'}
                          </div>
                      ))}
                  </div>
                  <div className="streak-progress-label">7-day streak progress</div>
              </div>
              
              <div className="motivation-message">
                  <span>{motivationMessages[motivationMessage]}</span>
              </div>

              <div className="points-reward-highlight">
                  {!canClaimDaily ? (
                      <div className="earned-today">
                          <span className="points-earned">+10 points earned today 🌱</span>
                      </div>
                  ) : null}
              </div>
              
              <div className="claim-button-container">
                <PixelButton
                  onClick={handleClaimDailyReward}
                  disabled={!canClaimDaily}
                  className="claim-button"
                  variant="primary"
                >
                  {canClaimDaily ? "🎁 Claim Daily Reward (+10 points)" : "✅ +10 Points Claimed Today"}
                </PixelButton>
              </div>
            </div>
          </PixelCard>

          {/* Virtual Eco-World */}
            <PixelCard className="eco-world-section">
                <div className="p-6">
                    <h2 className="font-pixel text-lg text-foreground mb-4 text-center">🌍 Virtual Eco-World</h2>
                    <div className="eco-world-header">
                        <div className="eco-stats">
                            <div className="stat-item">
                                <span className="stat-icon">🌳</span>
                                <span className="stat-value">{treesToShow}</span>
                                <span className="stat-label">Trees Planted</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">🌱</span>
                                <span className="stat-value">{ecoPoints % 20}/20</span>
                                <span className="stat-label">Next Tree</span>
                            </div>
                        </div>
                    </div>
                    <div className="eco-world-grid">
                        {Array.from({ length: maxTrees }, (_, index) => {
                            const hasTree = index < treesToShow;
                            const isNext = index === treesToShow;
                            return (
                                <div key={index} className={`eco-cell ${hasTree ? 'has-tree' : isNext ? 'next-tree' : 'empty'}`}>
                                    {hasTree && <span className="tree-emoji">🌳</span>}
                                    {isNext && <span className="next-tree-indicator">🌱</span>}
                                </div>
                            );
                        })}
                    </div>
                    <p className="eco-world-info">
                        {treesToShow === 0
                            ? "Start earning points to plant your first tree! 🌱"
                            : `Amazing! You've planted ${treesToShow} of ${maxTrees} trees! 🌳`
                        }
                    </p>
                </div>
            </PixelCard>

                    </main>
        
        <aside className="reward-sidebar">
          {/* Daily Quests */}
          <PixelCard className="daily-quests-section">
            <div className="p-6">
                <div className="quests-header">
                    <div className="quests-title-section">
                        <h2 className="font-pixel text-lg text-foreground">🕹️ Daily Quests</h2>
                        <div className="quests-summary">
                            <span className="completed-count">{dailyQuests.filter(q => q.completed).length}/{dailyQuests.length} completed</span>
                        </div>
                    </div>
                    <div className="countdown-section">
                        <span className="countdown-label">Time Left:</span>
                        <span className="font-pixel text-sm text-muted-foreground countdown-timer">{timeLeft}</span>
                    </div>
                </div>
              <div className="daily-quests-list">
                {dailyQuests.map((quest, index) => {
                  const progress = (quest.current / quest.target) * 100;
                  const isCompleted = quest.completed;
                  const isAlmostComplete = progress >= 80 && !isCompleted;
                  return (
                    <div
                      key={quest.id}
                      className={`daily-quest-item ${isCompleted ? 'completed' : isAlmostComplete ? 'almost-complete' : ''}`}
                      onClick={() => simulateQuestProgress(quest.id)}
                    >
                      <div className="quest-number">{index + 1}</div>
                      <div className="quest-content">
                        <div className="quest-header">
                            <h3 className="quest-title">{quest.title}</h3>
                            <div className="quest-reward">
                                {quest.reward === 'chest' && '📦'}
                                {quest.reward === 'silver-chest' && '🥈'}
                                {quest.reward === 'gold-chest' && '🏆'}
                            </div>
                        </div>
                        <div className="quest-progress">
                            <div className="progress-info">
                                <span className="progress-text">Progress: {quest.current} / {quest.target}</span>
                                <span className="progress-percentage">{Math.round(progress)}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                {isAlmostComplete && <div className="almost-complete-indicator">🔥</div>}
                            </div>
                        </div>
                        {isCompleted && (
                          <div className="completion-badge">
                            <span className="completion-text">✅ Completed!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PixelCard>
          
          {/* Eco Shop */}
          <PixelCard className="shop-section">
            <div className="p-6">
                <div className="shop-header">
                    <h2 className="font-pixel text-lg text-foreground mb-2 text-center">🛒 Eco Shop</h2>
                    <div className="points-balance">
                        <div className="balance-icon">💰</div>
                        <div className="balance-text">
                            <span className="balance-label">Your Balance:</span>
                            <span className="balance-amount">{ecoPoints} points</span>
                        </div>
                    </div>
                </div>

              <div className="shop-filters">
                <div className="filter-buttons">
                    <button className={`filter-btn ${shopFilter === 'all' ? 'active' : ''}`} onClick={() => setShopFilter('all')}>All</button>
                    <button className={`filter-btn ${shopFilter === 'digital' ? 'active' : ''}`} onClick={() => setShopFilter('digital')}>Digital</button>
                    <button className={`filter-btn ${shopFilter === 'physical' ? 'active' : ''}`} onClick={() => setShopFilter('physical')}>Physical</button>
                </div>
              </div>
              
              <div className="shop-items-grid">
                {filteredShopItems.map((item) => {
                  const progress = getItemProgress(item.cost);
                  const canAfford = ecoPoints >= item.cost;
                  const isFavorite = favorites.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`shop-item-card ${item.category} ${item.status} ${canAfford ? 'affordable' : 'expensive'}`}
                    >
                      <div className="item-status-tags">
                        {item.isNew && <span className="status-tag new">NEW</span>}
                        {item.isHot && <span className="status-tag hot">HOT</span>}
                        {item.status === 'locked' && <span className="status-tag locked">LOCKED</span>}
                      </div>

                      <button className={`favorite-btn ${isFavorite ? 'favorited' : ''}`} onClick={() => toggleFavorite(item.id)}>
                          {isFavorite ? '❤️' : '🤍'}
                      </button>

                      <div className="item-icon-container">
                        <div className="item-icon">{item.icon}</div>
                        <div className="item-type-badge">{item.type}</div>
                      </div>
                      
                      <div className="item-info">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-description">{item.description}</p>

                        <div className="item-progress">
                            <div className="progress-label">Progress to unlock</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="progress-text">{Math.round(progress)}%</div>
                        </div>

                        <div className="item-points">
                            <div className="points-cost">{item.cost} points</div>
                            <div className="points-needed">
                                {canAfford ? "✅ Available" : `Need ${item.cost - ecoPoints} more`}
                            </div>
                        </div>
                      </div>
                      
                      <div className="item-actions">
                        <PixelButton
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford || item.status === 'locked'}
                          className="redeem-button"
                          variant={canAfford ? 'primary' : 'secondary'}
                        >
                          {item.status === 'locked' ? '🔒 Locked' : canAfford ? '🎁 Redeem' : '💸 Need Points'}
                        </PixelButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PixelCard>
        </aside>
      </div>

      {/* Puzzle Completion Popup */}
      {showCompletionPopup && (
        <div className="completion-popup-overlay">
            <div className="completion-popup">
                <div className="completion-content">
                    <div className="completion-emoji">🎉</div>
                    <h2 className="completion-title">Puzzle Completed!</h2>
                    <p className="completion-message">
                        Great job! You've earned eco points for completing this challenge.
                    </p>
                    <PixelButton onClick={() => setShowCompletionPopup(false)} className="close-button" variant="primary">
                        Close
                    </PixelButton>
                </div>
            </div>
        </div>
      )}

      {/* Redemption Modal */}
      {showRedemptionModal && redeemedItem && (
        <div className="redemption-modal-overlay">
            <div className="redemption-modal">
                <div className="celebration-animation">
                    <div className="confetti">🎉</div>
                    <div className="confetti">🎊</div>
                    <div className="confetti">✨</div>
                    <div className="confetti">🌟</div>
                </div>
                <div className="modal-content">
                    <div className="success-icon">✅</div>
                    <h3 className="modal-title">Redemption Successful!</h3>
                    <p className="modal-message">
                        You've successfully redeemed <strong>{redeemedItem.name}</strong>!
                    </p>
                    <div className="modal-details">
                        <div className="detail-item">
                            <span className="detail-label">Item:</span>
                            <span className="detail-value">{redeemedItem.icon} {redeemedItem.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Cost:</span>
                            <span className="detail-value">{redeemedItem.cost} points</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Remaining Balance:</span>
                            <span className="detail-value">{ecoPoints} points</span>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="modal-close-btn" onClick={() => { setShowRedemptionModal(false); setRedeemedItem(null); }}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default RewardPage;
