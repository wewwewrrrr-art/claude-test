import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, ChevronDown, ChevronUp, X, Save, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';
import { createLitePlan } from '../data/defaultPlans';

const ExerciseEditor = ({ exercise, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(exercise);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card bg-dark-700 space-y-3 animate-fadeIn">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="input"
          placeholder="Название упражнения"
        />
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-gray-400">Сеты</label>
            <input
              type="number"
              value={editData.sets}
              onChange={(e) => setEditData({ ...editData, sets: parseInt(e.target.value) || 1 })}
              className="input"
              min={1}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Повторы</label>
            <input
              type="number"
              value={editData.reps}
              onChange={(e) => setEditData({ ...editData, reps: parseInt(e.target.value) || 1 })}
              className="input"
              min={1}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Вес</label>
            <input
              type="text"
              value={editData.weight}
              onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
              className="input"
              placeholder="6 кг"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400">Тип</label>
            <select
              value={editData.type}
              onChange={(e) => setEditData({ ...editData, type: e.target.value })}
              className="input"
            >
              <option value="dynamic">Динамическое</option>
              <option value="static">Статическое</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Заметки</label>
            <input
              type="text"
              value={editData.notes || ''}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              className="input"
              placeholder="опционально"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="btn btn-success flex-1">
            <Save size={16} />
            Сохранить
          </button>
          <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
      <div>
        <div className="font-medium">{exercise.name}</div>
        <div className="text-sm text-gray-400">
          {exercise.sets}×{exercise.reps}{exercise.type === 'static' ? 'с' : ''}
          {exercise.weight && exercise.weight !== 'BW' && ` • ${exercise.weight}`}
          {exercise.notes && ` • ${exercise.notes}`}
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 hover:bg-dark-600 rounded-lg"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(exercise.id)}
          className="p-2 hover:bg-danger/20 rounded-lg text-danger"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const PlanEditor = ({ plan, onSave, onCancel }) => {
  const [editPlan, setEditPlan] = useState({ ...plan });

  const handleExerciseUpdate = (updatedExercise) => {
    setEditPlan({
      ...editPlan,
      exercises: editPlan.exercises.map(ex =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      )
    });
  };

  const handleExerciseDelete = (exerciseId) => {
    setEditPlan({
      ...editPlan,
      exercises: editPlan.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const handleAddExercise = () => {
    const newExercise = {
      id: generateId(),
      name: 'Новое упражнение',
      sets: 3,
      reps: 10,
      weight: 'BW',
      weightValue: 0,
      type: 'dynamic',
      notes: ''
    };
    setEditPlan({
      ...editPlan,
      exercises: [...editPlan.exercises, newExercise]
    });
  };

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 hover:bg-dark-700 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Редактирование плана</h2>
      </div>

      <div className="space-y-4">
        <div className="card">
          <label className="text-sm text-gray-400 mb-2 block">Название плана</label>
          <input
            type="text"
            value={editPlan.name}
            onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
            className="input"
          />
        </div>

        <div className="card">
          <label className="text-sm text-gray-400 mb-2 block">Длительность</label>
          <input
            type="text"
            value={editPlan.duration || ''}
            onChange={(e) => setEditPlan({ ...editPlan, duration: e.target.value })}
            className="input"
            placeholder="30-40 минут"
          />
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Упражнения</h3>
            <button
              onClick={handleAddExercise}
              className="btn btn-primary py-2 px-3"
            >
              <Plus size={16} />
              Добавить
            </button>
          </div>

          <div className="space-y-2">
            {editPlan.exercises.map((exercise, index) => (
              <ExerciseEditor
                key={exercise.id}
                exercise={exercise}
                onUpdate={handleExerciseUpdate}
                onDelete={handleExerciseDelete}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel} className="btn btn-secondary">
            <X size={18} />
            Отмена
          </button>
          <button
            onClick={() => onSave(editPlan)}
            className="btn btn-success"
          >
            <Save size={18} />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, onEdit, onDelete, onCopy, onCreateLite }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold">{plan.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <span>{plan.duration}</span>
            {plan.isLite && <span className="text-warning">(ЛАЙТ)</span>}
            {plan.isCustom && <span className="text-info">(Кастом)</span>}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-dark-700 rounded-lg"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 animate-fadeIn">
          <div className="space-y-2 mb-4">
            {plan.exercises.map((ex, i) => (
              <div key={ex.id} className="flex justify-between text-sm py-1 border-b border-dark-700 last:border-0">
                <span>{i + 1}. {ex.name}</span>
                <span className="text-gray-400">
                  {ex.sets}×{ex.reps}{ex.type === 'static' ? 'с' : ''}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onEdit(plan)} className="btn btn-secondary py-2">
              <Edit2 size={16} />
              Редактировать
            </button>
            <button onClick={() => onCopy(plan)} className="btn btn-secondary py-2">
              <Copy size={16} />
              Копировать
            </button>
            {!plan.isLite && (
              <button onClick={() => onCreateLite(plan)} className="btn btn-warning py-2">
                <Plus size={16} />
                Создать ЛАЙТ
              </button>
            )}
            <button onClick={() => onDelete(plan.id)} className="btn btn-danger py-2">
              <Trash2 size={16} />
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Plans = () => {
  const { plans, savePlans, updatePlan, addPlan, deletePlan, showNotification, showModal, closeModal } = useApp();
  const [editingPlan, setEditingPlan] = useState(null);

  const mainPlans = plans.filter(p => !p.isLite);
  const litePlans = plans.filter(p => p.isLite);

  const handleEdit = (plan) => {
    setEditingPlan(plan);
  };

  const handleSave = (updatedPlan) => {
    if (plans.find(p => p.id === updatedPlan.id)) {
      updatePlan(updatedPlan);
    } else {
      addPlan(updatedPlan);
    }
    setEditingPlan(null);
    showNotification('План сохранён!', 'success');
  };

  const handleDelete = (planId) => {
    showModal({
      title: 'Удалить план?',
      message: 'Это действие нельзя отменить.',
      confirmText: 'Удалить',
      confirmStyle: 'danger',
      onConfirm: () => {
        deletePlan(planId);
        showNotification('План удалён', 'success');
        closeModal();
      }
    });
  };

  const handleCopy = (plan) => {
    const newPlan = {
      ...plan,
      id: generateId(),
      name: `${plan.name} (копия)`,
      isCustom: true,
      exercises: plan.exercises.map(ex => ({ ...ex, id: generateId() }))
    };
    addPlan(newPlan);
    showNotification('План скопирован!', 'success');
  };

  const handleCreateLite = (plan) => {
    const litePlan = createLitePlan(plan);
    litePlan.id = generateId();
    addPlan(litePlan);
    showNotification('ЛАЙТ версия создана!', 'success');
  };

  const handleCreateNew = () => {
    const newPlan = {
      id: generateId(),
      name: 'Новый план',
      duration: '30 минут',
      isCustom: true,
      warmup: [
        { name: 'Вращения головой', reps: 10, type: 'dynamic' },
        { name: 'Cat-Camel', reps: 10, type: 'dynamic' },
        { name: 'Ягодичный мост', reps: 12, type: 'dynamic' }
      ],
      exercises: []
    };
    setEditingPlan(newPlan);
  };

  if (editingPlan) {
    return (
      <PlanEditor
        plan={editingPlan}
        onSave={handleSave}
        onCancel={() => setEditingPlan(null)}
      />
    );
  }

  return (
    <div className="p-4 pb-24 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Планы тренировок</h2>
        <button onClick={handleCreateNew} className="btn btn-primary py-2 px-3">
          <Plus size={18} />
          Новый
        </button>
      </div>

      {/* Main plans */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Основные планы</h3>
        <div className="space-y-3">
          {mainPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onCreateLite={handleCreateLite}
            />
          ))}
        </div>
      </div>

      {/* Lite plans */}
      {litePlans.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">ЛАЙТ версии</h3>
          <div className="space-y-3">
            {litePlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
                onCreateLite={handleCreateLite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
