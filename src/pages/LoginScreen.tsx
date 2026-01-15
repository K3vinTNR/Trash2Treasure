import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '@/components/GradientBackground';
import PrimaryButton from '@/components/PrimaryButton';
import InputField from '@/components/InputField';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '@/services/api';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        navigate('/rewards');
      } else {
        setError(response.message || 'Login gagal');
      }
    } catch (error: any) {
      setError(error.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Welcome to
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              T2T Rewards
            </h2>
            <p className="text-white/70 text-base sm:text-lg">
              Sign in to collect and redeem your rewards
            </p>
          </div>

          {/* Login Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}
              
              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <InputField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Lost your password?
                </button>
              </div>

              {/* Login Button */}
              <PrimaryButton type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </PrimaryButton>
            </form>
            
            {/* Register Link */}
            <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <p className="text-muted-foreground text-sm">
                No account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-primary font-semibold hover:underline"
                >
                  Register now
                </button>
              </p>
            </div>
          </div>

          {/* Social Login Divider */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-white/50 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              {['G', 'f', '𝕏'].map((icon, i) => (
                <button
                  key={i}
                  className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xl font-bold hover:bg-white/20 transition-all"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default LoginScreen;
