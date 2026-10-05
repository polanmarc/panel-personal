import { createTask, deleteTask, listTasks, updateTask } from '../services/tasksService.js'

export async function getTasks(req, res, next) {
  try {
    res.json(await listTasks(req.googleAuth))
  } catch (error) {
    next(error)
  }
}

export async function postTask(req, res, next) {
  try {
    res.status(201).json(await createTask(req.googleAuth, req.body))
  } catch (error) {
    next(error)
  }
}

export async function patchTask(req, res, next) {
  try {
    res.json(await updateTask(req.googleAuth, req.params.taskId, req.body))
  } catch (error) {
    next(error)
  }
}

export async function removeTask(req, res, next) {
  try {
    await deleteTask(req.googleAuth, req.params.taskId, req.query.taskListId)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}