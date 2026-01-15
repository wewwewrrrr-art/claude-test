import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Modal = () => {
  const { modal, closeModal } = useApp();

  if (!modal) return null;

  const {
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    confirmStyle = 'primary',
    onConfirm
  } = modal;

  const confirmButtonClass = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning'
  }[confirmStyle] || 'btn-primary';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-dark-800 rounded-xl max-w-sm w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          {confirmStyle === 'danger' && (
            <div className="p-2 bg-danger/20 rounded-lg">
              <AlertTriangle size={24} className="text-danger" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{message}</p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-dark-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="btn btn-secondary flex-1"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${confirmButtonClass} flex-1`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
