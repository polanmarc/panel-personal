export function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value) || 0)
}

export function formatLongDate(date = new Date()) {
  const text = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getPriorityClasses(priority = '') {
  switch (priority.toLowerCase()) {
    case 'alta':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    case 'media':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    default:
      return 'bg-slate-700 text-slate-300 border border-slate-600'
  }
}
