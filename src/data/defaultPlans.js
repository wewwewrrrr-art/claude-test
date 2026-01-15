export const defaultPlans = [
  {
    id: 'day1',
    name: 'День 1 — Грудь + Плечи',
    duration: '30-40 минут',
    warmup: [
      { name: 'Вращения головой', reps: 10, type: 'dynamic' },
      { name: 'Cat-Camel', reps: 10, type: 'dynamic' },
      { name: 'Ягодичный мост', reps: 12, type: 'dynamic' }
    ],
    exercises: [
      {
        id: 'd1e1',
        name: 'Жим гантелей лёжа на полу',
        sets: 3,
        reps: 12,
        weight: '2×6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd1e2',
        name: 'Жим стоя одной рукой',
        sets: 3,
        reps: 10,
        weight: '6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd1e3',
        name: 'Отжимания обычные',
        sets: 3,
        reps: 10,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd1e4',
        name: 'Разведения гантелей лёжа',
        sets: 3,
        reps: 12,
        weight: '2×6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: 'опционально',
        optional: true
      },
      {
        id: 'd1e5',
        name: 'Подъём ног лёжа (пресс)',
        sets: 3,
        reps: 15,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: ''
      }
    ]
  },
  {
    id: 'day2',
    name: 'День 2 — Спина + Бицепс',
    duration: '30-40 минут',
    warmup: [
      { name: 'Вращения головой', reps: 10, type: 'dynamic' },
      { name: 'Cat-Camel', reps: 10, type: 'dynamic' },
      { name: 'Ягодичный мост', reps: 12, type: 'dynamic' }
    ],
    exercises: [
      {
        id: 'd2e1',
        name: 'Тяга гантели одной рукой',
        sets: 3,
        reps: 10,
        weight: '6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: 'с опорой на колено, за каждую руку'
      },
      {
        id: 'd2e2',
        name: 'Шраги',
        sets: 3,
        reps: 15,
        weight: '2×6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: 'поднимаем плечи'
      },
      {
        id: 'd2e3',
        name: 'Бицепс молот',
        sets: 3,
        reps: 10,
        weight: '6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd2e4',
        name: 'Планка',
        sets: 3,
        reps: 30,
        weight: 'BW',
        weightValue: 0,
        type: 'static',
        notes: 'секунды'
      },
      {
        id: 'd2e5',
        name: 'Скручивания на пресс',
        sets: 3,
        reps: 15,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: ''
      }
    ]
  },
  {
    id: 'day3',
    name: 'День 3 — Ноги + Пресс',
    duration: '30-40 минут',
    warmup: [
      { name: 'Вращения головой', reps: 10, type: 'dynamic' },
      { name: 'Cat-Camel', reps: 10, type: 'dynamic' },
      { name: 'Ягодичный мост', reps: 12, type: 'dynamic' }
    ],
    exercises: [
      {
        id: 'd3e1',
        name: 'Ягодичный мост с весом',
        sets: 3,
        reps: 15,
        weight: '6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: 'гантель на тазу'
      },
      {
        id: 'd3e2',
        name: 'Подъём ног лёжа',
        sets: 3,
        reps: 15,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd3e3',
        name: 'Обратные скручивания',
        sets: 3,
        reps: 20,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd3e4',
        name: 'Динамическая планка',
        sets: 3,
        reps: 20,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: 'чередуем предплечья'
      },
      {
        id: 'd3e5',
        name: 'Ягодичные мостики импульсные',
        sets: 2,
        reps: 20,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: 'быстро'
      }
    ]
  },
  {
    id: 'day4',
    name: 'День 4 — Лёгкий день',
    duration: '30 минут',
    warmup: [
      { name: 'Вращения головой', reps: 10, type: 'dynamic' },
      { name: 'Cat-Camel', reps: 10, type: 'dynamic' },
      { name: 'Ягодичный мост', reps: 12, type: 'dynamic' }
    ],
    exercises: [
      {
        id: 'd4e1',
        name: 'Отжимания с наклоном',
        sets: 3,
        reps: 12,
        weight: 'BW',
        weightValue: 0,
        type: 'dynamic',
        notes: 'руки выше'
      },
      {
        id: 'd4e2',
        name: 'Жим гантелей лёжа на полу',
        sets: 2,
        reps: 12,
        weight: '2×6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd4e3',
        name: 'Бицепс молот',
        sets: 2,
        reps: 12,
        weight: '6 кг',
        weightValue: 6,
        type: 'dynamic',
        notes: ''
      },
      {
        id: 'd4e4',
        name: 'Хват',
        sets: 3,
        reps: 20,
        weight: '8 кг',
        weightValue: 8,
        type: 'static',
        notes: 'держишь гантель за конец, секунды'
      },
      {
        id: 'd4e5',
        name: 'Планка',
        sets: 3,
        reps: 40,
        weight: 'BW',
        weightValue: 0,
        type: 'static',
        notes: 'секунды'
      }
    ]
  }
];

export const createLitePlan = (plan) => {
  return {
    ...plan,
    id: `${plan.id}_lite`,
    name: `${plan.name} (ЛАЙТ)`,
    isLite: true,
    exercises: plan.exercises.map(ex => ({
      ...ex,
      id: `${ex.id}_lite`,
      sets: Math.max(1, ex.sets - 1),
      reps: ex.type === 'static' ? Math.max(15, ex.reps - 10) : Math.max(6, ex.reps - 4)
    }))
  };
};
