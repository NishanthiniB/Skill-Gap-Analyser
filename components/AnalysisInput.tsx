import React, { useState, KeyboardEvent } from 'react';
import { Skill } from '../types';
import { Plus, X, Briefcase, Code, BrainCircuit } from 'lucide-react';

interface AnalysisInputProps {
  onAnalyze: (role: string, skills: Skill[], context: string) => void;
  isAnalyzing: boolean;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [role, setRole] = useState('');
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [context, setContext] = useState('');

  const handleAddSkill = () => {
    if (!currentSkillInput.trim()) return;
    
    // Simple heuristic to guess level if user doesn't specify, default to Intermediate
    // User can just type "React" or "React (Expert)"
    let name = currentSkillInput.trim();
    let level: Skill['level'] = 'Intermediate';

    if (name.toLowerCase().includes('(beginner)')) {
      level = 'Beginner';
      name = name.replace(/\(beginner\)/i, '').trim();
    } else if (name.toLowerCase().includes('(advanced)')) {
      level = 'Advanced';
      name = name.replace(/\(advanced\)/i, '').trim();
    } else if (name.toLowerCase().includes('(expert)')) {
      level = 'Expert';
      name = name.replace(/\(expert\)/i, '').trim();
    }

    setSkills(prev => [...prev, { name, level }]);
    setCurrentSkillInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role && skills.length > 0) {
      onAnalyze(role, skills, context);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Profile Assessment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Target Role */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Target Job Role</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer, Data Scientist"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        {/* Skills Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Current Skills</label>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={currentSkillInput}
                onChange={(e) => setCurrentSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter (e.g. 'React', 'Python')"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Skill Chips */}
          <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
            {skills.length === 0 && (
              <p className="text-slate-500 text-sm italic">No skills added yet.</p>
            )}
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm">
                <span>{skill.name}</span>
                <span className="text-xs opacity-60">({skill.level})</span>
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Additional Context (Optional)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="I have 3 years of experience in backend but want to move to full-stack. I prefer video courses."
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !role || skills.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]
            ${isAnalyzing || !role || skills.length === 0
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25'
            }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Market Data...
            </span>
          ) : (
            'Generate Analysis & Learning Path'
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalysisInput;