import { Request, Response } from 'express'
import { authService } from './auth.service'
import { RegisterSchema, LoginSchema } from './auth.schema'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const authController = {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = RegisterSchema.parse(req.body)
      const result = await authService.register(data)
      res.status(201).json(result)
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: error.errors })
        return
      }
      res.status(400).json({ error: error.message })
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = LoginSchema.parse(req.body)
      const result = await authService.login(data)
      res.json(result)
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: error.errors })
        return
      }
      res.status(401).json({ error: error.message })
    }
  },

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getMe(req.userId!)
      res.json(user)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }
}
