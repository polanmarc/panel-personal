export default function KpiCard({ icon, label, value, accent = 'text-white', iconStyle = 'bg-brand-500/10 border-brand-500/20 text-brand-400' }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex items-center space-x-3 transition group">
      <div className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center text-lg group-hover:scale-110 transition-transform ${iconStyle}`}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="overflow-hidden">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className={`text-base font-bold truncate ${accent}`}>{value}</p>
      </div>
    </div>
  )
}
