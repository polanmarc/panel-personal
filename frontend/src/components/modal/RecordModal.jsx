import { useState } from 'react'
import { useDashboard } from '../../context/DashboardContext.jsx'
import { modalConfig } from './modalConfig.js'

const emptyForm = { title: '', subtitle: '', val1: '', val2: '' }

export default function RecordModal() {
  const { modalType, closeModal, dispatch, createEvent, createTask, googleConnected, integrationError } = useDashboard()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (!modalType) return null
  const config = modalConfig[modalType]
  if (!config) return null

  function dismiss() {
    setForm(emptyForm)
    setSubmitError('')
    closeModal()
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    const id = Date.now()
    setSubmitting(true)
    setSubmitError('')

    try {
      let saved = true

      if (modalType === 'task') {
        saved = await createTask({
          title: form.title.trim(),
          category: form.subtitle.trim(),
          due: form.val1 || null,
          notes: form.val2.trim(),
        })
      }

      if (modalType === 'event') {
        saved = await createEvent({
          title: form.title.trim(),
          start: new Date(form.val1).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          description: form.subtitle.trim(),
        })
      }

      if (modalType === 'delivery') {
        dispatch({ type: 'ADD_DELIVERY', payload: { id, title: form.title.trim(), subject: form.subtitle.trim() || 'Ingeniería', date: form.val1.trim() || 'Por definir', progress: Math.min(100, Math.max(0, Number(form.val2) || 0)), status: 'Pendiente' } })
      }

      if (modalType === 'expense') {
        dispatch({ type: 'ADD_EXPENSE', payload: { category: form.subtitle.trim() || 'Varios', amount: Number(form.val1) || 0, concept: form.title.trim(), date: form.val2.trim() || 'Hoy' } })
      }

      if (modalType === 'subscription') {
        dispatch({ type: 'ADD_SUBSCRIPTION', payload: { id, title: form.title.trim(), date: form.subtitle.trim() || 'Por definir', price: Number(form.val1) || 0, icon: form.val2.trim() || 'fa-credit-card', color: 'text-indigo-400', isNext: false } })
      }

      if (saved) dismiss()
      else setSubmitError(integrationError || 'No se pudo guardar en Google. Comprueba la conexión e inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const requiresGoogle = modalType === 'task' || modalType === 'event'

  return (
    <div onMouseDown={(event) => event.target === event.currentTarget && dismiss()} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white">{config.title}</h3>
          <button onClick={dismiss} className="text-slate-400 hover:text-white p-1 rounded-lg"><i className="fa-solid fa-xmark text-lg" /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{field.label}</label>
              <input
                type={field.type || 'text'}
                step={field.step}
                required={field.required}
                value={form[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {(submitError || integrationError) && <p role="alert" className="text-xs text-rose-300">{integrationError || submitError}</p>}

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={dismiss} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700">Cancelar</button>
            <button type="submit" disabled={submitting || (requiresGoogle && !googleConnected)} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20">{submitting ? 'Guardando...' : 'Guardar Registro'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
