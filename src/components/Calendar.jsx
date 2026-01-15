import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Edit2, Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDaysInMonth, getFirstDayOfMonth, isToday, formatDate, getStatusColor, getStatusText, isSameDay } from '../utils/helpers';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const DayModal = ({ date, workout, onClose, onStartWorkout, onEdit }) => {
  const { plans } = useApp();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-dark-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-800 p-4 border-b border-dark-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">{formatDate(date)}</h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {workout ? (
            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${getStatusColor(workout.status)}`}>
                <span className="font-medium">{getStatusText(workout.status)}</span>
              </div>

              <div className="card space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Тип:</span>
                  <span>{workout.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Режим:</span>
                  <span>{workout.isLite ? 'ЛАЙТ' : 'КАНОН'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Длительность:</span>
                  <span>{workout.duration} мин</span>
                </div>
              </div>

              <div className="card space-y-2">
                <h4 className="font-medium mb-2">Боль</h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Спина:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-dark-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${workout.backPain > 5 ? 'bg-danger' : workout.backPain > 3 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${workout.backPain * 10}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{workout.backPain}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Колени:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-dark-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${workout.kneePain > 5 ? 'bg-danger' : workout.kneePain > 3 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: `${workout.kneePain * 10}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{workout.kneePain}/10</span>
                  </div>
                </div>
              </div>

              {workout.exerciseResults && (
                <div className="card space-y-2">
                  <h4 className="font-medium mb-2">Упражнения</h4>
                  {workout.exerciseResults.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-dark-700 last:border-0">
                      <span className="text-sm">{ex.name}</span>
                      <span className={`text-sm px-2 py-0.5 rounded ${
                        ex.status === 'complete' ? 'bg-success/20 text-success' :
                        ex.status === 'adapted' ? 'bg-warning/20 text-warning' :
                        'bg-danger/20 text-danger'
                      }`}>
                        {ex.status === 'complete' ? '✓' : ex.status === 'adapted' ? '⚠' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {workout.notes && (
                <div className="card">
                  <h4 className="font-medium mb-2">Заметки</h4>
                  <p className="text-gray-300 text-sm">{workout.notes}</p>
                </div>
              )}

              <button
                onClick={() => onEdit(workout)}
                className="btn btn-secondary w-full"
              >
                <Edit2 size={18} />
                Редактировать
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">Нет записи о тренировке</div>
              {isToday(date) && (
                <button
                  onClick={onStartWorkout}
                  className="btn btn-primary"
                >
                  <Dumbbell size={18} />
                  Начать тренировку
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const { workouts, setCurrentView, setSelectedDate } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  }, [year, month]);

  const getWorkoutForDay = (date) => {
    return workouts.find(w => isSameDay(w.date, date));
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(year, month + direction, 1));
  };

  const handleDayClick = (dayInfo) => {
    if (dayInfo.isCurrentMonth) {
      setSelectedDay(dayInfo);
    }
  };

  const handleStartWorkout = () => {
    setSelectedDay(null);
    setCurrentView('training');
  };

  const handleEditWorkout = (workout) => {
    setSelectedDay(null);
    setSelectedDate(new Date(workout.date));
    setCurrentView('history');
  };

  // Calculate monthly stats
  const monthStats = useMemo(() => {
    const monthWorkouts = workouts.filter(w => {
      const d = new Date(w.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    return {
      total: monthWorkouts.length,
      complete: monthWorkouts.filter(w => w.status === 'complete').length,
      adapted: monthWorkouts.filter(w => w.status === 'adapted').length,
      skipped: monthWorkouts.filter(w => w.status === 'skipped').length
    };
  }, [workouts, year, month]);

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-dark-700 rounded-lg"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-dark-700 rounded-lg"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="card text-center py-2">
          <div className="text-2xl font-bold text-info">{monthStats.total}</div>
          <div className="text-xs text-gray-400">Всего</div>
        </div>
        <div className="card text-center py-2">
          <div className="text-2xl font-bold text-success">{monthStats.complete}</div>
          <div className="text-xs text-gray-400">Полных</div>
        </div>
        <div className="card text-center py-2">
          <div className="text-2xl font-bold text-warning">{monthStats.adapted}</div>
          <div className="text-xs text-gray-400">Адапт.</div>
        </div>
        <div className="card text-center py-2">
          <div className="text-2xl font-bold text-danger">{monthStats.skipped}</div>
          <div className="text-xs text-gray-400">Пропуск</div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-sm text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayInfo, index) => {
          const workout = getWorkoutForDay(dayInfo.date);
          const today = isToday(dayInfo.date);

          return (
            <button
              key={index}
              onClick={() => handleDayClick(dayInfo)}
              className={`
                aspect-square p-1 rounded-lg flex flex-col items-center justify-center
                transition-all relative
                ${dayInfo.isCurrentMonth ? 'hover:bg-dark-700' : 'opacity-30'}
                ${today ? 'ring-2 ring-info' : ''}
              `}
            >
              <span className={`text-sm ${today ? 'font-bold text-info' : ''}`}>
                {dayInfo.day}
              </span>
              {workout && dayInfo.isCurrentMonth && (
                <div className={`w-2 h-2 rounded-full mt-1 ${getStatusColor(workout.status)}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 card">
        <h3 className="text-sm font-medium mb-3">Легенда</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-gray-300">Полная</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-gray-300">Адаптировано</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger" />
            <span className="text-gray-300">Пропущено</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rest" />
            <span className="text-gray-300">Отдых</span>
          </div>
        </div>
      </div>

      {/* Day Modal */}
      {selectedDay && (
        <DayModal
          date={selectedDay.date}
          workout={getWorkoutForDay(selectedDay.date)}
          onClose={() => setSelectedDay(null)}
          onStartWorkout={handleStartWorkout}
          onEdit={handleEditWorkout}
        />
      )}
    </div>
  );
};

export default Calendar;
