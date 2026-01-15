const STORAGE_KEYS = {
  WORKOUTS: 'workout_tracker_workouts',
  PLANS: 'workout_tracker_plans',
  SETTINGS: 'workout_tracker_settings',
  PROGRESSIONS: 'workout_tracker_progressions',
  GOALS: 'workout_tracker_goals',
  EXERCISE_HISTORY: 'workout_tracker_exercise_history'
};

export const storage = {
  // Workouts
  getWorkouts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading workouts:', e);
      return [];
    }
  },

  saveWorkout: (workout) => {
    try {
      const workouts = storage.getWorkouts();
      const existingIndex = workouts.findIndex(w => w.id === workout.id);
      if (existingIndex >= 0) {
        workouts[existingIndex] = workout;
      } else {
        workouts.unshift(workout);
      }
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
      return true;
    } catch (e) {
      console.error('Error saving workout:', e);
      return false;
    }
  },

  deleteWorkout: (workoutId) => {
    try {
      const workouts = storage.getWorkouts();
      const filtered = workouts.filter(w => w.id !== workoutId);
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting workout:', e);
      return false;
    }
  },

  // Plans
  getPlans: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading plans:', e);
      return null;
    }
  },

  savePlans: (plans) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
      return true;
    } catch (e) {
      console.error('Error saving plans:', e);
      return false;
    }
  },

  // Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        theme: 'dark',
        notifications: true,
        reminderTime: '18:00',
        monthlyGoal: 12,
        language: 'ru'
      };
    } catch (e) {
      console.error('Error reading settings:', e);
      return { theme: 'dark', notifications: true, reminderTime: '18:00', monthlyGoal: 12, language: 'ru' };
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Error saving settings:', e);
      return false;
    }
  },

  // Progressions
  getProgressions: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading progressions:', e);
      return [];
    }
  },

  saveProgression: (progression) => {
    try {
      const progressions = storage.getProgressions();
      progressions.unshift(progression);
      localStorage.setItem(STORAGE_KEYS.PROGRESSIONS, JSON.stringify(progressions));
      return true;
    } catch (e) {
      console.error('Error saving progression:', e);
      return false;
    }
  },

  // Exercise History (for tracking consecutive completions)
  getExerciseHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISE_HISTORY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error reading exercise history:', e);
      return {};
    }
  },

  updateExerciseHistory: (exerciseId, completed, pain) => {
    try {
      const history = storage.getExerciseHistory();
      if (!history[exerciseId]) {
        history[exerciseId] = { consecutiveCompletions: 0, lastPain: 0 };
      }

      if (completed && pain <= 3) {
        history[exerciseId].consecutiveCompletions += 1;
      } else {
        history[exerciseId].consecutiveCompletions = 0;
      }
      history[exerciseId].lastPain = pain;

      localStorage.setItem(STORAGE_KEYS.EXERCISE_HISTORY, JSON.stringify(history));
      return history[exerciseId];
    } catch (e) {
      console.error('Error updating exercise history:', e);
      return null;
    }
  },

  resetExerciseHistory: (exerciseId) => {
    try {
      const history = storage.getExerciseHistory();
      if (history[exerciseId]) {
        history[exerciseId].consecutiveCompletions = 0;
      }
      localStorage.setItem(STORAGE_KEYS.EXERCISE_HISTORY, JSON.stringify(history));
      return true;
    } catch (e) {
      console.error('Error resetting exercise history:', e);
      return false;
    }
  },

  // Goals
  getGoals: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : { monthlyTarget: 12, currentMonth: new Date().getMonth() };
    } catch (e) {
      console.error('Error reading goals:', e);
      return { monthlyTarget: 12, currentMonth: new Date().getMonth() };
    }
  },

  saveGoals: (goals) => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      return true;
    } catch (e) {
      console.error('Error saving goals:', e);
      return false;
    }
  },

  // Export all data
  exportData: () => {
    try {
      const data = {
        workouts: storage.getWorkouts(),
        plans: storage.getPlans(),
        settings: storage.getSettings(),
        progressions: storage.getProgressions(),
        exerciseHistory: storage.getExerciseHistory(),
        goals: storage.getGoals(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (e) {
      console.error('Error exporting data:', e);
      return null;
    }
  },

  // Import data
  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.workouts) localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(data.workouts));
      if (data.plans) localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(data.plans));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.progressions) localStorage.setItem(STORAGE_KEYS.PROGRESSIONS, JSON.stringify(data.progressions));
      if (data.exerciseHistory) localStorage.setItem(STORAGE_KEYS.EXERCISE_HISTORY, JSON.stringify(data.exerciseHistory));
      if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  },

  // Clear all data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      console.error('Error clearing data:', e);
      return false;
    }
  }
};

export default storage;
