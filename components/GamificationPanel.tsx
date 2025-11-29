import React from 'react';
import { AnalysisResult } from '../types';
import { Award, TrendingUp, Crown, Map, Zap, Star } from 'lucide-react';

interface GamificationPanelProps {
  data: AnalysisResult;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ data }) => {
  const badges = [];

  // Logic to award badges
  if (data.matchScore >= 80) {
    badges.push({
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      title: "Top Candidate",
      desc: "High market match",
      color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-200"
    });
  } else if (data.matchScore >= 50) {
    badges.push({
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      title: "Rising Star",
      desc: "Strong potential",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
    });
  } else {
    badges.push({
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Growth Seeker",
      desc: "Ready to learn",
      color: "bg-blue-500/10 border-blue-500/20 text-blue-200"
    });
  }

  if (data.gaps.length < 3) {
    badges.push({
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      title: "Skill Master",
      desc: "Few critical gaps",
      color: "bg-purple-500/10 border-purple-500/20 text-purple-200"
    });
  }

  if (data.learningPath.length > 0) {
    badges.push({
      icon: <Map className="w-6 h-6 text-indigo-400" />,
      title: "Pathfinder",
      desc: "Roadmap generated",
      color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-200"
    });
  }

  // Always award a 'Future Ready' badge for using the tool
  badges.push({
    icon: <Star className="w-6 h-6 text-orange-400" />,
    title: "Future Ready",
    desc: "Taking action",
    color: "bg-orange-500/10 border-orange-500/20 text-orange-200"
  });

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-400" />
        Achievements & Badges
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 ${badge.color} transition-transform hover:scale-105`}>
            <div className="p-2 bg-slate-900/30 rounded-full">
              {badge.icon}
            </div>
            <div>
              <div className="font-bold text-sm">{badge.title}</div>
              <div className="text-xs opacity-80">{badge.desc}</div>
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