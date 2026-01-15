import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '@/components/GradientBackground';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <GradientBackground>
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        {/* Logo Container */}
        <div className="animate-scale-in">
          {/* App Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center">
              <span className="text-3xl">🎁</span>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-4xl font-bold text-white text-center mb-2 drop-shadow-lg">
            Trash2Treasure
          </h1>
          
          {/* Tagline */}
          <p className="text-white/80 text-center text-lg font-medium animate-fade-in" style={{ animationDelay: '0.3s' }}>
            T2T Rewards
          </p>
        </div>

        {/* Team Credit */}
        <div className="absolute bottom-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-white/60 text-sm font-medium">
            By <span className="text-white/80">Treasure Team</span>
          </p>
        </div>

        {/* Loading indicator */}
        <div className="absolute bottom-24 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white/60 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default SplashScreen;
