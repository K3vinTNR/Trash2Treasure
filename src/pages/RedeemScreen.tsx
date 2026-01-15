import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GradientBackground from '@/components/GradientBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { ArrowLeft, Gift, Calendar, AlertCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const RedeemScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reward = location.state?.reward || {
    brandName: 'Nature Café',
    rewardLabel: 'Free Meal',
    currentPoints: 0,
    targetPoints: 10000,
  };

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  // Cek apakah points sudah cukup
  const isPointsEnough = reward.currentPoints >= reward.targetPoints;
  const pointsNeeded = reward.targetPoints - reward.currentPoints;

  const handleConfirm = () => {
    if (!isPointsEnough) {
      return; // Tidak bisa redeem jika points tidak cukup
    }
    // Mock redeem action
    alert('Voucher redeemed successfully! 🎉');
    navigate('/rewards');
  };

  return (
    <GradientBackground>
      <div className="flex flex-col min-h-screen px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors mb-8 animate-fade-in"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Brand Logo */}
          <div className="w-28 h-28 rounded-3xl bg-white/90 shadow-lg flex items-center justify-center mb-6 animate-scale-in">
            <span className="text-4xl font-bold text-gradient">{reward.brandName.charAt(0)}</span>
          </div>

          {/* Reward Info */}
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-2xl font-bold text-white mb-2">{reward.brandName}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Gift size={18} className="text-white" />
              <span className="text-white font-medium">{reward.rewardLabel}</span>
            </div>
          </div>

          {/* Confirmation Card */}
          <div className="glass-card rounded-3xl p-6 w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-lg font-semibold text-foreground text-center mb-4">
              {isPointsEnough ? 'Confirm Redemption' : 'Points Not Enough'}
            </h2>
            
            {!isPointsEnough && (
              <div className="flex items-start gap-3 p-4 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-600 mb-1">
                    Insufficient Points
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You need{' '}
                    <span className="font-bold text-foreground">
                      {pointsNeeded.toLocaleString()} more points
                    </span>{' '}
                    to redeem this reward.
                  </p>
                </div>
              </div>
            )}
            
            <p className="text-muted-foreground text-center mb-2">
              {isPointsEnough ? (
                <>
                  Are you sure you want to redeem{' '}
                  <span className="font-bold text-foreground">
                    {reward.targetPoints.toLocaleString()} points
                  </span>{' '}
                  for this voucher?
                </>
              ) : (
                <>
                  Your current points:{' '}
                  <span className="font-bold text-foreground">
                    {reward.currentPoints.toLocaleString()}
                  </span>
                  <br />
                  Required points:{' '}
                  <span className="font-bold text-foreground">
                    {reward.targetPoints.toLocaleString()}
                  </span>
                </>
              )}
            </p>

            {/* Progress Bar */}
            {!isPointsEnough && (
              <div className="mb-6 mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.round((reward.currentPoints / reward.targetPoints) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${(reward.currentPoints / reward.targetPoints) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Valid Until - only show if points enough */}
            {isPointsEnough && (
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-muted mb-6">
                <Calendar size={18} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Valid until{' '}
                  <span className="font-medium text-foreground">
                    {validUntil.toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <PrimaryButton
                variant="secondary"
                fullWidth
                onClick={() => navigate(-1)}
              >
                {isPointsEnough ? 'No' : 'Back'}
              </PrimaryButton>
              {isPointsEnough && (
                <PrimaryButton
                  fullWidth
                  onClick={handleConfirm}
                >
                  Yes, Redeem
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>

        {/* Points Info */}
        <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-white/60 text-sm">
            {isPointsEnough 
              ? 'Points will be deducted from your account after confirmation'
              : 'Keep collecting points to unlock this reward'
            }
          </p>
        </div>
      </div>
      
      <BottomNav />
    </GradientBackground>
  );
};

export default RedeemScreen;
