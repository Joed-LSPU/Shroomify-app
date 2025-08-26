'use client';
import { User, Settings, Camera, Calendar, Edit3, Mail, Phone, Trophy, Target } from 'lucide-react';
import React, { JSX, useState } from 'react';

// Type definitions
interface UserData {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  experienceLevel: string;
  favoriteMethod: string;
  avatar?: string | null;
}

interface ActivityItem {
  id: number;
  type: 'scan' | 'achievement' | 'alert';
  title: string;
  time: string;
  status: string;
  statusColor: 'green' | 'yellow' | 'red' | 'blue';
}

interface ProfileTabProps {
  userData?: UserData;
  onUpdateProfile?: (data: UserData) => void;
  onUpdateAvatar?: () => void;
  activityData?: ActivityItem[];
  personalizedTip?: string;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
  userData = {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@shroomify.com",
    phone: "+63 912 345 6789",
    joinDate: "January 2024",
    experienceLevel: "Intermediate",
    favoriteMethod: "Straw Substrate",
    avatar: null
  },
  onUpdateProfile,
  onUpdateAvatar,
  activityData = [
    {
      id: 1,
      type: "scan",
      title: "Scanned fruiting bag #23",
      time: "2 hours ago",
      status: "Healthy",
      statusColor: "green"
    },
    {
      id: 2,
      type: "achievement",
      title: "Achieved 12-day streak",
      time: "1 day ago",
      status: "Achievement",
      statusColor: "yellow"
    },
    {
      id: 3,
      type: "alert",
      title: "Detected contamination early",
      time: "3 days ago",
      status: "Alert",
      statusColor: "red"
    }
  ],
  personalizedTip = "Based on your cultivation history, consider trying the hardwood sawdust method next! Your success rate with straw substrate shows you're ready for intermediate techniques."
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [localUserData, setLocalUserData] = useState<UserData>(userData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // Handle profile updates
  const handleProfileUpdate = (field: keyof UserData, value: string): void => {
    const updatedData = { ...localUserData, [field]: value };
    setLocalUserData(updatedData);
    if (onUpdateProfile) {
      onUpdateProfile(updatedData);
    }
  };

  // Handle avatar update
  const handleAvatarUpdate = (): void => {
    if (onUpdateAvatar) {
      onUpdateAvatar();
    }
  };

  // Generate initials from name
  const getInitials = (name: string): string => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  // Get activity icon based on type
  const getActivityIcon = (type: ActivityItem['type']): JSX.Element => {
    const iconMap = {
      scan: Camera,
      achievement: Trophy,
      alert: Target
    };
    const IconComponent = iconMap[type];
    return <IconComponent className="w-4 h-4" />;
  };

  // Get status color classes
  const getStatusColorClasses = (color: ActivityItem['statusColor']) => {
    const colorMap = {
      green: {
        bg: "bg-green-600/20",
        text: "text-green-400",
        iconBg: "bg-green-600/20"
      },
      yellow: {
        bg: "bg-yellow-600/20",
        text: "text-yellow-400",
        iconBg: "bg-yellow-600/20"
      },
      red: {
        bg: "bg-red-600/20",
        text: "text-red-400",
        iconBg: "bg-red-600/20"
      },
      blue: {
        bg: "bg-blue-600/20",
        text: "text-blue-400",
        iconBg: "bg-blue-600/20"
      }
    };
    return colorMap[color];
  };

  // Minimal Google login handler: expects caller to provide an id_token (e.g., from Google Identity Services)
  const handleGoogleLogin = async (idToken: string) => {
    try {
      setIsAuthLoading(true);
      setFormError(null);
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Google login failed. Please try again.');
      }
      const user = result.user;
      setLocalUserData({
        name: user.full_name,
        email: user.email,
        phone: localUserData.phone,
        joinDate: localUserData.joinDate,
        experienceLevel: localUserData.experienceLevel,
        favoriteMethod: localUserData.favoriteMethod,
        avatar: localUserData.avatar
      });
    } catch (error: any) {
      setFormError(error?.message || 'Google login failed. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="relative bg-gradient-to-br from-green-600/20 to-blue-600/20 p-6">
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-700/50 hover:bg-gray-600/50 p-2 rounded-lg transition-colors"
              aria-label="Edit profile"
            >
              <Edit3 className="w-4 h-4 text-gray-300" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {localUserData.avatar ? (
                <img 
                  src={localUserData.avatar} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(localUserData.name)}
                </div>
              )}
              <button 
                onClick={handleAvatarUpdate}
                className="absolute -bottom-1 -right-1 bg-gray-700 hover:bg-gray-600 p-1.5 rounded-full transition-colors border-2 border-gray-800"
                aria-label="Update avatar"
              >
                <Camera className="w-3 h-3 text-gray-300" />
              </button>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={localUserData.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  className="text-xl font-semibold text-white bg-transparent border-b border-gray-600 focus:border-green-400 outline-none mb-1"
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <h3 className="text-xl font-semibold text-white mb-1">{localUserData.name}</h3>
              )}
              <div className="flex items-center text-green-400 text-sm mb-2">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                <span>{localUserData.experienceLevel} Cultivator</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Member since {localUserData.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center text-gray-300 text-sm">
              <Mail className="w-4 h-4 mr-3 text-gray-400" />
              <span>{localUserData.email}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <Phone className="w-4 h-4 mr-3 text-gray-400" />
              <span>{localUserData.phone}</span>
            </div>
            {formError && (
              <div className="text-red-400 text-sm">{formError}</div>
            )}
          </div>
        </div>
      </div>

      {/* Cultivation Preferences */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">🍄 Cultivation Preferences</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Favorite Method:</span>
            <span className="text-green-400 font-medium">{localUserData.favoriteMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Experience Level:</span>
            <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-sm">
              {localUserData.experienceLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">📊 Recent Activity</h3>
        <div className="space-y-3">
          {activityData.map((activity: ActivityItem) => {
            const statusColors = getStatusColorClasses(activity.statusColor);
            return (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${statusColors.iconBg} rounded-full flex items-center justify-center`}>
                  <span className={statusColors.text}>
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{activity.title}</p>
                  <p className="text-gray-500 text-xs">{activity.time}</p>
                </div>
                <span className={`${statusColors.bg} ${statusColors.text} px-2 py-1 rounded text-xs`}>
                  {activity.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips for You */}
      <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-lg p-4 border border-green-600/20">
        <h3 className="text-lg font-semibold text-white mb-2">💡 Personalized Tip</h3>
        <p className="text-gray-300 text-sm">
          {personalizedTip}
        </p>
      </div>

      {/* Settings + Google Login */}
      <div className="text-center space-y-3">
        <button className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto">
          <Settings className="w-5 h-5" />
          <span>Account Settings</span>
        </button>
        <button
          onClick={() => {
            // TODO: Replace with Google Identity Services flow to obtain a real id_token
            const demoIdToken = prompt('Enter Google ID token');
            if (demoIdToken) handleGoogleLogin(demoIdToken);
          }}
          disabled={isAuthLoading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-60 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center space-x-2 mx-auto"
        >
          <span>{isAuthLoading ? 'Signing in…' : 'Sign in with Google'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;