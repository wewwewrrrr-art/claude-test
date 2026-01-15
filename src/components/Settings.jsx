import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, Bell, Target, Info, AlertTriangle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    clearAllData,
    showNotification,
    showModal,
    closeModal
  } = useApp();

  const fileInputRef = useRef(null);
  const [showAbout, setShowAbout] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const success = importData(result);
          if (!success) {
            showNotification('Ошибка чтения файла', 'error');
          }
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleClearAll = () => {
    showModal({
      title: 'Очистить все данные?',
      message: 'Это действие удалит все тренировки, планы и настройки. Рекомендуем сначала сделать резервную копию.',
      confirmText: 'Очистить всё',
      confirmStyle: 'danger',
      onConfirm: () => {
        clearAllData();
        closeModal();
      }
    });
  };

  const handleGoalChange = (value) => {
    updateSettings({ monthlyGoal: parseInt(value) || 12 });
  };

  const handleReminderChange = (value) => {
    updateSettings({ reminderTime: value });
  };

  const handleNotificationsToggle = () => {
    const newValue = !settings.notifications;
    updateSettings({ notifications: newValue });

    if (newValue && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          showNotification('Уведомления заблокированы браузером', 'warning');
        }
      });
    }
  };

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      <h2 className="text-xl font-bold mb-6">Настройки</h2>

      <div className="space-y-4">
        {/* Goals */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Target size={20} className="text-info" />
            <h3 className="font-medium">Цели</h3>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Цель тренировок в месяц: {settings.monthlyGoal || 12}
            </label>
            <input
              type="range"
              min={4}
              max={30}
              value={settings.monthlyGoal || 12}
              onChange={(e) => handleGoalChange(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>12</span>
              <span>20</span>
              <span>30</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-warning" />
            <h3 className="font-medium">Уведомления</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Напоминания о тренировке</span>
              <button
                onClick={handleNotificationsToggle}
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.notifications ? 'bg-success' : 'bg-dark-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {settings.notifications && (
              <div className="animate-fadeIn">
                <label className="text-sm text-gray-400 mb-2 block">Время напоминания</label>
                <input
                  type="time"
                  value={settings.reminderTime || '18:00'}
                  onChange={(e) => handleReminderChange(e.target.value)}
                  className="input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Data management */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Download size={20} className="text-info" />
            <h3 className="font-medium">Управление данными</h3>
          </div>

          <div className="space-y-3">
            <button onClick={exportData} className="btn btn-secondary w-full">
              <Download size={18} />
              Экспорт данных (JSON)
            </button>

            <button onClick={handleImportClick} className="btn btn-secondary w-full">
              <Upload size={18} />
              Импорт данных
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button onClick={handleClearAll} className="btn btn-danger w-full">
              <Trash2 size={18} />
              Очистить все данные
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="flex items-center gap-3 w-full"
          >
            <Info size={20} className="text-gray-400" />
            <h3 className="font-medium">О приложении</h3>
          </button>

          {showAbout && (
            <div className="mt-4 pt-4 border-t border-dark-700 animate-fadeIn">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={32} className="text-success" />
                </div>
                <h4 className="font-bold text-lg">Трекер Тренировок</h4>
                <p className="text-sm text-gray-400">Версия 1.0.0</p>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <h5 className="font-medium text-white mb-2">Для кого это приложение?</h5>
                  <p>Разработано специально для подростка 15 лет (рост 185 см, вес 55 кг) со сколиозом для безопасного отслеживания домашних тренировок.</p>
                </div>

                <div>
                  <h5 className="font-medium text-white mb-2">Система прогрессии</h5>
                  <p>Когда ты выполняешь упражнение полностью 2 раза подряд с болью ≤3/10, нагрузка автоматически увеличивается:</p>
                  <ul className="list-disc list-inside mt-2 text-gray-400">
                    <li>Динамические: +2 повтора</li>
                    <li>Статические: +10 секунд</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-white mb-2">Режимы тренировки</h5>
                  <ul className="list-disc list-inside text-gray-400">
                    <li><span className="text-info">КАНОН</span> — полная программа</li>
                    <li><span className="text-warning">ЛАЙТ</span> — облегчённая версия (меньше сетов и повторов)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-white mb-2">Советы</h5>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Делай резервные копии регулярно</li>
                    <li>Если боль &gt;5, пропусти упражнение</li>
                    <li>Отдыхай минимум 1 день между тренировками</li>
                    <li>Слушай своё тело!</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="flex gap-2">
                  <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-warning">
                    При острой боли, головокружении или плохом самочувствии — немедленно прекрати тренировку и обратись к врачу!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User info card */}
        <div className="card bg-gradient-to-br from-dark-700 to-dark-800">
          <h3 className="font-medium mb-3">Твои параметры</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-info">15</div>
              <div className="text-xs text-gray-400">Возраст</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-info">185</div>
              <div className="text-xs text-gray-400">Рост, см</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-info">55</div>
              <div className="text-xs text-gray-400">Вес, кг</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Программа адаптирована для занятий со сколиозом
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
