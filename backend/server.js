import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import process from 'node:process'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import authRoutes from './routes/authRoutes.js'
import calendarRoutes from './routes/calendarRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()
const port = Number(process.env.PORT || 3001)
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174'

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)

app.use(cors({ origin: frontendUrl, credentials: true }))
app.use(express.json())
app.use(session({
  name: 'panel.sid',
  secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}))

app.use('/auth', authRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error)
  const status = error.status || error.response?.status || 500
  const message = status < 500 ? error.message : 'Error al comunicarse con Google.'
  if (status >= 500) console.error(error)
  res.status(status).json({ error: message })
})

app.listen(port, () => {
  console.log(`Backend disponible en http://localhost:${port}`)
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
    console.warn('Configura las variables GOOGLE_* en backend/.env para habilitar OAuth.')
  }
})