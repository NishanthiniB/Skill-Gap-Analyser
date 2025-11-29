import React, { useState } from 'react';
import { Skill, ResumeInsights } from '../types';
import { generateResumeInsights } from '../services/geminiService';
import { FileText, Sparkles, Check, Copy } from 'lucide-react';

interface ResumeBuilderProps {
  role: string;
  skills: Skill[];
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ role, skills }) => {
  const [insights, setInsights] = useState<ResumeInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateResumeInsights(role, skills);
      setInsights(data);
    } catch (err) {
      console.error("Failed to generate resume insights", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           <h3 className="text-xl font-semibold text-white flex items-center gap-2">
             <FileText className="w-6 h-6 text-indigo-400" />
             AI Resume Optimizer
           </h3>
           <p className="text-slate-400 text-sm mt-1">Get tailored suggestions to update your resume for {role}.</p>
        </div>
        {!insights && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Insights
              </>
            )}
          </button>
        )}
      </div>

      {insights && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Professional Summary */}
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-indigo-300 font-medium text-sm uppercase tracking-wide">Professional Summary</h4>
              <button 
                onClick={() => copyToClipboard(insights.professionalSummary, 'summary')}
                className="text-slate-500 hover:text-white transition-colors"
              >
                {copied === 'summary' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              {insights.professionalSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Achievements */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-indigo-300 font-medium text-sm uppercase tracking-wide">Key Achievements</h4>
              </div>
              <ul className="space-y-3">
                {insights.achievements.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 group">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                    <span className="flex-1">{item}</span>
                    <button 
                      onClick={() => copyToClipboard(item, `ach-${idx}`)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-all"
                    >
                      {copied === `ach-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-indigo-300 font-medium text-sm uppercase tracking-wide">ATS Keywords</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;