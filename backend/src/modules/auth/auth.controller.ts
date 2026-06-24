import { Request, Response } from 'express'
import { authService } from './auth.service'
import { RegisterSchema, LoginSchema, UpdateProfileSchema, ChangePasswordSchema, ForgotPasswordSchema, ResetPasswordSchema } from './auth.schema'
import { t, translateZodErrors } from '../../utils/i18n'
import type { AuthRequest } from '../../middlewares/auth.middleware'
const authCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  partitioned: true,
  maxAge: 7 * 24 * 60 * 60 * 1000
}

export const authController = {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = RegisterSchema.parse(req.body)
      const result = await authService.register(data)
      res.cookie('token', result.token, authCookieOptions)
      res.status(201).json({ user: result.user })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: translateZodErrors(error.errors, req.locale) })
        return
      }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = LoginSchema.parse(req.body)
      const result = await authService.login(data)
      res.cookie('token', result.token, authCookieOptions)
      res.json({ user: result.user })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: translateZodErrors(error.errors, req.locale) })
        return
      }
      res.status(401).json({ error: t(error.message, req.locale) })
    }
  },
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getMe(req.userId!)
      res.json(user)
    } catch (error: any) {
      res.status(404).json({ error: t(error.message, req.locale) })
    }
  },

  async updateMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = UpdateProfileSchema.parse(req.body)
      const user = await authService.updateProfile(req.userId!, data)
      res.json(user)
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: translateZodErrors(error.errors, req.locale) })
        return
      }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = ChangePasswordSchema.parse(req.body)
      const result = await authService.changePassword(req.userId!, data.currentPassword, data.newPassword)
      res.json({ message: t(result.message, req.locale) })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: translateZodErrors(error.errors, req.locale) })
        return
      }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },
  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: authCookieOptions.sameSite,
      secure: authCookieOptions.secure,
      partitioned: authCookieOptions.partitioned
    })
    res.json({ message: 'Déconnecté' })
  },
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const data = ForgotPasswordSchema.parse(req.body)
      const result = await authService.forgotPassword(data.email, req.locale)
      res.json({ message: t(result.message, req.locale) })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: translateZodErrors(error.errors, req.locale) })
        return
      }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const data = ResetPasswordSchema.parse(req.body)
      const result = await authService.resetPassword(data.token, data.newPassword)
      res.json({ message: t(result.message, req.locale) })
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: translateZodErrors(error.errors, req.locale) })
        return
      }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },
  
}
