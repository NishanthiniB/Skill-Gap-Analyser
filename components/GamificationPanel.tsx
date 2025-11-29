import React from 'react';
import { AnalysisResult } from '../types';
import { calculateBadges } from '../services/gamificationService';
import { Award, TrendingUp, Crown, Map, Zap, Star } from 'lucide-react';

interface GamificationPanelProps {
  data: AnalysisResult;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ data }) => {
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
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-400" />
        Achievements & Badges
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 ${badge.colorClass} transition-transform hover:scale-105`}>
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
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
            style={{ width: `${data.matchScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;