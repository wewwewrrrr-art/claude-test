import React from 'react';
import { Check, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Notification = () => {
  const { notification } = useApp();

  if (!notification) return null;

  const { message, type = 'info' } = notification;

  const icons = {
    success: Check,
    error: X,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  };

  const Icon = icons[type] || icons.info;
  const bgColor = colors[type] || colors.info;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-fadeIn">
      <div className={`${bgColor} rounded-lg p-4 flex items-center gap-3 shadow-lg max-w-md mx-auto`}>
        <Icon size={20} className="flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
