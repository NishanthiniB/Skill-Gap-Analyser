import React from 'react';
import { AnalysisResult } from '../types';
import { calculateBadges } from '../services/gamificationService';
import { Award, TrendingUp, Crown, Map, Zap, Star, ArrowRight } from 'lucide-react';

interface GamificationPanelProps {
  data: AnalysisResult;
  onOpenProfile: () => void;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ data, onOpenProfile }) => {
  const badges = calculateBadges(data);

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
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative group">
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          Achievements & Badges
        </h3>
        <button 
          onClick={onOpenProfile}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors px-3 py-1 rounded-lg hover:bg-indigo-500/10"
        >
          View Full Profile <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 ${badge.colorClass} transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer`} onClick={onOpenProfile}>
            <div className="p-2 bg-slate-900/30 rounded-full">
              {renderIcon(badge.iconName, "w-6 h-6")}
            </div>
            <div>
              <div className="font-bold text-sm">{badge.title}</div>
              <div className="text-xs opacity-80">{badge.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Career Readiness</span>
          <span>{data.matchScore}/100</span>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${data.matchScore}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;