import storage from './storage';

export const checkProgression = (exercise, exerciseResult, backPain, kneePain) => {
  // Don't progress if pain is too high
  const maxPain = Math.max(backPain, kneePain);
  if (maxPain > 3) {
    return { shouldProgress: false, reason: 'pain_too_high' };
  }

  // Don't progress if exercise wasn't completed fully
  if (exerciseResult.status !== 'complete') {
    storage.resetExerciseHistory(exercise.id);
    return { shouldProgress: false, reason: 'not_completed' };
  }

  // Update history and check consecutive completions
  const history = storage.updateExerciseHistory(exercise.id, true, maxPain);

  if (history && history.consecutiveCompletions >= 2) {
    // Reset counter after progression
    storage.resetExerciseHistory(exercise.id);

    return {
      shouldProgress: true,
      exercise: exercise,
      currentReps: exercise.reps,
      newReps: exercise.type === 'static' ? exercise.reps + 10 : exercise.reps + 2,
      type: exercise.type
    };
  }

  return {
    shouldProgress: false,
    reason: 'need_more_completions',
    completions: history?.consecutiveCompletions || 0
  };
};

export const applyProgression = (plans, exerciseId, newReps) => {
  return plans.map(plan => ({
    ...plan,
    exercises: plan.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, reps: newReps } : ex
    )
  }));
};

export const getProgressionMessage = (exercise, newReps) => {
  if (exercise.type === 'static') {
    return `${exercise.name}: ${exercise.reps}с → ${newReps}с (+10 секунд)`;
  }
  return `${exercise.name}: ${exercise.sets}×${exercise.reps} → ${exercise.sets}×${newReps} (+2 повтора)`;
};

export const calculatePersonalRecords = (workouts) => {
  const records = {};

  workouts.forEach(workout => {
    if (!workout.exerciseResults) return;

    workout.exerciseResults.forEach(result => {
      if (result.status === 'complete') {
        const key = result.exerciseId;
        if (!records[key]) {
          records[key] = {
            name: result.name,
            maxReps: result.actualReps,
            maxWeight: result.weight,
            date: workout.date
          };
        } else {
          if (result.actualReps > records[key].maxReps) {
            records[key].maxReps = result.actualReps;
            records[key].date = workout.date;
          }
        }
      }
    });
  });

  return records;
};

export const getProgressionRecommendations = (exerciseHistory, exercises) => {
  const recommendations = [];

  exercises.forEach(exercise => {
    const history = exerciseHistory[exercise.id];
    if (history && history.consecutiveCompletions === 1) {
      recommendations.push({
        exercise: exercise,
        message: `${exercise.name} — ещё 1 полное выполнение для прогрессии!`,
        progress: 50
      });
    }
  });

  return recommendations;
};
