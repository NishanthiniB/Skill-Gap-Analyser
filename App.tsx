import React, { useState, useEffect } from 'react';
import { AnalysisResult, AppState, Skill, User } from './types';
import { analyzeSkillGap } from './services/geminiService';
import { calculateBadges, saveBadges } from './services/gamificationService';
import { authService } from './services/authService';
import AnalysisInput from './components/AnalysisInput';
import Dashboard from './components/Dashboard';
import ProfileModal from './components/ProfileModal';
import AuthScreen from './components/AuthScreen';
import { Compass, Github, AlertTriangle, User as UserIcon, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    handleReset();
    setIsProfileOpen(false);
  };

  const handleAnalyze = async (role: string, skills: Skill[], context: string) => {
    if (!user) return;
    
    setAppState(AppState.ANALYZING);
    setCurrentSkills(skills); // Store skills for resume builder
    try {
      const result = await analyzeSkillGap(role, skills, context);
      
      // Save earned badges to local storage for the current user
      const earnedBadges = calculateBadges(result);
      saveBadges(user.id, earnedBadges);

      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      setErrorMsg("We couldn't generate the analysis. Please check your API key or try again later.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMsg('');
    setCurrentSkills([]);
    setAppState(AppState.IDLE);
  };

  // If no user is logged in, show the Auth Screen
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-12">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">CareerCompass<span className="text-indigo-400">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs text-slate-500 hidden sm:inline">Powered by Gemini 2.5 Flash</span>
             
             {/* Profile Button */}
             <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors border border-slate-700"
              title="Your Profile"
             >
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-slate-300 hidden md:block">{user.name}</span>
             </button>

             {/* Logout Button */}
             <button
               onClick={handleLogout}
               className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
               title="Sign Out"
             >
               <LogOut className="w-5 h-5" />
             </button>

             <a href="#" className="text-slate-400 hover:text-white transition-colors ml-1">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </nav>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {appState === AppState.IDLE && (
          <div className="animate-in fade-in duration-500">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6">
                  Bridge Your Skill Gap. <br/> Accelerate Your Career.
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Our AI analyzes real-time market demands to compare your skills against your dream job and builds a personalized curriculum to get you there.
                </p>
             </div>
             <AnalysisInput onAnalyze={handleAnalyze} isAnalyzing={false} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
           <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
             <AnalysisInput onAnalyze={() => {}} isAnalyzing={true} />
             <div className="mt-8 text-center space-y-2">
                <p className="text-slate-400">Scanning industry requirements...</p>
                <p className="text-slate-500 text-sm">Identifying core competencies...</p>
                <p className="text-slate-500 text-sm">Curating learning resources...</p>
             </div>
           </div>
        )}

        {appState === AppState.RESULTS && analysisResult && (
          <Dashboard 
            data={analysisResult} 
            currentSkills={currentSkills}
            onReset={handleReset}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
             <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-lg">
               <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
               <p className="text-slate-300 mb-6">{errorMsg}</p>
               <button 
                onClick={handleReset}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
               >
                 Try Again
               </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;