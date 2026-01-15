import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gift, Bell, User, QrCode, History } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const leftNavItems = [
    { path: '/rewards', label: 'Rewards', icon: Gift },
    { path: '/history', label: 'History', icon: History },
  ];

  const rightNavItems = [
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isScanActive = location.pathname === '/scan';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-between items-center h-14 sm:h-16 px-3 sm:px-4 relative">
        {/* Left Nav Items */}
        {leftNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Scan Button (Center - Floating) */}
        <button
          onClick={() => navigate('/scan')}
          className={`absolute left-1/2 -translate-x-1/2 -top-5 sm:-top-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isScanActive
              ? 'bg-gradient-to-br from-primary to-accent scale-110'
              : 'bg-gradient-to-br from-primary to-accent hover:scale-105'
          }`}
        >
          <QrCode size={24} className="text-white sm:w-7 sm:h-7" strokeWidth={2.5} />
        </button>

        {/* Right Nav Items */}
        <div className="flex-1" /> {/* Spacer for center button */}
        {rightNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
