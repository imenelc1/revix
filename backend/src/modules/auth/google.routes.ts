import { Router, Request, Response } from 'express'
import passport from '../../config/google.strategy'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { ENV } from '../../config/env'

export const googleRoutes = Router()

const OAUTH_CODE_TTL_MS = 60 * 1000
const pendingOAuthCodes = new Map<string, { token: string; user: any; expiresAt: number }>()

const authCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  partitioned: true,
  maxAge: 7 * 24 * 60 * 60 * 1000
}
// ─── Étape 1 : Rediriger vers Google ──────────────────────────────────────────
// GET /api/auth/google
googleRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

// ─── Étape 2 : Callback Google → générer JWT → rediriger vers frontend ────────
// GET /api/auth/google/callback
googleRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${ENV.FRONTEND_URL}/login?error=google_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    } as jwt.SignOptions)
    const code = crypto.randomBytes(32).toString('hex')
    const timeout = setTimeout(() => pendingOAuthCodes.delete(code), OAUTH_CODE_TTL_MS)

    timeout.unref()
    pendingOAuthCodes.set(code, {
      token,
      user,
      expiresAt: Date.now() + OAUTH_CODE_TTL_MS,
    })

    res.redirect(`${ENV.FRONTEND_URL}/auth/callback?code=${code}`)
  }
)

// GET /api/auth/exchange?code=<one-time-token>
googleRoutes.get('/exchange', (req: Request, res: Response) => {
  const code = typeof req.query.code === 'string' ? req.query.code : null

  if (!code) {
    res.status(400).json({ error: 'Code manquant' })
    return
  }

  const pending = pendingOAuthCodes.get(code)
  pendingOAuthCodes.delete(code)

  if (!pending || pending.expiresAt < Date.now()) {
    res.status(401).json({ error: 'Code invalide ou expiré' })
    return
  }

  const user = pending.user
  res.cookie('token', pending.token, authCookieOptions)
  res.json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      isGoogleAccount: !!user.googleId,
    },
  })
})
