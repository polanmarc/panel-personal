export const defaultData = {
  tasks: [],
  deliveries: [
    { id: 1, title: 'Proyecto Integrador de Estructuras', subject: 'Cálculo de Estructuras', date: '18 Octubre', progress: 65, status: 'En Progreso' },
    { id: 2, title: 'Informe de Electrónica de Potencia', subject: 'Sistemas Electrónicos', date: '25 Octubre', progress: 30, status: 'Pendiente' },
  ],
  expenses: {
    categories: [
      { name: 'Alquiler y Vivienda', amount: 750, color: '#6366f1' },
      { name: 'Supermercado y Alimentación', amount: 280, color: '#10b981' },
      { name: 'Ocio y Restauración', amount: 120, color: '#f59e0b' },
      { name: 'Servicios y Facturas', amount: 80, color: '#ef4444' },
      { name: 'Transporte', amount: 54, color: '#06b6d4' },
    ],
  },
  subscriptions: [
    { id: 1, title: 'Vodafone (Fibra y Móvil)', date: '14 Octubre', price: 39.9, icon: 'fa-wifi', color: 'text-red-400', isNext: true },
    { id: 2, title: 'Spotify Premium', date: '22 Octubre', price: 10.99, icon: 'fa-music', color: 'text-emerald-400', isNext: false },
    { id: 3, title: 'Gimnasio Municipal', date: '01 Noviembre', price: 35, icon: 'fa-dumbbell', color: 'text-sky-400', isNext: false },
  ],
  events: [],
  shift: {
    start: 14,
    end: 22,
    label: 'Tarde',
  },
}
