import { useDashboard } from '../../context/DashboardContext.jsx'
import { formatCurrency } from '../../utils/formatters.js'
import KpiCard from './KpiCard.jsx'

export default function KpiGrid() {
  const { state, stats } = useDashboard()
  const next = stats.nextSubscription

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      <KpiCard icon="fa-calendar-check" label="Próximos Eventos" value={`${stats.events} agendados`} iconStyle="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
      <KpiCard icon="fa-list-check" label="Tareas Pendientes" value={`${stats.pendingTasks} tareas`} accent="text-amber-400" iconStyle="bg-amber-500/10 border-amber-500/20 text-amber-400" />
      <KpiCard icon="fa-graduation-cap" label="Ingeniería" value={`${stats.deliveries} entregas`} accent="text-sky-400" iconStyle="bg-sky-500/10 border-sky-500/20 text-sky-400" />
      <KpiCard icon="fa-wallet" label="Gastos Mes" value={formatCurrency(stats.totalExpenses)} accent="text-rose-400" iconStyle="bg-rose-500/10 border-rose-500/20 text-rose-400" />
      <KpiCard icon="fa-credit-card" label="Próx. Renovación" value={next ? `${next.title} · ${next.date}` : 'Sin renovaciones'} iconStyle="bg-red-500/10 border-red-500/20 text-red-400" />
      <KpiCard icon="fa-business-time" label="Turno Hoy" value={`${String(state.shift.start).padStart(2, '0')}:00 – ${String(state.shift.end).padStart(2, '0')}:00`} accent="text-indigo-300" iconStyle="bg-indigo-500/10 border-indigo-500/20 text-indigo-400" />
    </div>
  )
}
