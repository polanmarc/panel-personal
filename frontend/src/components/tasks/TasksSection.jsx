import { useDashboard } from '../../context/DashboardContext.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

export default function TasksSection() {
  const { state, stats, googleConnected, googleLoading, integrationError, connectGoogle, toggleTask, deleteTask, openModal } = useDashboard()
  const action = googleConnected ? () => openModal('task') : connectGoogle

  function formatDueDate(due) {
    if (!due) return 'Sin fecha'
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' })
      .format(new Date(`${due}T00:00:00`))
  }

  return (
    <section className="glass-card rounded-2xl p-5">
      <SectionHeader icon="fa-square-check" iconClass="text-amber-400" title="Tareas Pendientes" badge={`${stats.pendingTasks} pendientes`} actionLabel={googleConnected ? 'Añadir Tarea' : 'Conectar con Google'} onAction={action} />
      {integrationError && <p role="alert" className="mb-3 text-xs text-rose-300">{integrationError}</p>}
      <div className="space-y-2.5">
        {googleLoading && <div className="text-center py-6 text-slate-500 text-xs">Comprobando conexión con Google...</div>}
        {!googleLoading && !googleConnected && <div className="text-center py-6 text-slate-500 text-xs">Conecta Google para ver tus tareas.</div>}
        {googleConnected && state.tasks.length === 0 && !googleLoading && <div className="text-center py-6 text-slate-500 text-xs">No hay tareas creadas.</div>}
        {googleConnected && state.tasks.map((task) => (
          <div key={task.id} className={`flex items-center justify-between p-3 rounded-xl ${task.completed ? 'bg-slate-800/30 border border-slate-800/50 opacity-60' : 'bg-slate-800/70 border border-slate-700/60'} hover:border-slate-600 transition group`}>
            <div className="flex items-center space-x-3 overflow-hidden">
              <button onClick={() => toggleTask(task)} aria-label={task.completed ? 'Marcar tarea pendiente' : 'Completar tarea'} className={`w-5 h-5 rounded-md border ${task.completed ? 'bg-amber-500 border-amber-500 text-slate-900' : 'border-slate-600 hover:border-amber-400'} flex items-center justify-center text-xs transition`}>
                {task.completed && <i className="fa-solid fa-check" />}
              </button>
              <div className="truncate">
                <p className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'} truncate`}>{task.title}</p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-[10px] text-slate-400">{task.category}</span>
                  {task.due && <span className="text-[9px] px-1.5 rounded font-medium bg-slate-900 text-amber-300">{formatDueDate(task.due)}</span>}
                </div>
              </div>
            </div>
            <button onClick={() => deleteTask(task)} aria-label="Eliminar tarea" className="text-slate-500 hover:text-rose-400 p-1.5 opacity-0 group-hover:opacity-100 transition">
              <i className="fa-regular fa-trash-can text-xs" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
