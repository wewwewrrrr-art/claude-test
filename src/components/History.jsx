import React, { useState, useMemo } from 'react';
import { Search, Trash2, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, formatShortDate, getStatusColor, getStatusText } from '../utils/helpers';
import Report from './Report';

const History = () => {
  const { workouts, deleteWorkout, getPlanById, showNotification, showModal, closeModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredWorkouts = useMemo(() => {
    let filtered = [...workouts];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(w => w.status === filterStatus);
    }

    // Filter by search query (date or plan name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w =>
        w.planName?.toLowerCase().includes(query) ||
        formatDate(w.date).toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [workouts, searchQuery, filterStatus]);

  const handleDelete = (workoutId) => {
    showModal({
      title: 'Удалить тренировку?',
      message: 'Это действие нельзя отменить.',
      confirmText: 'Удалить',
      confirmStyle: 'danger',
      onConfirm: () => {
        deleteWorkout(workoutId);
        setSelectedWorkout(null);
        showNotification('Тренировка удалена', 'success');
        closeModal();
      }
    });
  };

  // Group workouts by month
  const groupedWorkouts = useMemo(() => {
    const groups = {};
    filteredWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[key]) {
        groups[key] = {
          label: date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
          workouts: []
        };
      }
      groups[key].workouts.push(workout);
    });
    return Object.values(groups);
  }, [filteredWorkouts]);

  const WorkoutCard = ({ workout }) => {
    const stats = {
      complete: workout.exerciseResults?.filter(e => e.status === 'complete').length || 0,
      total: workout.exerciseResults?.length || 0
    };

    return (
      <button
        onClick={() => setSelectedWorkout(workout)}
        className="w-full card hover:bg-dark-700 transition-all text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(workout.status)}`} />
              <span className="font-medium">{workout.planName}</span>
              {workout.isLite && (
                <span className="text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded">ЛАЙТ</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatShortDate(workout.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {workout.duration} мин
              </span>
              <span>{stats.complete}/{stats.total}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex gap-1">
                {workout.backPain > 3 && (
                  <span className="text-xs bg-danger/20 text-danger px-1.5 py-0.5 rounded">
                    Спина {workout.backPain}
                  </span>
                )}
                {workout.kneePain > 3 && (
                  <span className="text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded">
                    Колени {workout.kneePain}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      <h2 className="text-xl font-bold mb-6">История тренировок</h2>

      {/* Search and filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по дате или названию..."
            className="input pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {[
            { value: 'all', label: 'Все' },
            { value: 'complete', label: 'Полные' },
            { value: 'adapted', label: 'Адапт.' },
            { value: 'skipped', label: 'Пропуск' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                filterStatus === filter.value
                  ? 'bg-info text-white'
                  : 'bg-dark-700 hover:bg-dark-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="card mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-info">{workouts.length}</div>
            <div className="text-xs text-gray-400">Всего</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {workouts.filter(w => w.status === 'complete').length}
            </div>
            <div className="text-xs text-gray-400">Полных</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">
              {workouts.length > 0
                ? Math.round(workouts.reduce((acc, w) => acc + (w.duration || 0), 0) / workouts.length)
                : 0
              } мин
            </div>
            <div className="text-xs text-gray-400">Ср. время</div>
          </div>
        </div>
      </div>

      {/* Workout list */}
      {groupedWorkouts.length > 0 ? (
        <div className="space-y-6">
          {groupedWorkouts.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-sm font-medium text-gray-400 mb-3 capitalize">
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.workouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">
            {searchQuery || filterStatus !== 'all'
              ? 'Ничего не найдено'
              : 'История пуста'
            }
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery || filterStatus !== 'all'
              ? 'Попробуйте изменить фильтры'
              : 'Завершите свою первую тренировку!'
            }
          </p>
        </div>
      )}

      {/* Report Modal */}
      {selectedWorkout && (
        <Report
          workout={selectedWorkout}
          plan={getPlanById(selectedWorkout.planId)}
          onClose={() => setSelectedWorkout(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default History;
