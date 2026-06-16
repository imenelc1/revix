import { Router, Request, Response } from 'express'
import passport from '../../config/google.strategy'
import jwt from 'jsonwebtoken'
import { ENV } from '../../config/env'

export const googleRoutes = Router()

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

    // Générer le JWT
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    } as jwt.SignOptions)

    // Rediriger vers le frontend avec le token dans l'URL
    // Le frontend l'intercepte et le stocke dans localStorage
    res.redirect(`${ENV.FRONTEND_URL}/auth/callback?token=${token}`)
  }
)