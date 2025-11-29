import React from 'react';
import { AnalysisResult, Skill } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { CheckCircle2, BookOpen, ExternalLink, ArrowRight, PlayCircle } from 'lucide-react';
import ChatBot from './ChatBot';
import GamificationPanel from './GamificationPanel';
import ResumeBuilder from './ResumeBuilder';

interface DashboardProps {
  data: AnalysisResult;
  currentSkills: Skill[];
  onReset: () => void;
  onOpenProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, currentSkills, onReset, onOpenProfile }) => {
  
  const getImportanceColor = (imp: string) => {
    switch (imp) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  const getProviderStyle = (provider: string) => {
    const p = provider.toLowerCase();
    if (p.includes('coursera')) return 'text-[#0056D2] bg-[#0056D2]/10 border-[#0056D2]/20';
    if (p.includes('udemy')) return 'text-[#A435F0] bg-[#A435F0]/10 border-[#A435F0]/20';
    if (p.includes('edx')) return 'text-[#D0304C] bg-[#D0304C]/10 border-[#D0304C]/20';
    if (p.includes('pluralsight')) return 'text-[#F15B2A] bg-[#F15B2A]/10 border-[#F15B2A]/20';
    if (p.includes('youtube') || p.includes('video')) return 'text-[#FF0000] bg-[#FF0000]/10 border-[#FF0000]/20';
    return 'text-slate-400 bg-slate-700/50 border-slate-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
        <div>
          <div className="text-slate-400 text-sm font-medium mb-1">Target Role</div>
          <h1 className="text-3xl font-bold text-white mb-2">{data.jobTitle}</h1>
          <p className="text-slate-400 max-w-2xl">{data.marketSummary}</p>
        </div>
        <div className="flex flex-col items-end">
           <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
               <circle 
                 cx="48" cy="48" r="40" 
                 stroke="currentColor" 
                 strokeWidth="8" 
                 fill="transparent" 
                 strokeDasharray={`${2 * Math.PI * 40}`} 
                 strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.matchScore / 100)}`}
                 className={`${data.matchScore > 75 ? 'text-emerald-500' : data.matchScore > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`} 
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-2xl font-bold text-white">{data.matchScore}%</span>
               <span className="text-xs text-slate-400 uppercase tracking-wider">Match</span>
             </div>
           </div>
        </div>
      </div>

      {/* Gamification Panel */}
      <GamificationPanel data={data} onOpenProfile={onOpenProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Market Demand Visualization (Replaced Chart with Clean List) */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
            Market Skill Demand
          </h3>
          <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {data.topSkillsRequired.map((skill, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-medium text-slate-200 text-sm">{skill.name}</span>
                  <span className="text-indigo-400 font-bold text-xs">{skill.frequency}% Demand</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-1000 ease-out group-hover:from-indigo-500 group-hover:to-violet-400 relative"
                    style={{ width: `${skill.frequency}%` }}
                  >
                     <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-500 rounded-full"></span>
            Critical Skill Gaps
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[350px]">
            {data.gaps.map((gap, idx) => (
              <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-200">{gap.skillName}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getImportanceColor(gap.importance)}`}>
                    {gap.importance} Priority
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-400 mb-2 gap-2">
                   <span>You: <span className="text-slate-300">{gap.userLevel}</span></span>
                   <ArrowRight className="w-3 h-3 text-slate-600" />
                   <span>Market: <span className="text-indigo-300">{gap.marketRequirement}</span></span>
                </div>
                <p className="text-xs text-slate-500">{gap.gapDescription}</p>
              </div>
            ))}
            {data.gaps.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <CheckCircle2 className="w-12 h-12 mb-2 text-emerald-500" />
                <p>No critical gaps found!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Builder */}
      <ResumeBuilder role={data.jobTitle} skills={currentSkills} />

      {/* Learning Path */}
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-2">
           <BookOpen className="w-6 h-6 text-indigo-400" />
           Personalized Learning Path
        </h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-8 top-4 bottom-4 w-0.5 bg-slate-700"></div>

          <div className="space-y-12">
            {data.learningPath.map((step, idx) => (
              <div key={idx} className="relative pl-12 md:pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-1.5 md:left-[27px] top-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 border-4 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10"></div>
                
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-1 block">Step {step.stepNumber}</span>
                      <h4 className="text-xl font-bold text-white">{step.topic}</h4>
                    </div>
                  </div>
                  <p className="text-slate-400 mb-6">{step.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.resources.map((resource, rIdx) => (
                      <a 
                        key={rIdx} 
                        href={resource.url || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex flex-col p-4 bg-slate-800 rounded-lg border border-slate-700/50 hover:bg-slate-800/80 transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
                        
                        <div className="flex justify-between items-start mb-2 pl-2">
                           <span className={`text-xs font-semibold px-2 py-1 rounded border ${getProviderStyle(resource.provider)}`}>
                             {resource.type}
                           </span>
                           <span className="text-xs text-slate-500">{resource.estimatedDuration}</span>
                        </div>
                        
                        <h5 className="font-medium text-slate-200 mb-1 pl-2 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                          {resource.title}
                          {resource.type === 'Video' && <PlayCircle className="w-3 h-3 inline opacity-70" />}
                        </h5>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 pl-2">
                           <span className={getProviderStyle(resource.provider).split(' ')[0]}>{resource.provider}</span>
                        </div>
                        
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2 pl-2">{resource.description}</p>
                        
                        <div className="mt-auto pt-2 flex justify-end">
                           <span className="flex items-center text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                             View Resource <ExternalLink className="w-3 h-3 ml-1" />
                           </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-8 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors"
        >
          Start New Analysis
        </button>
      </div>

      {/* AI Chat Bot */}
      <ChatBot analysisResult={data} />

    </div>
  );
};

export default Dashboard;