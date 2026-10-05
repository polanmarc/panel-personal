import { formatLongDate } from '../../utils/formatters.js'
import { useDashboard } from '../../context/DashboardContext.jsx'

export default function Header() {
  const { openModal } = useDashboard()

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 font-bold text-xl">
            <i className="fa-solid fa-compass" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white tracking-tight truncate">Mi Panel Personal</h1>
            <p className="text-xs text-slate-400 truncate">{formatLongDate()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => openModal('task')} className="hidden sm:flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-md shadow-brand-600/20 active:scale-95">
            <i className="fa-solid fa-plus" />
            <span>Nueva Tarea</span>
          </button>
          <button onClick={() => openModal('expense')} className="hidden sm:flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition">
            <i className="fa-solid fa-euro-sign" />
            <span>Añadir Gasto</span>
          </button>
        </div>
      </div>
    </header>
  )
}
