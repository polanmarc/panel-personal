import { Router } from 'express'
import { getEvents, postEvent, removeEvent } from '../controllers/calendarController.js'
import { requireGoogleAuth } from '../middleware/requireGoogleAuth.js'

const router = Router()

router.use(requireGoogleAuth)
router.get('/events', getEvents)
router.post('/events', postEvent)
router.delete('/events/:eventId', removeEvent)

export default router