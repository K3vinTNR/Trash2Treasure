import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '@/components/GradientBackground';
import PrimaryButton from '@/components/PrimaryButton';
import InputField from '@/components/InputField';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authAPI } from '@/services/api';

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Nama lengkap, email, dan password harus diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone || undefined
      });

      if (response.success) {
        // Navigate to login on success
        alert('Registrasi berhasil! Silakan login.');
        navigate('/login');
      } else {
        setError(response.message || 'Registrasi gagal');
      }
    } catch (error: any) {
      setError(error.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors animate-fade-in"
          >
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </button>

          {/* Header */}
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-white/70 text-base sm:text-lg">
              Join T2T Rewards and start earning points
            </p>
          </div>

          {/* Register Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              <InputField
                label="Nama Lengkap"
                type="text"
                name="full_name"
                placeholder="Masukkan nama lengkap"
                value={formData.full_name}
                onChange={handleChange}
              />

              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                label="Nomor Telepon (Opsional)"
                type="tel"
                name="phone"
                placeholder="Masukkan nomor telepon"
                value={formData.phone}
                onChange={handleChange}
              />

              <div className="relative">
                <InputField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <InputField
                  label="Konfirmasi Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[42px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Register Button */}
              <PrimaryButton type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </PrimaryButton>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-muted-foreground text-sm">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Login di sini
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default RegisterScreen;
