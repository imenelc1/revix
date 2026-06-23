import { Router } from 'express'
import { authController } from './auth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authRateLimiter } from '../../middlewares/rateLimit.middleware'

export const authRoutes = Router()

// POST /api/auth/register
authRoutes.post('/register', authRateLimiter, authController.register)

// POST /api/auth/login
authRoutes.post('/login', authRateLimiter, authController.login)

// GET /api/auth/me  (protégée — nécessite JWT)
authRoutes.get('/me', authMiddleware, authController.getMe)

// PUT /api/auth/me  — mettre à jour prénom/nom
authRoutes.put('/me', authMiddleware, authController.updateMe)

// PUT /api/auth/me/password — changer le mot de passe
authRoutes.put('/me/password', authMiddleware, authController.changePassword)