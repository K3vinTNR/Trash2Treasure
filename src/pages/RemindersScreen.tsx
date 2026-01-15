import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Gift } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

// Mock data for reminders
const mockReminders = [
  {
    id: 1,
    brandName: 'Nature Café',
    rewardLabel: 'Free Meal',
    daysLeft: 3,
    points: 10000,
  },
  {
    id: 2,
    brandName: 'GreenMart',
    rewardLabel: 'Free Eco Bag',
    daysLeft: 5,
    points: 9800,
  },
  {
    id: 3,
    brandName: 'Kopi Kenangan',
    rewardLabel: 'Free Coffee',
    daysLeft: 12,
    points: 7500,
  },
];

const RemindersScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container bg-background min-h-screen">
      {/* Header */}
      <div className="gradient-background px-5 pt-12 pb-6 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="circle-decoration w-24 h-24 bg-white/10 -top-6 right-8" />
        
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Reminders</h1>
            <p className="text-white/70 text-sm">Don't miss your rewards!</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 -mt-2">
        {/* Urgent Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <h2 className="text-base font-semibold text-foreground">Expiring Soon</h2>
          </div>

          <div className="space-y-3">
            {mockReminders.map((reminder, index) => (
              <div
                key={reminder.id}
                className="glass-card rounded-2xl p-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  {/* Brand Logo */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-purple/20 to-pastel-pink/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-gradient">{reminder.brandName.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{reminder.brandName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Gift size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{reminder.rewardLabel}</span>
                    </div>
                  </div>

                  {/* Days Left Badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    reminder.daysLeft <= 5 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <Clock size={14} />
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {reminder.daysLeft} Days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="glass-card rounded-2xl p-5 border border-primary/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                Redeem your rewards before they expire to maximize your points value!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default RemindersScreen;
