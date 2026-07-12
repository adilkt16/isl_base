export type QuizResult = {
  id: string;
  category: string;
  score: number;
  total: number;
  timestamp: number;
};

export type LastActiveSign = {
  id: string;
  category: 'alphabet' | 'number';
};

export type ProgressState = {
  learnedSigns: string[]; // Array of sign IDs marked as learned
  quizScores: QuizResult[];
  lastActiveSign?: LastActiveSign;
};

const STORAGE_KEY = 'isl_learning_platform_progress_v1';

const defaultState: ProgressState = {
  learnedSigns: [],
  quizScores: [],
};

// Check if window is defined to avoid SSR issues
const isClient = typeof window !== 'undefined';

export function getStoredProgress(): ProgressState {
  if (!isClient) return defaultState;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultState;
    const parsed = JSON.parse(data);
    return {
      learnedSigns: Array.isArray(parsed.learnedSigns) ? parsed.learnedSigns : [],
      quizScores: Array.isArray(parsed.quizScores) ? parsed.quizScores : [],
      lastActiveSign: parsed.lastActiveSign || undefined,
    };
  } catch (e) {
    console.error('Failed to read progress from localStorage', e);
    return defaultState;
  }
}

export function saveStoredProgress(state: ProgressState) {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Trigger custom event so components can listen to changes reactively
    window.dispatchEvent(new Event('isl-progress-update'));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function toggleSignLearned(id: string): boolean {
  const current = getStoredProgress();
  const index = current.learnedSigns.indexOf(id);
  let isNowLearned = false;
  if (index >= 0) {
    current.learnedSigns.splice(index, 1);
  } else {
    current.learnedSigns.push(id);
    isNowLearned = true;
  }
  saveStoredProgress(current);
  return isNowLearned;
}

export function isSignLearned(id: string): boolean {
  const current = getStoredProgress();
  return current.learnedSigns.includes(id);
}

export function saveQuizScore(category: string, score: number, total: number): QuizResult {
  const current = getStoredProgress();
  const newResult: QuizResult = {
    id: Math.random().toString(36).substring(2, 9),
    category,
    score,
    total,
    timestamp: Date.now(),
  };
  current.quizScores.push(newResult);
  saveStoredProgress(current);
  return newResult;
}

export function setLastActiveSign(id: string, category: 'alphabet' | 'number') {
  const current = getStoredProgress();
  current.lastActiveSign = { id, category };
  saveStoredProgress(current);
}

export function getLastActiveSign(): LastActiveSign | undefined {
  const current = getStoredProgress();
  return current.lastActiveSign;
}

export function clearAllProgress() {
  saveStoredProgress(defaultState);
}
