import { randomBytes, timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { createOAuthClient, googleScopes } from '../config/googleOAuth.js'

export function getAuthStatus(req, res) {
  res.json({ connected: Boolean(req.session.googleTokens) })
}

export function startGoogleAuth(req, res, next) {
  const missingConfig = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI']
    .filter((key) => !process.env[key])
  if (missingConfig.length) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174'
    return res.redirect(`${frontendUrl}/?google_error=configuration`)
  }

  const state = randomBytes(32).toString('hex')
  req.session.oauthState = state
  const authUrl = createOAuthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: googleScopes,
    state,
  })
  req.session.save((error) => {
    if (error) return next(error)
    res.redirect(authUrl)
  })
}

export async function finishGoogleAuth(req, res) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174'
  const expectedState = typeof req.session.oauthState === 'string' ? req.session.oauthState : ''
  const providedState = typeof req.query.state === 'string' ? req.query.state : ''
  const expectedBytes = Buffer.from(expectedState)
  const providedBytes = Buffer.from(providedState)
  const validState = expectedBytes.length > 0
    && expectedBytes.length === providedBytes.length
    && timingSafeEqual(expectedBytes, providedBytes)

  delete req.session.oauthState
  if (!validState || !req.query.code) {
    return res.redirect(`${frontendUrl}/?google_error=oauth`)
  }

  try {
    const { tokens } = await createOAuthClient().getToken(req.query.code)
    req.session.googleTokens = tokens
    req.session.save((error) => {
      if (error) return res.redirect(`${frontendUrl}/?google_error=session`)
      res.redirect(`${frontendUrl}/?google=connected`)
    })
  } catch {
    res.redirect(`${frontendUrl}/?google_error=oauth`)
  }
}

export function disconnectGoogle(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error)
    res.clearCookie('panel.sid')
    res.json({ connected: false })
  })
}