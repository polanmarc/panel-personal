import { useDashboard } from '../../context/DashboardContext.jsx'
import { formatCurrency } from '../../utils/formatters.js'
import SectionHeader from '../ui/SectionHeader.jsx'

export default function SubscriptionsSection() {
  const { state, stats, dispatch, openModal } = useDashboard()
  const next = stats.nextSubscription
  const others = state.subscriptions.filter((item) => item.id !== next?.id)

  return (
    <section className="glass-card rounded-2xl p-5">
      <SectionHeader icon="fa-repeat" iconClass="text-indigo-400" title="Renovaciones & Pagos" onAction={() => openModal('subscription')} />

      {next && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 to-slate-800/80 border border-red-500/30 flex items-center justify-between mb-3 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-lg border border-red-500/30">
              <i className={`fa-solid ${next.icon || 'fa-credit-card'}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{next.title}</p>
              <p className="text-[11px] text-red-300 font-medium">Renovación: {next.date}</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-white whitespace-nowrap">{formatCurrency(next.price)}</span>
        </div>
      )}

      <div className="space-y-2">
        {others.map((sub) => (
          <div key={sub.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between group gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`w-8 h-8 shrink-0 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center ${sub.color || 'text-indigo-400'}`}>
                <i className={`fa-solid ${sub.icon || 'fa-credit-card'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{sub.title}</p>
                <p className="text-[10px] text-slate-400">Próx: {sub.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-200">{formatCurrency(sub.price)}</span>
              <button onClick={() => dispatch({ type: 'DELETE_SUBSCRIPTION', payload: sub.id })} className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"><i className="fa-regular fa-trash-can text-xs" /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
