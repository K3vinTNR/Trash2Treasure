import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '@/components/GradientBackground';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { qrAPI } from '@/services/api';

interface ScanHistoryItem {
  id: number;
  qr_code: string;
  points_earned: number;
  scanned_at: string;
}

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await qrAPI.getScanHistory();
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  return (
    <GradientBackground>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 animate-fade-in">
          <button
            onClick={() => navigate('/rewards')}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Scan History</h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Clock size={64} className="text-white/30 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No History Yet</h3>
              <p className="text-white/70 text-sm">Start scanning QR codes to see your history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-4 animate-fade-in hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={16} className="text-primary" />
                        <p className="text-foreground font-semibold">{item.qr_code}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">{formatDate(item.scanned_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gradient-to-br from-primary to-accent rounded-xl px-4 py-2">
                        <p className="text-white text-lg font-bold">+{item.points_earned}</p>
                        <p className="text-white/80 text-xs">points</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </GradientBackground>
  );
};

export default HistoryScreen;
