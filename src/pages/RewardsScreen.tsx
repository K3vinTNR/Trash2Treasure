import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RewardCard from '@/components/RewardCard';
import { Bell, User, Search, Gift } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

// Mock data
const mockRewards = [
  {
    id: 1,
    brandName: 'Kopi Kenangan',
    currentPoints: 7500,
    targetPoints: 10000,
    rewardLabel: 'Free Coffee',
    daysLeft: 12,
  },
  {
    id: 2,
    brandName: 'Aston Hotel',
    currentPoints: 4200,
    targetPoints: 15000,
    rewardLabel: '20% Discount',
    daysLeft: 30,
  },
  {
    id: 3,
    brandName: 'GreenMart',
    currentPoints: 9800,
    targetPoints: 10000,
    rewardLabel: 'Free Eco Bag',
    daysLeft: 5,
  },
  {
    id: 4,
    brandName: 'EcoRecycle',
    currentPoints: 2100,
    targetPoints: 5000,
    rewardLabel: 'Bonus Points',
    daysLeft: 45,
  },
  {
    id: 5,
    brandName: 'Nature Café',
    currentPoints: 10000,
    targetPoints: 10000,
    rewardLabel: 'Free Meal',
    daysLeft: 3,
  },
];

const RewardsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const totalPoints = 15420;

  const filteredRewards = mockRewards.filter(reward =>
    reward.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRewardClick = (reward: typeof mockRewards[0]) => {
    // Navigate ke redeem page dengan data reward
    navigate('/redeem', { state: { reward } });
  };

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header with gradient */}
      <div className="gradient-background px-5 pt-12 pb-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="circle-decoration w-32 h-32 bg-white/10 -top-8 -right-8" />
        <div className="circle-decoration w-20 h-20 bg-white/15 top-16 -left-6" />
        
        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm">Good morning!</p>
            <h1 className="text-white text-xl font-bold">Trashure Hunters</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/reminders')}
              className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <Bell size={20} className="text-white" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              <User size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Points Card */}
        <div className="relative z-10 glass-card rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Points</p>
              <p className="text-3xl font-bold text-gradient">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Gift size={28} className="text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-4 pb-24">
        {/* Search Bar */}
        <div className="relative mb-6 animate-fade-in">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-soft"
          />
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Rewards</h2>
          <span className="text-sm text-muted-foreground">{filteredRewards.length} active</span>
        </div>

        {/* Rewards List */}
        <div className="space-y-4">
          {filteredRewards.map((reward, index) => (
            <div
              key={reward.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RewardCard
                brandName={reward.brandName}
                currentPoints={reward.currentPoints}
                targetPoints={reward.targetPoints}
                rewardLabel={reward.rewardLabel}
                daysLeft={reward.daysLeft}
                onClick={() => handleRewardClick(reward)}
              />
            </div>
          ))}
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rewards found</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default RewardsScreen;
