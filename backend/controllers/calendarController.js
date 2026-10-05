import { createEvent, deleteEvent, listEvents } from '../services/calendarService.js'

export async function getEvents(req, res, next) {
  try {
    res.json(await listEvents(req.googleAuth))
  } catch (error) {
    next(error)
  }
}

export async function postEvent(req, res, next) {
  try {
    res.status(201).json(await createEvent(req.googleAuth, req.body))
  } catch (error) {
    next(error)
  }
}

export async function removeEvent(req, res, next) {
  try {
    await deleteEvent(req.googleAuth, req.query.calendarId, req.params.eventId)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}