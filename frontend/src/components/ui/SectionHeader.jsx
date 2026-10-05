export default function SectionHeader({ icon, iconClass = 'text-brand-400', title, badge, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 gap-3">
      <div className="flex items-center space-x-2 min-w-0">
        <i className={`fa-solid ${icon} ${iconClass} text-lg`} />
        <h2 className="text-base font-bold text-white truncate">{title}</h2>
        {badge && (
          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-slate-700 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      {onAction && (
        <button onClick={onAction} className={`${iconClass} hover:opacity-80 text-xs font-semibold flex items-center gap-1 transition whitespace-nowrap`}>
          <i className="fa-solid fa-plus text-[10px]" />
          {actionLabel && <span>{actionLabel}</span>}
        </button>
      )}
    </div>
  )
}
