import { Request, Response } from 'express'
import { authService } from './auth.service'
import { RegisterSchema, LoginSchema, UpdateProfileSchema, ChangePasswordSchema } from './auth.schema'
import { t, translateZodErrors } from '../../utils/i18n'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const authController = {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = RegisterSchema.parse(req.body)
      const result = await authService.register(data)
      res.status(201).json(result)
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
      res.json(result)
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
  }
}