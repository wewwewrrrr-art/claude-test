import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateMonthlyStats, formatDate } from '../utils/helpers';

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const COLORS = {
  complete: '#10B981',
  adapted: '#F59E0B',
  skipped: '#EF4444',
  rest: '#6B7280'
};

const StatCard = ({ icon: Icon, label, value, subValue, color = 'info' }) => (
  <div className="card">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-${color}/20`}>
        <Icon size={20} className={`text-${color}`} />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
        {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
      </div>
    </div>
  </div>
);

const Statistics = () => {
  const { workouts, progressions, settings } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthlyStats = useMemo(() => {
    return calculateMonthlyStats(workouts, year, month);
  }, [workouts, year, month]);

  // Chart data for workout types
  const workoutTypeData = useMemo(() => [
    { name: 'Полные', value: monthlyStats.complete, color: COLORS.complete },
    { name: 'Адапт.', value: monthlyStats.adapted, color: COLORS.adapted },
    { name: 'Пропуск', value: monthlyStats.skipped, color: COLORS.skipped }
  ], [monthlyStats]);

  // Chart data for pain over time
  const painChartData = useMemo(() => {
    const monthWorkouts = workouts
      .filter(w => {
        const d = new Date(w.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return monthWorkouts.map(w => ({
      date: new Date(w.date).getDate(),
      back: w.backPain,
      knees: w.kneePain
    }));
  }, [workouts, year, month]);

  // Bar chart data for workouts per week
  const weeklyData = useMemo(() => {
    const weeks = [
      { name: 'Неделя 1', complete: 0, adapted: 0, skipped: 0 },
      { name: 'Неделя 2', complete: 0, adapted: 0, skipped: 0 },
      { name: 'Неделя 3', complete: 0, adapted: 0, skipped: 0 },
      { name: 'Неделя 4', complete: 0, adapted: 0, skipped: 0 },
      { name: 'Неделя 5', complete: 0, adapted: 0, skipped: 0 }
    ];

    workouts
      .filter(w => {
        const d = new Date(w.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .forEach(w => {
        const day = new Date(w.date).getDate();
        const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
        weeks[weekIndex][w.status]++;
      });

    return weeks.filter(w => w.complete + w.adapted + w.skipped > 0);
  }, [workouts, year, month]);

  // Personal records
  const personalRecords = useMemo(() => {
    const records = {};
    workouts.forEach(workout => {
      workout.exerciseResults?.forEach(result => {
        if (result.status === 'complete') {
          if (!records[result.name] || result.actualReps > records[result.name].reps) {
            records[result.name] = {
              reps: result.actualReps,
              date: workout.date,
              weight: result.weight
            };
          }
        }
      });
    });
    return Object.entries(records).map(([name, data]) => ({ name, ...data }));
  }, [workouts]);

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(year, month + direction, 1));
  };

  const completionRate = monthlyStats.total > 0
    ? Math.round((monthlyStats.complete / monthlyStats.total) * 100)
    : 0;

  const goalProgress = settings.monthlyGoal
    ? Math.round((monthlyStats.total / settings.monthlyGoal) * 100)
    : 0;

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      {/* Header with month navigation */}
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['overview', 'progressions', 'records'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-info text-white'
                : 'bg-dark-700 hover:bg-dark-600'
            }`}
          >
            {tab === 'overview' && 'Обзор'}
            {tab === 'progressions' && 'Прогрессии'}
            {tab === 'records' && 'Рекорды'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Calendar}
              label="Тренировок"
              value={monthlyStats.total}
              subValue={`Цель: ${settings.monthlyGoal || 12}`}
              color="info"
            />
            <StatCard
              icon={TrendingUp}
              label="Выполнение"
              value={`${completionRate}%`}
              color="success"
            />
            <StatCard
              icon={Clock}
              label="Ср. время"
              value={`${monthlyStats.avgDuration} мин`}
              color="warning"
            />
            <StatCard
              icon={Award}
              label="Цель"
              value={`${goalProgress}%`}
              subValue={`${monthlyStats.total}/${settings.monthlyGoal || 12}`}
              color={goalProgress >= 100 ? 'success' : 'info'}
            />
          </div>

          {/* Pie chart */}
          <div className="card">
            <h3 className="font-medium mb-4">Распределение тренировок</h3>
            {monthlyStats.total > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workoutTypeData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {workoutTypeData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                Нет данных за этот месяц
              </div>
            )}
          </div>

          {/* Weekly bar chart */}
          {weeklyData.length > 0 && (
            <div className="card">
              <h3 className="font-medium mb-4">Тренировки по неделям</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="complete" stackId="a" fill={COLORS.complete} name="Полные" />
                    <Bar dataKey="adapted" stackId="a" fill={COLORS.adapted} name="Адапт." />
                    <Bar dataKey="skipped" stackId="a" fill={COLORS.skipped} name="Пропуск" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Pain chart */}
          {painChartData.length > 0 && (
            <div className="card">
              <h3 className="font-medium mb-4">Динамика боли</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={painChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis domain={[0, 10]} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="back"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="Спина"
                      dot={{ fill: '#EF4444' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="knees"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Колени"
                      dot={{ fill: '#F59E0B' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger" />
                  <span className="text-gray-400">Спина: {monthlyStats.avgBackPain}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-gray-400">Колени: {monthlyStats.avgKneePain}/10</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progressions Tab */}
      {activeTab === 'progressions' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-medium mb-4">История прогрессий</h3>
            {progressions.length > 0 ? (
              <div className="space-y-3">
                {progressions.slice(0, 20).map((prog, i) => (
                  <div key={prog.id || i} className="p-3 bg-dark-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{prog.exerciseName}</div>
                        <div className="text-success text-sm">
                          {prog.type === 'static'
                            ? `${prog.oldReps}с → ${prog.newReps}с (+10 сек)`
                            : `${prog.oldReps} → ${prog.newReps} (+2 повтора)`
                          }
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(prog.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                <p>Прогрессий пока нет</p>
                <p className="text-sm">Выполняй упражнения полностью 2 раза подряд!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Records Tab */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-medium mb-4">Личные рекорды</h3>
            {personalRecords.length > 0 ? (
              <div className="space-y-3">
                {personalRecords.map((record, i) => (
                  <div key={i} className="p-3 bg-dark-700 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">{record.name}</div>
                      <div className="text-xs text-gray-400">{formatDate(record.date)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-success">{record.reps}</div>
                      {record.weight && record.weight !== 'BW' && (
                        <div className="text-xs text-gray-400">{record.weight}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Award size={48} className="mx-auto mb-4 opacity-50" />
                <p>Рекордов пока нет</p>
                <p className="text-sm">Завершай тренировки, чтобы устанавливать рекорды!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
