import { Router } from 'express'
import { authController } from './auth.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

export const authRoutes = Router()

// POST /api/auth/register
authRoutes.post('/register', authController.register)

// POST /api/auth/login
authRoutes.post('/login', authController.login)

// GET /api/auth/me  (protégée — nécessite JWT)
authRoutes.get('/me', authMiddleware, authController.getMe)
