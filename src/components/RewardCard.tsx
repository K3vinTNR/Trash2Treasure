import React from 'react';
import { cn } from '@/lib/utils';

interface RewardCardProps {
  brandName: string;
  brandLogo?: string;
  currentPoints: number;
  targetPoints: number;
  rewardLabel: string;
  daysLeft?: number;
  onClick?: () => void;
  className?: string;
}

const RewardCard: React.FC<RewardCardProps> = ({
  brandName,
  brandLogo,
  currentPoints,
  targetPoints,
  rewardLabel,
  daysLeft,
  onClick,
  className,
}) => {
  const progress = Math.min((currentPoints / targetPoints) * 100, 100);

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-3xl p-5 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Brand Logo */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pastel-purple/20 to-pastel-pink/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="text-2xl font-bold text-gradient">{brandName.charAt(0)}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">{brandName}</h3>
              <span className="inline-block px-3 py-1 mt-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {rewardLabel}
              </span>
            </div>
            {daysLeft !== undefined && (
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap',
                daysLeft <= 3 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
              )}>
                {daysLeft} days left
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {currentPoints.toLocaleString()} / {targetPoints.toLocaleString()}
              </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, hsl(268 70% 60%) 0%, hsl(330 60% 65%) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
