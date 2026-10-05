async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'No se pudo completar la sincronización con Google.')
  return result
}

function jsonBody(value) {
  return JSON.stringify(value)
}

export function getGoogleAuthStatus() {
  return request('/auth/status')
}

export function getGoogleEvents() {
  return request('/api/calendar/events')
}

export function createGoogleEvent(event) {
  return request('/api/calendar/events', { method: 'POST', body: jsonBody(event) })
}

export function deleteGoogleEvent(event) {
  const query = new URLSearchParams({ calendarId: event.calendarId })
  return request(`/api/calendar/events/${encodeURIComponent(event.id)}?${query}`, { method: 'DELETE' })
}

export function getGoogleTasks() {
  return request('/api/tasks')
}

export function createGoogleTask(task) {
  return request('/api/tasks', { method: 'POST', body: jsonBody(task) })
}

export function updateGoogleTask(task, completed) {
  return request(`/api/tasks/${encodeURIComponent(task.id)}`, {
    method: 'PATCH',
    body: jsonBody({ taskListId: task.taskListId, category: task.category, completed }),
  })
}

export function deleteGoogleTask(task) {
  const query = new URLSearchParams({ taskListId: task.taskListId })
  return request(`/api/tasks/${encodeURIComponent(task.id)}?${query}`, { method: 'DELETE' })
}