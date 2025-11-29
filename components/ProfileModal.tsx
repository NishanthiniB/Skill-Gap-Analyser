import React, { useEffect, useState } from 'react';
import { Badge, User } from '../types';
import { getStoredBadges } from '../services/gamificationService';
import { X, Award, TrendingUp, Crown, Map, Zap, Star, User as UserIcon, Mail } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBadges(getStoredBadges(user.id));
    }
  }, [isOpen, user.id]);

  if (!isOpen) return null;

  const renderIcon = (iconName: string, className: string) => {
    const props = { className };
    switch (iconName) {
      case 'Award': return <Award {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Map': return <Map {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Star': return <Star {...props} />;
      default: return <Star {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <UserIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Mail className="w-3 h-3" />
                {user.email}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-slate-700 border-b border-slate-700">
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-white">{badges.length}</div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Badges Earned</div>
          </div>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-white">Level {Math.floor(badges.length / 2) + 1}</div>
            <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Current Status</div>
          </div>
          <div className="p-6 text-center">
             <div className="text-2xl font-bold text-white">Active</div>
             <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Account Standing</div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Badge Collection</h3>
          
          {badges.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No badges earned yet.</p>
              <p className="text-slate-500 text-sm mt-1">Run an analysis to earn your first badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className={`p-4 rounded-xl border flex items-center gap-4 ${badge.colorClass}`}>
                  <div className="p-3 bg-slate-900/30 rounded-full flex-shrink-0">
                    {renderIcon(badge.iconName, "w-6 h-6")}
                  </div>
                  <div>
                    <div className="font-bold text-white">{badge.title}</div>
                    <div className="text-xs opacity-90">{badge.description}</div>
                    <div className="text-[10px] opacity-60 mt-1">Earned {new Date(badge.dateEarned).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;