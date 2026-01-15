// Date helpers
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatShortDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  });
};

export const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert to Monday-first format
};

// ID generators
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Status helpers
export const getStatusColor = (status) => {
  const colors = {
    complete: 'bg-success',
    adapted: 'bg-warning',
    skipped: 'bg-danger',
    rest: 'bg-rest',
    sick: 'bg-gradient-to-r from-rest to-danger'
  };
  return colors[status] || 'bg-dark-600';
};

export const getStatusText = (status) => {
  const texts = {
    complete: 'Полная',
    adapted: 'Адаптировано',
    skipped: 'Пропущено',
    rest: 'Отдых',
    sick: 'Болезнь'
  };
  return texts[status] || status;
};

export const getStatusIcon = (status) => {
  const icons = {
    complete: '✓',
    adapted: '⚠',
    skipped: '✗',
    rest: '○',
    sick: '🤒'
  };
  return icons[status] || '?';
};

// Calculate workout statistics
export const calculateWorkoutStats = (workout) => {
  if (!workout.exerciseResults) return { complete: 0, adapted: 0, skipped: 0 };

  return workout.exerciseResults.reduce((acc, ex) => {
    acc[ex.status] = (acc[ex.status] || 0) + 1;
    return acc;
  }, { complete: 0, adapted: 0, skipped: 0 });
};

// Generate report text
export const generateReportText = (workout, plan) => {
  const stats = calculateWorkoutStats(workout);
  const date = formatDate(workout.date);

  let report = `📊 ОТЧЁТ О ТРЕНИРОВКЕ\n`;
  report += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  report += `📅 Дата: ${date}\n`;
  report += `🏋️ Тип: ${plan?.name || workout.planName}\n`;
  report += `⏱️ Время: ${formatTime(workout.duration)}\n`;
  report += `📈 Режим: ${workout.isLite ? 'ЛАЙТ' : 'КАНОН'}\n\n`;

  report += `📋 УПРАЖНЕНИЯ:\n`;
  report += `━━━━━━━━━━━━━━━━━━━━\n`;

  workout.exerciseResults?.forEach((ex, i) => {
    const icon = getStatusIcon(ex.status);
    report += `${i + 1}. ${ex.name}\n`;
    report += `   ${icon} ${ex.actualReps}/${ex.targetReps} повторов`;
    if (ex.weight && ex.weight !== 'BW') report += ` | ${ex.weight}`;
    report += `\n`;
    if (ex.notes) report += `   📝 ${ex.notes}\n`;
  });

  report += `\n💪 РЕЗУЛЬТАТ:\n`;
  report += `━━━━━━━━━━━━━━━━━━━━\n`;
  report += `✓ Выполнено: ${stats.complete || 0}\n`;
  report += `⚠ Адаптировано: ${stats.adapted || 0}\n`;
  report += `✗ Пропущено: ${stats.skipped || 0}\n\n`;

  report += `🩺 БОЛЬ:\n`;
  report += `━━━━━━━━━━━━━━━━━━━━\n`;
  report += `Спина: ${workout.backPain}/10\n`;
  report += `Колени: ${workout.kneePain}/10\n`;

  if (workout.notes) {
    report += `\n📝 ЗАМЕТКИ:\n`;
    report += `━━━━━━━━━━━━━━━━━━━━\n`;
    report += `${workout.notes}\n`;
  }

  return report;
};

// Monthly statistics
export const calculateMonthlyStats = (workouts, year, month) => {
  const monthWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const stats = {
    total: monthWorkouts.length,
    complete: 0,
    adapted: 0,
    skipped: 0,
    rest: 0,
    sick: 0,
    avgBackPain: 0,
    avgKneePain: 0,
    avgDuration: 0,
    totalDuration: 0
  };

  let backPainSum = 0;
  let kneePainSum = 0;
  let durationSum = 0;

  monthWorkouts.forEach(w => {
    stats[w.status] = (stats[w.status] || 0) + 1;
    backPainSum += w.backPain || 0;
    kneePainSum += w.kneePain || 0;
    durationSum += w.duration || 0;
  });

  if (monthWorkouts.length > 0) {
    stats.avgBackPain = Math.round((backPainSum / monthWorkouts.length) * 10) / 10;
    stats.avgKneePain = Math.round((kneePainSum / monthWorkouts.length) * 10) / 10;
    stats.avgDuration = Math.round(durationSum / monthWorkouts.length);
    stats.totalDuration = durationSum;
  }

  return stats;
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy:', e);
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (e2) {
      document.body.removeChild(textarea);
      return false;
    }
  }
};
