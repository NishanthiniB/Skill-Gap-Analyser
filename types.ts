export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface LearningResource {
  title: string;
  type: 'Course' | 'Project' | 'Documentation' | 'Video';
  provider: string;
  estimatedDuration: string;
  description: string;
}

export interface LearningStep {
  stepNumber: number;
  topic: string;
  description: string;
  resources: LearningResource[];
}

export interface MarketGap {
  skillName: string;
  userLevel: string;
  marketRequirement: string;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  gapDescription: string;
}

export interface AnalysisResult {
  jobTitle: string;
  matchScore: number; // 0-100
  marketSummary: string;
  topSkillsRequired: { name: string; frequency: number }[]; // For charts
  gaps: MarketGap[];
  learningPath: LearningStep[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface ResumeInsights {
  professionalSummary: string;
  achievements: string[];
  keywords: string[];
}