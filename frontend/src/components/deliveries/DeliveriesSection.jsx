import { useDashboard } from '../../context/DashboardContext.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

export default function DeliveriesSection() {
  const { state, dispatch, openModal } = useDashboard()

  return (
    <section className="glass-card rounded-2xl p-5">
      <SectionHeader icon="fa-graduation-cap" iconClass="text-sky-400" title="Ingeniería: Entregas Académicas" badge={`${state.deliveries.length} pendientes`} actionLabel="Nueva Entrega" onAction={() => openModal('delivery')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.deliveries.map((item) => (
          <article key={item.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-sky-500/30 transition relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">{item.subject}</span>
                <h3 className="text-xs font-bold text-white mt-0.5">{item.title}</h3>
              </div>
              <button onClick={() => dispatch({ type: 'DELETE_DELIVERY', payload: item.id })} className="text-slate-500 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 transition">
                <i className="fa-regular fa-trash-can" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span><i className="fa-regular fa-clock mr-1 text-slate-500" />Fecha: <strong className="text-slate-200">{item.date}</strong></span>
              <span className="text-sky-300 font-semibold">{item.progress}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
