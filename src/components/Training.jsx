import React, { useState, useEffect, useRef } from 'react';
import { Play, Check, AlertTriangle, X, Clock, ChevronDown, ChevronUp, Dumbbell, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';
import { checkProgression } from '../utils/progression';

const EXERCISE_STATUS = {
  COMPLETE: 'complete',
  ADAPTED: 'adapted',
  SKIPPED: 'skipped'
};

const ExerciseCard = ({ exercise, result, onUpdate, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [localReps, setLocalReps] = useState(result?.actualReps || exercise.reps);
  const [localNotes, setLocalNotes] = useState(result?.notes || '');

  const handleStatusChange = (status) => {
    onUpdate({
      exerciseId: exercise.id,
      name: exercise.name,
      status,
      targetReps: exercise.reps,
      actualReps: localReps,
      weight: exercise.weight,
      notes: localNotes,
      type: exercise.type
    });
  };

  const handleRepsChange = (newReps) => {
    setLocalReps(newReps);
    if (result?.status) {
      onUpdate({
        ...result,
        actualReps: newReps
      });
    }
  };

  const handleNotesChange = (notes) => {
    setLocalNotes(notes);
    if (result?.status) {
      onUpdate({
        ...result,
        notes
      });
    }
  };

  const statusColor = result?.status === 'complete' ? 'border-success' :
                      result?.status === 'adapted' ? 'border-warning' :
                      result?.status === 'skipped' ? 'border-danger' : 'border-dark-600';

  return (
    <div className={`card border-2 ${statusColor} transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-400 text-sm">#{index + 1}</span>
            <h4 className="font-medium">{exercise.name}</h4>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{exercise.sets}×{exercise.reps}{exercise.type === 'static' ? 'с' : ''}</span>
            {exercise.weight && exercise.weight !== 'BW' && (
              <span className="text-info">{exercise.weight}</span>
            )}
            {exercise.weight === 'BW' && (
              <span className="text-gray-500">Свой вес</span>
            )}
          </div>
          {exercise.notes && (
            <p className="text-xs text-gray-500 mt-1">{exercise.notes}</p>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-dark-700 rounded-lg"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Status buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={() => handleStatusChange(EXERCISE_STATUS.COMPLETE)}
          className={`py-3 rounded-lg flex items-center justify-center gap-1 transition-all ${
            result?.status === 'complete'
              ? 'bg-success text-white'
              : 'bg-dark-700 hover:bg-success/30 text-gray-300'
          }`}
        >
          <Check size={18} />
          <span className="text-sm">Готово</span>
        </button>
        <button
          onClick={() => handleStatusChange(EXERCISE_STATUS.ADAPTED)}
          className={`py-3 rounded-lg flex items-center justify-center gap-1 transition-all ${
            result?.status === 'adapted'
              ? 'bg-warning text-white'
              : 'bg-dark-700 hover:bg-warning/30 text-gray-300'
          }`}
        >
          <AlertTriangle size={18} />
          <span className="text-sm">Адапт.</span>
        </button>
        <button
          onClick={() => handleStatusChange(EXERCISE_STATUS.SKIPPED)}
          className={`py-3 rounded-lg flex items-center justify-center gap-1 transition-all ${
            result?.status === 'skipped'
              ? 'bg-danger text-white'
              : 'bg-dark-700 hover:bg-danger/30 text-gray-300'
          }`}
        >
          <X size={18} />
          <span className="text-sm">Пропуск</span>
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-dark-700 space-y-4 animate-fadeIn">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Фактические повторы: {localReps}{exercise.type === 'static' ? 'с' : ''}
            </label>
            <input
              type="range"
              min={0}
              max={exercise.reps * 2}
              value={localReps}
              onChange={(e) => handleRepsChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="text-info">Цель: {exercise.reps}</span>
              <span>{exercise.reps * 2}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Заметки к упражнению</label>
            <textarea
              value={localNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Боль, сложность, ощущения..."
              className="textarea h-20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const PlanSelector = ({ plans, onSelect, onBack }) => {
  const mainPlans = plans.filter(p => !p.isLite && !p.isCustom);

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-dark-700 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Выбор тренировки</h2>
      </div>

      <div className="space-y-4">
        {mainPlans.map((plan, index) => (
          <div key={plan.id} className="card">
            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{plan.duration}</p>

            <div className="space-y-1 mb-4">
              {plan.exercises.slice(0, 3).map((ex, i) => (
                <div key={i} className="text-sm text-gray-300">
                  {i + 1}. {ex.name} — {ex.sets}×{ex.reps}
                </div>
              ))}
              {plan.exercises.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{plan.exercises.length - 3} упражнений...
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelect(plan, false)}
                className="btn btn-primary"
              >
                <Dumbbell size={18} />
                КАНОН
              </button>
              <button
                onClick={() => {
                  const litePlan = plans.find(p => p.id === `${plan.id}_lite`);
                  onSelect(litePlan || plan, true);
                }}
                className="btn btn-secondary"
              >
                <Dumbbell size={18} />
                ЛАЙТ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Training = () => {
  const { plans, saveWorkout, setCurrentView, showNotification, addProgression, updatePlan } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLite, setIsLite] = useState(false);
  const [exerciseResults, setExerciseResults] = useState({});
  const [backPain, setBackPain] = useState(0);
  const [kneePain, setKneePain] = useState(0);
  const [notes, setNotes] = useState('');
  const [startTime] = useState(Date.now());
  const [showWarmup, setShowWarmup] = useState(true);
  const [progressionAlert, setProgressionAlert] = useState(null);

  const handleSelectPlan = (plan, lite) => {
    setSelectedPlan(plan);
    setIsLite(lite);
    setShowWarmup(true);
  };

  const handleBack = () => {
    if (selectedPlan) {
      setSelectedPlan(null);
      setExerciseResults({});
      setBackPain(0);
      setKneePain(0);
      setNotes('');
    } else {
      setCurrentView('calendar');
    }
  };

  const handleExerciseUpdate = (result) => {
    setExerciseResults(prev => ({
      ...prev,
      [result.exerciseId]: result
    }));
  };

  const calculateOverallStatus = () => {
    const results = Object.values(exerciseResults);
    if (results.length === 0) return 'skipped';

    const allComplete = results.every(r => r.status === 'complete');
    const hasSkipped = results.some(r => r.status === 'skipped');

    if (allComplete && backPain <= 3 && kneePain <= 3) return 'complete';
    if (hasSkipped) return 'adapted';
    return 'adapted';
  };

  const handleFinishWorkout = () => {
    const duration = Math.round((Date.now() - startTime) / 60000);
    const status = calculateOverallStatus();

    const workout = {
      id: generateId(),
      date: new Date().toISOString(),
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      isLite,
      status,
      duration,
      exerciseResults: Object.values(exerciseResults),
      backPain,
      kneePain,
      notes
    };

    // Check for progressions
    const progressions = [];
    selectedPlan.exercises.forEach(exercise => {
      const result = exerciseResults[exercise.id];
      if (result) {
        const progressionCheck = checkProgression(exercise, result, backPain, kneePain);
        if (progressionCheck.shouldProgress) {
          progressions.push(progressionCheck);
        }
      }
    });

    // Save workout
    saveWorkout(workout);

    // Handle progressions
    if (progressions.length > 0) {
      progressions.forEach(prog => {
        addProgression({
          id: generateId(),
          date: new Date().toISOString(),
          exerciseId: prog.exercise.id,
          exerciseName: prog.exercise.name,
          oldReps: prog.currentReps,
          newReps: prog.newReps,
          type: prog.type
        });

        // Update the plan
        const updatedPlan = {
          ...selectedPlan,
          exercises: selectedPlan.exercises.map(ex =>
            ex.id === prog.exercise.id ? { ...ex, reps: prog.newReps } : ex
          )
        };
        updatePlan(updatedPlan);
      });

      setProgressionAlert(progressions);
    } else {
      showNotification('Тренировка сохранена!', 'success');
      setCurrentView('calendar');
    }
  };

  const closeProgressionAlert = () => {
    setProgressionAlert(null);
    showNotification('Тренировка сохранена!', 'success');
    setCurrentView('calendar');
  };

  // Plan selection screen
  if (!selectedPlan) {
    return <PlanSelector plans={plans} onSelect={handleSelectPlan} onBack={handleBack} />;
  }

  const completedCount = Object.values(exerciseResults).filter(r => r.status).length;
  const totalExercises = selectedPlan.exercises.length;
  const progress = Math.round((completedCount / totalExercises) * 100);

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={handleBack} className="p-2 hover:bg-dark-700 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold">{selectedPlan.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className={isLite ? 'text-warning' : 'text-info'}>
              {isLite ? 'ЛАЙТ' : 'КАНОН'}
            </span>
            <span>•</span>
            <Clock size={14} />
            <span>{Math.round((Date.now() - startTime) / 60000)} мин</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Прогресс</span>
          <span>{completedCount}/{totalExercises}</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-3">
          <div
            className="bg-info h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Warmup section */}
      {selectedPlan.warmup && (
        <div className="card mb-4">
          <button
            onClick={() => setShowWarmup(!showWarmup)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-medium">Разминка</h3>
            {showWarmup ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showWarmup && (
            <div className="mt-3 space-y-2 animate-fadeIn">
              {selectedPlan.warmup.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-300">
                  <span>{item.name}</span>
                  <span className="text-gray-500">{item.reps}×</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-4 mb-6">
        {selectedPlan.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            result={exerciseResults[exercise.id]}
            onUpdate={handleExerciseUpdate}
            index={index}
          />
        ))}
      </div>

      {/* Pain sliders */}
      <div className="card mb-4">
        <h3 className="font-medium mb-4">Уровень боли</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Спина</span>
              <span className={`text-sm font-medium ${
                backPain > 5 ? 'text-danger' : backPain > 3 ? 'text-warning' : 'text-success'
              }`}>{backPain}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={backPain}
              onChange={(e) => setBackPain(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Колени</span>
              <span className={`text-sm font-medium ${
                kneePain > 5 ? 'text-danger' : kneePain > 3 ? 'text-warning' : 'text-success'
              }`}>{kneePain}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={kneePain}
              onChange={(e) => setKneePain(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card mb-6">
        <label className="block text-sm text-gray-400 mb-2">Заметки к тренировке</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Общие ощущения, самочувствие, что было сложно..."
          className="textarea h-24"
        />
      </div>

      {/* Finish button */}
      <button
        onClick={handleFinishWorkout}
        disabled={completedCount === 0}
        className={`btn w-full ${
          completedCount > 0 ? 'btn-success' : 'bg-dark-600 cursor-not-allowed'
        }`}
      >
        <Check size={20} />
        Завершить тренировку
      </button>

      {/* Progression Alert Modal */}
      {progressionAlert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-dark-800 rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">Прогрессия!</h3>
              <p className="text-gray-400">Ты стал сильнее! Нагрузка увеличена:</p>
            </div>

            <div className="space-y-3 mb-6">
              {progressionAlert.map((prog, i) => (
                <div key={i} className="card bg-dark-700 text-center">
                  <div className="font-medium">{prog.exercise.name}</div>
                  <div className="text-success">
                    {prog.type === 'static'
                      ? `${prog.currentReps}с → ${prog.newReps}с (+10 сек)`
                      : `${prog.exercise.sets}×${prog.currentReps} → ${prog.exercise.sets}×${prog.newReps} (+2 повтора)`
                    }
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={closeProgressionAlert}
              className="btn btn-success w-full"
            >
              Отлично!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
