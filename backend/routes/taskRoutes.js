import { Router } from 'express'
import { getTasks, patchTask, postTask, removeTask } from '../controllers/tasksController.js'
import { requireGoogleAuth } from '../middleware/requireGoogleAuth.js'

const router = Router()

router.use(requireGoogleAuth)
router.get('/', getTasks)
router.post('/', postTask)
router.patch('/:taskId', patchTask)
router.delete('/:taskId', removeTask)

export default router