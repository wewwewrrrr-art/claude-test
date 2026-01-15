import React from 'react';
import { Calendar, Dumbbell, BarChart3, ClipboardList, History, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'calendar', icon: Calendar, label: 'Календарь' },
  { id: 'training', icon: Dumbbell, label: 'Тренировка' },
  { id: 'statistics', icon: BarChart3, label: 'Статистика' },
  { id: 'plans', icon: ClipboardList, label: 'Планы' },
  { id: 'history', icon: History, label: 'История' },
  { id: 'settings', icon: Settings, label: 'Настройки' }
];

const Navigation = () => {
  const { currentView, setCurrentView } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all ${
                isActive ? 'text-info' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={22} className={isActive ? 'animate-pulse-custom' : ''} />
              <span className="text-[10px] mt-1">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-info rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
