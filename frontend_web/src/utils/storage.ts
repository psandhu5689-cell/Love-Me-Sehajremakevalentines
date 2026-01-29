// Local storage utilities for various features

// Lie Detector History
const LIE_DETECTOR_HISTORY_KEY = 'lie_detector_history';
const MAX_LIE_DETECTOR_ENTRIES = 10;

export interface LieDetectorEntry {
  id: string;
  statement: string;
  result: 'LIE' | 'TRUTH';
  timestamp: number;
}

export const lieDetectorStorage = {
  getHistory: (): LieDetectorEntry[] => {
    try {
      const data = localStorage.getItem(LIE_DETECTOR_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addEntry: (statement: string, result: 'LIE' | 'TRUTH'): LieDetectorEntry => {
    const history = lieDetectorStorage.getHistory();
    const entry: LieDetectorEntry = {
      id: Date.now().toString(),
      statement,
      result,
      timestamp: Date.now(),
    };
    history.unshift(entry);
    // Keep only last 10 entries
    const trimmed = history.slice(0, MAX_LIE_DETECTOR_ENTRIES);
    localStorage.setItem(LIE_DETECTOR_HISTORY_KEY, JSON.stringify(trimmed));
    return entry;
  },

  clearHistory: () => {
    localStorage.removeItem(LIE_DETECTOR_HISTORY_KEY);
  },
};

// Torture Chamber Stats
const TORTURE_STATS_KEY = 'torture_chamber_stats';

export interface TortureStats {
  totalDeaths: number;
  totalRevivals: number;
  currentHp: number;
}

export const tortureStorage = {
  getStats: (): TortureStats => {
    try {
      const data = localStorage.getItem(TORTURE_STATS_KEY);
      return data ? JSON.parse(data) : { totalDeaths: 0, totalRevivals: 0, currentHp: 3000 };
    } catch {
      return { totalDeaths: 0, totalRevivals: 0, currentHp: 3000 };
    }
  },

  updateStats: (stats: Partial<TortureStats>) => {
    const current = tortureStorage.getStats();
    const updated = { ...current, ...stats };
    localStorage.setItem(TORTURE_STATS_KEY, JSON.stringify(updated));
    return updated;
  },

  incrementDeaths: () => {
    const stats = tortureStorage.getStats();
    return tortureStorage.updateStats({ totalDeaths: stats.totalDeaths + 1 });
  },

  incrementRevivals: () => {
    const stats = tortureStorage.getStats();
    return tortureStorage.updateStats({ totalRevivals: stats.totalRevivals + 1 });
  },
};

// Future Goals
const GOALS_KEY = 'future_goals';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  isShared: boolean;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export const goalsStorage = {
  getGoals: (): Goal[] => {
    try {
      const data = localStorage.getItem(GOALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completed'>): Goal => {
    const goals = goalsStorage.getGoals();
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: Date.now(),
      completed: false,
    };
    goals.unshift(newGoal);
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    return newGoal;
  },

  completeGoal: (id: string) => {
    const goals = goalsStorage.getGoals();
    const updated = goals.map(g => g.id === id ? { ...g, completed: true, completedAt: Date.now() } : g);
    localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
  },

  deleteGoal: (id: string) => {
    const goals = goalsStorage.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    localStorage.setItem(GOALS_KEY, JSON.stringify(filtered));
  },
};

// Heart to Heart History
const HEART_TO_HEART_KEY = 'heart_to_heart_history';

export interface HeartToHeartEntry {
  id: string;
  prompt: string;
  user: 'prabh' | 'sehaj';
  timestamp: number;
}

export const heartToHeartStorage = {
  getHistory: (): HeartToHeartEntry[] => {
    try {
      const data = localStorage.getItem(HEART_TO_HEART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addEntry: (prompt: string, user: 'prabh' | 'sehaj'): HeartToHeartEntry => {
    const history = heartToHeartStorage.getHistory();
    const entry: HeartToHeartEntry = {
      id: Date.now().toString(),
      prompt,
      user,
      timestamp: Date.now(),
    };
    history.unshift(entry);
    localStorage.setItem(HEART_TO_HEART_KEY, JSON.stringify(history.slice(0, 100)));
    return entry;
  },
};