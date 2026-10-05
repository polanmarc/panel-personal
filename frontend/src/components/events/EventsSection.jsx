import { useState } from 'react'
import { useDashboard } from '../../context/DashboardContext.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

const PAGE_SIZE = 5

export default function EventsSection() {
  const { state, googleConnected, googleLoading, integrationError, connectGoogle, deleteEvent, openModal } = useDashboard()
  const [selectedTag, setSelectedTag] = useState('all')
  const [page, setPage] = useState(1)
  const action = googleConnected ? () => openModal('event') : connectGoogle
  const eventTypes = [...new Set(state.events.map((event) => event.tag).filter(Boolean))].sort((first, second) => first.localeCompare(second, 'es'))
  const filteredEvents = selectedTag === 'all'
    ? state.events
    : state.events.filter((event) => event.tag === selectedTag)
  const pageCount = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visibleEvents = filteredEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function formatDate(event) {
    if (!event.start) return 'Fecha sin especificar'
    const date = event.allDay ? new Date(`${event.start}T00:00:00`) : new Date(event.start)
    const options = event.allDay ? { dateStyle: 'medium' } : { dateStyle: 'medium', timeStyle: 'short' }
    return new Intl.DateTimeFormat('es-ES', options).format(date)
  }

  return (
    <section className="glass-card rounded-2xl p-5">
      <SectionHeader icon="fa-calendar-days" iconClass="text-emerald-400" title="Próximos Eventos" actionLabel={googleConnected ? 'Nuevo Evento' : 'Conectar con Google'} onAction={action} />
      {integrationError && <p role="alert" className="mb-3 text-xs text-rose-300">{integrationError}</p>}
      {googleConnected && state.events.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-[11px] text-slate-400">
            Tipo
            <select
              value={selectedTag}
              onChange={(event) => {
                setSelectedTag(event.target.value)
                setPage(1)
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todos</option>
              {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <span className="text-[10px] text-slate-500">{filteredEvents.length} eventos</span>
        </div>
      )}
      <div className="space-y-3">
        {googleLoading && <p className="py-5 text-center text-xs text-slate-500">Comprobando conexión con Google...</p>}
        {!googleLoading && !googleConnected && <p className="py-5 text-center text-xs text-slate-500">Conecta Google para ver tus próximos eventos.</p>}
        {googleConnected && state.events.length === 0 && !googleLoading && <p className="py-5 text-center text-xs text-slate-500">No hay próximos eventos.</p>}
        {googleConnected && filteredEvents.length === 0 && state.events.length > 0 && <p className="py-5 text-center text-xs text-slate-500">No hay eventos de este tipo.</p>}
        {googleConnected && visibleEvents.map((event) => (
          <div key={`${event.calendarId}:${event.id}`} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800 transition group gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`w-9 h-9 shrink-0 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center ${event.color || 'text-emerald-400'}`}>
                <i className={`fa-solid ${event.icon || 'fa-calendar'} text-sm`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{event.title}</p>
                <p className="text-[11px] text-slate-400"><i className="fa-regular fa-clock mr-1" />{formatDate(event)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {event.tag && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">{event.tag}</span>}
              {event.canEdit && <button onClick={() => deleteEvent(event)} aria-label="Eliminar evento" className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"><i className="fa-regular fa-trash-can text-xs" /></button>}
            </div>
          </div>
        ))}
      </div>
      {googleConnected && filteredEvents.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1"
          >
            <i className="fa-solid fa-chevron-left text-xs" />
          </button>
          <span className="text-[10px] text-slate-400">Página {currentPage} de {pageCount}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={currentPage === pageCount}
            aria-label="Página siguiente"
            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1"
          >
            <i className="fa-solid fa-chevron-right text-xs" />
          </button>
        </div>
      )}
    </section>
  )
}
