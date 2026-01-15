import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import storage from '../utils/storage';
import { defaultPlans, createLitePlan } from '../data/defaultPlans';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Core state
  const [workouts, setWorkouts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [settings, setSettings] = useState({});
  const [progressions, setProgressions] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [currentView, setCurrentView] = useState('calendar');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notification, setNotification] = useState(null);
  const [modal, setModal] = useState(null);

  // Initialize data from localStorage
  useEffect(() => {
    const initializeData = () => {
      try {
        // Load workouts
        const savedWorkouts = storage.getWorkouts();
        setWorkouts(savedWorkouts);

        // Load plans or use defaults
        let savedPlans = storage.getPlans();
        if (!savedPlans || savedPlans.length === 0) {
          savedPlans = [...defaultPlans];
          // Also create lite versions
          defaultPlans.forEach(plan => {
            savedPlans.push(createLitePlan(plan));
          });
          storage.savePlans(savedPlans);
        }
        setPlans(savedPlans);

        // Load settings
        const savedSettings = storage.getSettings();
        setSettings(savedSettings);

        // Load progressions
        const savedProgressions = storage.getProgressions();
        setProgressions(savedProgressions);

        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Workout operations
  const saveWorkout = useCallback((workout) => {
    const success = storage.saveWorkout(workout);
    if (success) {
      setWorkouts(prev => {
        const exists = prev.findIndex(w => w.id === workout.id);
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = workout;
          return updated;
        }
        return [workout, ...prev];
      });
    }
    return success;
  }, []);

  const deleteWorkout = useCallback((workoutId) => {
    const success = storage.deleteWorkout(workoutId);
    if (success) {
      setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    }
    return success;
  }, []);

  const getWorkoutByDate = useCallback((date) => {
    const dateStr = new Date(date).toDateString();
    return workouts.find(w => new Date(w.date).toDateString() === dateStr);
  }, [workouts]);

  // Plan operations
  const savePlans = useCallback((newPlans) => {
    const success = storage.savePlans(newPlans);
    if (success) {
      setPlans(newPlans);
    }
    return success;
  }, []);

  const updatePlan = useCallback((updatedPlan) => {
    const newPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    return savePlans(newPlans);
  }, [plans, savePlans]);

  const addPlan = useCallback((plan) => {
    const newPlans = [...plans, plan];
    return savePlans(newPlans);
  }, [plans, savePlans]);

  const deletePlan = useCallback((planId) => {
    const newPlans = plans.filter(p => p.id !== planId);
    return savePlans(newPlans);
  }, [plans, savePlans]);

  const getPlanById = useCallback((planId) => {
    return plans.find(p => p.id === planId);
  }, [plans]);

  // Settings operations
  const updateSettings = useCallback((newSettings) => {
    const merged = { ...settings, ...newSettings };
    const success = storage.saveSettings(merged);
    if (success) {
      setSettings(merged);
    }
    return success;
  }, [settings]);

  // Progression operations
  const addProgression = useCallback((progression) => {
    const success = storage.saveProgression(progression);
    if (success) {
      setProgressions(prev => [progression, ...prev]);
    }
    return success;
  }, []);

  // Notification helper
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  }, []);

  // Modal helper
  const showModal = useCallback((modalConfig) => {
    setModal(modalConfig);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  // Export/Import
  const exportData = useCallback(() => {
    const data = storage.exportData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workout_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Данные экспортированы!', 'success');
    }
  }, [showNotification]);

  const importData = useCallback((jsonString) => {
    const success = storage.importData(jsonString);
    if (success) {
      // Reload all data
      setWorkouts(storage.getWorkouts());
      setPlans(storage.getPlans());
      setSettings(storage.getSettings());
      setProgressions(storage.getProgressions());
      showNotification('Данные импортированы!', 'success');
    } else {
      showNotification('Ошибка импорта данных', 'error');
    }
    return success;
  }, [showNotification]);

  const clearAllData = useCallback(() => {
    storage.clearAll();
    setWorkouts([]);
    setPlans([...defaultPlans, ...defaultPlans.map(createLitePlan)]);
    storage.savePlans([...defaultPlans, ...defaultPlans.map(createLitePlan)]);
    setSettings(storage.getSettings());
    setProgressions([]);
    showNotification('Все данные очищены', 'success');
  }, [showNotification]);

  const value = {
    // State
    workouts,
    plans,
    settings,
    progressions,
    loading,
    currentView,
    activeWorkout,
    selectedDate,
    notification,
    modal,

    // Setters
    setCurrentView,
    setActiveWorkout,
    setSelectedDate,

    // Workout ops
    saveWorkout,
    deleteWorkout,
    getWorkoutByDate,

    // Plan ops
    savePlans,
    updatePlan,
    addPlan,
    deletePlan,
    getPlanById,

    // Settings
    updateSettings,

    // Progressions
    addProgression,

    // Helpers
    showNotification,
    showModal,
    closeModal,
    exportData,
    importData,
    clearAllData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
