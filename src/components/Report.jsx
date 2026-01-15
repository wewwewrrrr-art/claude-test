import React from 'react';
import { Copy, Trash2, Save, X, Check, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, formatTime, generateReportText, getStatusColor, getStatusText, copyToClipboard } from '../utils/helpers';

const Report = ({ workout, plan, onClose, onDelete }) => {
  const { showNotification } = useApp();

  if (!workout) return null;

  const handleCopy = async () => {
    const text = generateReportText(workout, plan);
    const success = await copyToClipboard(text);
    if (success) {
      showNotification('Отчёт скопирован!', 'success');
    } else {
      showNotification('Не удалось скопировать', 'error');
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(workout.id);
    }
  };

  const stats = {
    complete: workout.exerciseResults?.filter(e => e.status === 'complete').length || 0,
    adapted: workout.exerciseResults?.filter(e => e.status === 'adapted').length || 0,
    skipped: workout.exerciseResults?.filter(e => e.status === 'skipped').length || 0
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-dark-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-800 p-4 border-b border-dark-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">Отчёт о тренировке</h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Status badge */}
          <div className={`p-3 rounded-lg ${getStatusColor(workout.status)} text-center`}>
            <span className="font-bold text-lg">{getStatusText(workout.status)}</span>
          </div>

          {/* Basic info */}
          <div className="card space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Дата</span>
              <span className="font-medium">{formatDate(workout.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Тренировка</span>
              <span className="font-medium">{workout.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Режим</span>
              <span className={`font-medium ${workout.isLite ? 'text-warning' : 'text-info'}`}>
                {workout.isLite ? 'ЛАЙТ' : 'КАНОН'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Длительность</span>
              <span className="font-medium">{formatTime(workout.duration)}</span>
            </div>
          </div>

          {/* Exercise results */}
          <div className="card">
            <h4 className="font-medium mb-3">Упражнения</h4>
            <div className="space-y-2">
              {workout.exerciseResults?.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{ex.name}</div>
                    <div className="text-xs text-gray-400">
                      {ex.actualReps}/{ex.targetReps} повторов
                      {ex.weight && ex.weight !== 'BW' && ` • ${ex.weight}`}
                    </div>
                    {ex.notes && (
                      <div className="text-xs text-gray-500 mt-1">{ex.notes}</div>
                    )}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ex.status === 'complete' ? 'bg-success/20' :
                    ex.status === 'adapted' ? 'bg-warning/20' : 'bg-danger/20'
                  }`}>
                    {ex.status === 'complete' ? (
                      <Check size={16} className="text-success" />
                    ) : ex.status === 'adapted' ? (
                      <AlertTriangle size={16} className="text-warning" />
                    ) : (
                      <X size={16} className="text-danger" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-dark-700 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-success">{stats.complete}</div>
                <div className="text-xs text-gray-400">Выполнено</div>
              </div>
              <div>
                <div className="text-xl font-bold text-warning">{stats.adapted}</div>
                <div className="text-xs text-gray-400">Адаптировано</div>
              </div>
              <div>
                <div className="text-xl font-bold text-danger">{stats.skipped}</div>
                <div className="text-xs text-gray-400">Пропущено</div>
              </div>
            </div>
          </div>

          {/* Pain levels */}
          <div className="card">
            <h4 className="font-medium mb-3">Уровень боли</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Спина</span>
                  <span className={`text-sm font-medium ${
                    workout.backPain > 5 ? 'text-danger' :
                    workout.backPain > 3 ? 'text-warning' : 'text-success'
                  }`}>{workout.backPain}/10</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      workout.backPain > 5 ? 'bg-danger' :
                      workout.backPain > 3 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${workout.backPain * 10}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Колени</span>
                  <span className={`text-sm font-medium ${
                    workout.kneePain > 5 ? 'text-danger' :
                    workout.kneePain > 3 ? 'text-warning' : 'text-success'
                  }`}>{workout.kneePain}/10</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      workout.kneePain > 5 ? 'bg-danger' :
                      workout.kneePain > 3 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${workout.kneePain * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {workout.notes && (
            <div className="card">
              <h4 className="font-medium mb-2">Заметки</h4>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{workout.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleCopy} className="btn btn-primary">
              <Copy size={18} />
              Копировать
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              <Trash2 size={18} />
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
