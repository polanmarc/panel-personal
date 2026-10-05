import { google } from 'googleapis'

function normalizeTask(task, taskList) {
  return {
    id: task.id,
    taskListId: taskList.id,
    title: task.title || 'Sin título',
    notes: task.notes || '',
    due: task.due ? task.due.slice(0, 10) : null,
    completed: task.status === 'completed',
    category: taskList.title || 'Google Tasks',
    priority: 'Media',
  }
}

async function getTaskLists(taskApi) {
  const taskLists = []
  let pageToken

  do {
    const response = await taskApi.tasklists.list({ maxResults: 100, pageToken })
    taskLists.push(...(response.data.items || []))
    pageToken = response.data.nextPageToken
  } while (pageToken)

  return taskLists
}

export async function listTasks(auth) {
  const taskApi = google.tasks({ version: 'v1', auth })
  const taskLists = await getTaskLists(taskApi)
  const groups = await Promise.all(taskLists.map(async (taskList) => {
    const tasks = []
    let pageToken

    do {
      const response = await taskApi.tasks.list({
        tasklist: taskList.id,
        maxResults: 100,
        pageToken,
        showCompleted: true,
        showHidden: true,
      })
      tasks.push(...(response.data.items || []))
      pageToken = response.data.nextPageToken
    } while (pageToken)

    return tasks.map((task) => normalizeTask(task, taskList))
  }))

  return groups.flat().sort((first, second) => {
    if (first.completed !== second.completed) return Number(first.completed) - Number(second.completed)
    return (first.due || '9999-12-31').localeCompare(second.due || '9999-12-31')
  })
}

async function selectTaskList(taskApi, category) {
  const taskLists = await getTaskLists(taskApi)
  const selected = category
    ? taskLists.find((taskList) => taskList.title?.toLowerCase() === category.trim().toLowerCase())
    : null
  if (selected) return selected

  if (category?.trim()) {
    const response = await taskApi.tasklists.insert({ requestBody: { title: category.trim() } })
    return response.data
  }

  const taskList = taskLists.find((item) => item.id === '@default') || taskLists[0]

  if (!taskList) {
    const error = new Error('No hay ninguna lista de Google Tasks disponible.')
    error.status = 400
    throw error
  }

  return taskList
}

function normalizeDueDate(value) {
  if (!value) return undefined
  const date = String(value)
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    const error = new Error('La fecha de la tarea no es válida.')
    error.status = 400
    throw error
  }
  return `${date}T00:00:00.000Z`
}

export async function createTask(auth, input) {
  const title = String(input.title || '').trim()
  if (!title) {
    const error = new Error('El título de la tarea es obligatorio.')
    error.status = 400
    throw error
  }

  const taskApi = google.tasks({ version: 'v1', auth })
  const taskList = await selectTaskList(taskApi, input.category)
  const response = await taskApi.tasks.insert({
    tasklist: taskList.id,
    requestBody: {
      title,
      notes: String(input.notes || '').trim() || undefined,
      due: normalizeDueDate(input.due),
    },
  })

  return normalizeTask(response.data, taskList)
}

export async function updateTask(auth, taskId, input) {
  const taskListId = String(input.taskListId || '').trim()
  if (!taskId || !taskListId || typeof input.completed !== 'boolean') {
    const error = new Error('La tarea, su lista y su estado son obligatorios.')
    error.status = 400
    throw error
  }

  const taskApi = google.tasks({ version: 'v1', auth })
  const response = await taskApi.tasks.patch({
    tasklist: taskListId,
    task: taskId,
    requestBody: {
      status: input.completed ? 'completed' : 'needsAction',
      ...(input.completed ? { completed: new Date().toISOString() } : {}),
    },
  })

  return normalizeTask(response.data, { id: taskListId, title: input.category || 'Google Tasks' })
}

export async function deleteTask(auth, taskId, taskListId) {
  if (!taskId || !taskListId) {
    const error = new Error('Falta la tarea o la lista que se va a eliminar.')
    error.status = 400
    throw error
  }

  const taskApi = google.tasks({ version: 'v1', auth })
  await taskApi.tasks.delete({ tasklist: taskListId, task: taskId })
}