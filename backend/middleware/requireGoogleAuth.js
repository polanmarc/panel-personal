import { createOAuthClient } from '../config/googleOAuth.js'

export function requireGoogleAuth(req, res, next) {
  if (!req.session.googleTokens) {
    return res.status(401).json({ error: 'Conecta tu cuenta de Google para continuar.' })
  }

  const auth = createOAuthClient()
  auth.setCredentials(req.session.googleTokens)
  auth.on('tokens', (tokens) => {
    req.session.googleTokens = { ...req.session.googleTokens, ...tokens }
  })
  req.googleAuth = auth
  next()
}