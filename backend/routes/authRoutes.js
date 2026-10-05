import { Router } from 'express'
import { disconnectGoogle, finishGoogleAuth, getAuthStatus, startGoogleAuth } from '../controllers/authController.js'

const router = Router()

router.get('/status', getAuthStatus)
router.get('/google', startGoogleAuth)
router.get('/google/callback', finishGoogleAuth)
router.post('/logout', disconnectGoogle)

export default router