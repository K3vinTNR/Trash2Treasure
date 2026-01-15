import React from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-screen min-h-screen gradient-background overflow-hidden ${className}`}>
      {/* Decorative floating circles */}
      <div 
        className="circle-decoration w-64 h-64 bg-white/20 -top-20 -left-20 animate-pulse-soft"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="circle-decoration w-48 h-48 bg-white/15 top-1/4 -right-16 animate-pulse-soft"
        style={{ animationDelay: '1s' }}
      />
      <div 
        className="circle-decoration w-32 h-32 bg-white/25 bottom-1/4 -left-8 animate-pulse-soft"
        style={{ animationDelay: '2s' }}
      />
      <div 
        className="circle-decoration w-56 h-56 bg-white/10 -bottom-16 right-0 animate-pulse-soft"
        style={{ animationDelay: '0.5s' }}
      />
      <div 
        className="circle-decoration w-24 h-24 bg-white/30 top-1/2 left-1/4 animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground;
