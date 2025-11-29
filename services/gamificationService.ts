import { AnalysisResult, Badge } from '../types';

export const calculateBadges = (data: AnalysisResult): Badge[] => {
  const badges: Badge[] = [];
  const date = new Date().toISOString();

  // Score based badges
  if (data.matchScore >= 80) {
    badges.push({
      id: 'top-candidate',
      title: 'Top Candidate',
      description: 'Achieved > 80% match score',
      iconName: 'Award',
      colorClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      dateEarned: date
    });
  } else if (data.matchScore >= 50) {
    badges.push({
      id: 'rising-star',
      title: 'Rising Star',
      description: 'Achieved > 50% match score',
      iconName: 'TrendingUp',
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      dateEarned: date
    });
  } else {
    badges.push({
      id: 'growth-seeker',
      title: 'Growth Seeker',
      description: 'Identified key growth areas',
      iconName: 'Zap',
      colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      dateEarned: date
    });
  }

  // Gap based badges
  if (data.gaps.length < 3) {
    badges.push({
      id: 'skill-master',
      title: 'Skill Master',
      description: 'Less than 3 critical gaps',
      iconName: 'Crown',
      colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      dateEarned: date
    });
  }

  // Action based badges
  if (data.learningPath.length > 0) {
    badges.push({
      id: 'pathfinder',
      title: 'Pathfinder',
      description: 'Generated a learning path',
      iconName: 'Map',
      colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      dateEarned: date
    });
  }

  // Participation badge
  badges.push({
    id: 'future-ready',
    title: 'Future Ready',
    description: 'Completed a career analysis',
    iconName: 'Star',
    colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    dateEarned: date
  });

  return badges;
};

// Update storage key to accept user ID
const getStorageKey = (userId: string) => `career_compass_badges_${userId}`;

export const getStoredBadges = (userId: string): Badge[] => {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load badges", e);
    return [];
  }
};

export const saveBadges = (userId: string, newBadges: Badge[]) => {
  try {
    const current = getStoredBadges(userId);
    const map = new Map(current.map(b => [b.id, b]));
    
    // Only add if not already present
    newBadges.forEach(b => {
      if (!map.has(b.id)) {
        map.set(b.id, b);
      }
    });
    
    localStorage.setItem(getStorageKey(userId), JSON.stringify(Array.from(map.values())));
  } catch (e) {
    console.error("Failed to save badges", e);
  }
};