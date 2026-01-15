import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Calendar from './components/Calendar';
import Training from './components/Training';
import Statistics from './components/Statistics';
import Plans from './components/Plans';
import History from './components/History';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import Modal from './components/Modal';
import Notification from './components/Notification';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-info border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Загрузка...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { currentView, loading } = useApp();

  if (loading) {
    return <LoadingScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <Calendar />;
      case 'training':
        return <Training />;
      case 'statistics':
        return <Statistics />;
      case 'plans':
        return <Plans />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Calendar />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-success" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="font-bold text-lg">Трекер Тренировок</h1>
          </div>
          <div className="text-xs text-gray-400">
            {new Date().toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short'
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto">
        {renderView()}
      </main>

      {/* Navigation */}
      <Navigation />

      {/* Modal overlay */}
      <Modal />

      {/* Notification toast */}
      <Notification />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
