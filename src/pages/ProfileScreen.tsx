import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Award, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { userAPI, authAPI, getCurrentUser } from "@/services/api";
import BottomNav from "@/components/BottomNav";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error: any) {
      setError('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple/20 via-pastel-blue/20 to-pastel-pink/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple/20 via-pastel-blue/20 to-pastel-pink/20 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`} />
                <AvatarFallback>{profile?.full_name ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-gray-800">{profile?.full_name || 'User'}</h2>
              <p className="text-gray-600">Member since {new Date(profile?.created_at).getFullYear() || '2024'}</p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-pastel-purple" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{profile?.email || '-'}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-pastel-blue" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{profile?.phone || 'Not set'}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-pastel-pink" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">{profile?.address || 'Not set'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-pastel-purple" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-pastel-purple/20 to-pastel-blue/20 rounded-lg">
                <p className="text-3xl font-bold text-gray-800">{profile?.points || 0}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20 rounded-lg">
                <p className="text-3xl font-bold text-gray-800">{profile?.total_waste_kg || 0} kg</p>
                <p className="text-sm text-gray-600">Waste Recycled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <Button className="w-full" variant="outline">
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
