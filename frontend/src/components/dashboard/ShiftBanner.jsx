import { useEffect, useState } from 'react'
import { useDashboard } from '../../context/DashboardContext.jsx'
import { getShiftProgress } from '../../utils/shift.js'

export default function ShiftBanner() {
  const { state } = useDashboard()
  const { start, end, label } = state.shift
  const [progress, setProgress] = useState(() => getShiftProgress(start, end))

  useEffect(() => {
    setProgress(getShiftProgress(start, end))
    const timer = setInterval(() => setProgress(getShiftProgress(start, end)), 60_000)
    return () => clearInterval(timer)
  }, [start, end])

  const midpoint = start + (end - start) / 2
  const hours = end - start
  const hh = (value) => `${String(Math.floor(value)).padStart(2, '0')}:00`

  return (
    <div className="glass-card rounded-2xl p-5 border-l-4 border-l-indigo-500 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 mt-0.5">
            <i className="fa-solid fa-user-clock text-xl" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                Turno Asignado
              </span>
              <span className="text-xs text-slate-400">{label}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Jornada de Trabajo: <span className="text-indigo-400">{hh(start)} h – {hh(end)} h</span>
            </h2>
            <p className="text-xs text-slate-400">Duración total: {hours} horas | Recuerda registrar descansos</p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-400">Estado del turno</span>
            <span className="text-indigo-400">{progress.status}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress.percentage}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{hh(start)}</span><span>{hh(midpoint)}</span><span>{hh(end)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
